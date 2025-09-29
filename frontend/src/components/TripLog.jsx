export default function TripLog({ logSegments }) {
    if (!logSegments) return null


    const rowHeight = 40
    const width = 960
    const height = rowHeight * 4 + 20


    const laneY = {
        off: rowHeight * 1,
        sleeper: rowHeight * 2,
        drive: rowHeight * 3,
        onduty: rowHeight * 4,
    }


    const scaleX = (h) => (h / 24) * width


    let path = ""
    logSegments.forEach((seg, i) => {
        const x1 = scaleX(seg.start_h)
        const x2 = scaleX(seg.end_h)
        const y = laneY[seg.type] || 0

        if (i === 0) {
            path += `M ${x1},${y} `
        } else {

            const prevY = laneY[logSegments[i - 1].type]
            if (prevY !== y) {
                path += `V ${y} `
            }
        }
        path += `H ${x2} `
    })

    return (
        <svg width={width + 50} height={height} style={{ border: "1px solid #ccc", marginTop: "20px" }}>

            {[...Array(25).keys()].map((h) => (
                <g key={h}>
                    <line
                        x1={scaleX(h)}
                        y1={20}
                        x2={scaleX(h)}
                        y2={height - 20}
                        stroke="#ddd"
                    />
                    <text x={scaleX(h)} y={15} fontSize="10" textAnchor="middle">
                        {h}
                    </text>
                </g>
            ))}


            {Object.entries(laneY).map(([type, y]) => (
                <g key={type}>
                    <line x1={0} y1={y} x2={width} y2={y} stroke="#bbb" />
                    <text x={width + 5} y={y + 4} fontSize="12" textAnchor="start">
                        {type.toUpperCase()}
                    </text>
                </g>
            ))}


            <path d={path} stroke="black" strokeWidth="3" fill="none" />
        </svg>
    )
}

