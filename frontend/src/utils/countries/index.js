// src/utils/countries.js

const countries = [
    { code: "US", label: "United States (+1)", phoneMask: "+1 (###) ###-####" },
    { code: "EC", label: "Ecuador (+593)", phoneMask: "+593 ## ### ####" },
    { code: "CO", label: "Colombia (+57)", phoneMask: "+57 ### ### ####" },
    { code: "MX", label: "Mexico (+52)", phoneMask: "+52 ## #### ####" },
    { code: "ES", label: "Spain (+34)", phoneMask: "+34 ### ### ###" },
];

// Opciones simplificadas para selects
export const phoneCodeOptions = countries.map((c) => ({
    id: c.code,
    label: c.label,
}));

export default countries;
