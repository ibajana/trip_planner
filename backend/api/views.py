from itertools import cycle

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status
import sys
import requests
from .models import Trip
from .serializers import TripSerializer
from datetime import datetime, timedelta, date

PICKUP_H = 1.0
DROPOFF_H = 1.0
FUEL_STOP_H = 0.5
DAILY_DRIVE_MAX = 11.0
DAILY_ONDUTY_MAX = 14.0
BREAK_AFTER_DRIVE_H = 8.0
BREAK_DURATION_H = 0.5
SLEEPER_H = 10.0
CYCLE_H = 70.0
FUEL_EVERY_MILES = 1000

def health(request):
    """Endpoint for health check (only for testing purposes)"""
    return JsonResponse({"error": False, 'message': 'Healthy'})

UA = {"User-Agent": "eld-demo/1.0 (isaiasbajana@gmail.com)"}

def geocode(place:str):
    """Use Nominatim to get lat and long from a place by its name"""
    url = 'https://nominatim.openstreetmap.org/search'
    try:
        params = {
            'q': place,
            'format': 'json',
            'limit':1
        }
        r =requests.get(url,params=params,headers=UA,timeout=20)
        r.raise_for_status()
        data = r.json()
        if not data:
            raise ValueError(f'No data returned for {place}')
        #lat/lon
        return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as ex:
        raise RuntimeError(f'geocode error: {ex}')


def osrm_route(coord_a,coord_b):
    """Ask OSRM to get a route from a to b"""
    url = f"https://router.project-osrm.org/route/v1/driving/{coord_a[1]},{coord_a[0]};{coord_b[1]},{coord_b[0]}"
    try:
        r = requests.get(url, params={"overview": "full", "geometries": "geojson"}, timeout=20)
        r.raise_for_status()
        data = r.json()
        if not data.get("routes"):
            raise ValueError("No se encontró ruta")
        route = data["routes"][0]
        return {
            "coords": route["geometry"]["coordinates"],  # list [lon, lat]
            "distance_m": route["distance"],
            "duration_s": route["duration"],
        }
    except Exception as ex:
        raise RuntimeError(f'osrm route error: {ex}')

def plan_hos(total_drive_hours:float, cycle_used_hours:float):
    """Generate segments considering HOS rules"""
    segments = []
    t = 0.0
    drive_used=0.0
    onduty_used = 0.0


    def add_segment(seg_type, hrs):
        nonlocal t, drive_used, onduty_used
        if hrs <= 0:
            return
        start =t
        end = min(24.0,t+hrs)
        segments.append({
            "type": seg_type,
            "start_h": round(start,2),
            "end_h": round(end,2)
        })
        t =end
        if seg_type in ('drive', 'onduty'):
            onduty_used += (end - start)
        if seg_type == 'drive':
            drive_used += (end - start)

    max_cycle_drive = max(0,CYCLE_H - cycle_used_hours)
    max_drive_possible = min(total_drive_hours, max_cycle_drive, DAILY_DRIVE_MAX)

    add_segment("onduty", PICKUP_H)

    while drive_used < max_drive_possible and onduty_used < DAILY_ONDUTY_MAX and t < 24.0:
        remaining_drive = max_drive_possible - drive_used
        if drive_used < BREAK_AFTER_DRIVE_H:
            chunk = min(remaining_drive, BREAK_AFTER_DRIVE_H - drive_used, DAILY_ONDUTY_MAX - onduty_used)
        else:
            chunk = min(remaining_drive, DAILY_DRIVE_MAX - drive_used, DAILY_ONDUTY_MAX - onduty_used)

        add_segment("drive", chunk)

        if BREAK_AFTER_DRIVE_H <= drive_used < DAILY_DRIVE_MAX:
            add_segment("off", BREAK_DURATION_H)

        if drive_used >= max_drive_possible:
            break

    if onduty_used < DAILY_ONDUTY_MAX and t < 24.0:
        add_segment("onduty", DROPOFF_H)

        # night rest
    if t < 24.0:
        add_segment("sleeper", min(SLEEPER_H, 24.0 - t))

        # the remaining = Off Duty
    if t < 24.0:
        add_segment("off", 24.0 - t)

    return segments

def plan_hos_multi_day(total_drive_hours: float, cycle_used_hours: float):
    """split long trips in more than one day"""
    remaining_drive = total_drive_hours
    sheets = []
    cycle_remaining = max(0, CYCLE_H - cycle_used_hours)
    today = date.today()
    day_index = 0
    while remaining_drive > 0 and cycle_remaining > 0:
        day_drive = min(remaining_drive, DAILY_DRIVE_MAX, cycle_remaining)
        day_segments = plan_hos(day_drive, cycle_used_hours)
        # sheets.append(day_segments)
        sheets.append({
            "date": (today + timedelta(days=day_index)).isoformat(),
            "segments": day_segments
        })
        remaining_drive -= day_drive
        cycle_remaining -= day_drive
        cycle_used_hours += day_drive
        day_index += 1
    return sheets



