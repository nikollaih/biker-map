export const CATEGORIES = [
    { id: 'pueblo',      label: 'Pueblo',      icon: '🏘️' },
    { id: 'mirador',     label: 'Mirador',     icon: '🔭' },
    { id: 'naturaleza',  label: 'Naturaleza',  icon: '🌿' },
    { id: 'cascada',     label: 'Cascada',     icon: '💧' },
    { id: 'ciudad',      label: 'Ciudad',      icon: '🏙️' },
    { id: 'restaurante', label: 'Restaurante', icon: '🍽️' },
    { id: 'iglesia',     label: 'Iglesia',     icon: '⛪' },
    { id: 'camping',     label: 'Camping',     icon: '⛺' },
    { id: 'playa',       label: 'Playa / Lago',icon: '🏖️' },
    { id: 'ruta',        label: 'Ruta',        icon: '🛣️' },
];

export const getCategoryById = (id) => CATEGORIES.find((c) => c.id === id);