def fuel_stops_segments(segments, fuel_stops_count):
    """on-duty segment for fueling """
    if fuel_stops_count <=0:
        return segments
    total_drive_time = sum(s["end_h"] - s["start_h"] for s in segments if s["type"] == "drive")
    if total_drive_time == 0:
        return segments
    interval = total_drive_time / (fuel_stops_count+1)
    drive_accum = 0.0
    stops_added = 0
    new_segments = []
    for seg in segments:
        if seg["type"] == "drive" and stops_added < fuel_stops_count:
            seg_duration = seg["end_h"] - seg["start_h"]
            start_h = seg["start_h"]

            while stops_added < fuel_stops_count and (drive_accum + seg_duration) >= (interval * (stops_added + 1)):
                stop_pos = seg["start_h"] + (interval * (stops_added + 1) - drive_accum)
                new_segments.append({"type": "drive", "start_h": start_h, "end_h": stop_pos})
                stop_end = min(stop_pos + 0.5, 24.0)
                new_segments.append({"type": "onduty", "start_h": stop_pos, "end_h": stop_end})
                start_h = stop_end
                stops_added += 1

            if start_h < seg["end_h"]:
                new_segments.append({"type": "drive", "start_h": start_h, "end_h": seg["end_h"]})
        else:
            new_segments.append(seg)
        if seg["type"] == "drive":
            drive_accum += seg["end_h"] - seg["start_h"]
    return new_segments


@api_view(['POST'])
def plan_trip(request):
    """Endpoint to calculate the route plan"""
    try:
        origin = request.data.get('origin')
        pickup = request.data.get('pickup')
        dropoff = request.data.get('dropoff')
        cycle_used = request.data.get('cycle_used_hours', 0) #Hours of Service
        if not all([origin, pickup, dropoff]):
            return  Response({'error': True, 'message': 'Missing data'}, status=status.HTTP_400_BAD_REQUEST)
        coord_o = geocode(origin)
        coord_p = geocode(pickup)
        coord_d = geocode(dropoff)
        leg1 = osrm_route(coord_o, coord_p)
        leg2 = osrm_route(coord_p, coord_d)
        distance_total_m = leg1["distance_m"] + leg2["distance_m"]
        duration_total_s = leg1["duration_s"] + leg2["duration_s"]
        miles = round(distance_total_m / 1609.34, 1) #meters to miles
        drive_hours = round(duration_total_s / 3600.0, 2) #seconds to hours
        multi_day_sheets = plan_hos_multi_day(drive_hours, float(cycle_used))
        #Fuel
        fuel_stops = int(miles // FUEL_EVERY_MILES)
        coords = leg1["coords"] + leg2["coords"]

        def coord_at_ratio(ratio):
            """Returns coordinate [lat, lon] at a proportional position of the route"""
            idx = min(len(coords) - 1, max(0, int(ratio * (len(coords) - 1))))
            lon, lat = coords[idx]
            return {"lat": lat, "lon": lon}

        stops = []
        for i in range(1, fuel_stops + 1):
            ratio = min(0.99, (i * 1000) / miles)  # position aprox
            stops.append({
                "type": "fuel",
                "mile_marker": i * 1000,
                **coord_at_ratio(ratio)
            })
        log_sheets = []
        for idx, sheet in enumerate(multi_day_sheets):
            segs = sheet["segments"]
            if idx == 0 and fuel_stops > 0:
                segs = fuel_stops_segments(segs, fuel_stops)
            log_sheets.append({
                "date": sheet["date"],
                "segments": segs
            })


        return Response(
            {
                "error": False,
                "summary": {
                    "origin": origin,
                    "pickup": pickup,
                    "dropoff": dropoff,
                    "cycle_used_hours": cycle_used,
                    "distance_miles": miles,
                    "drive_hours_est": drive_hours,
                },
                "geojson": {
                    "type": "LineString",
                    "coordinates": leg1["coords"] + leg2["coords"],
                },
                "waypoints": {
                    "origin": {"lat": coord_o[0], "lon": coord_o[1]},
                    "pickup": {"lat": coord_p[0], "lon": coord_p[1]},
                    "dropoff": {"lat": coord_d[0], "lon": coord_d[1]},
                },
                "stops": stops,
                "log_sheets": log_sheets,
            }
        )

    except Exception as ex:
        line_eer = 'Error on line {}'.format(sys.exc_info()[-1].tb_lineno)
        print(f"Error: {ex.__str__()}. {line_eer}") # just for fast code development debug
        return Response(
            {"error": True, "message": str(ex)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def save_trip(request):
    serializer = TripSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_trips(request):
    trips = Trip.objects.all().order_by('-created_at')
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def trip_detail(request, trip_id):
    try:
        trip = Trip.objects.get(pk=trip_id)
        serializer = TripSerializer(trip)
        return Response(serializer.data)
    except Trip.DoesNotExist:
        return Response({"error": "Trip not found"}, status=status.HTTP_404_NOT_FOUND)
