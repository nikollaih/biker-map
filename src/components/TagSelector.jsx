import { CATEGORIES } from "../constants/categories.js";

export default function TagSelector({ selected = [], onChange }) {
    const toggle = (id) => {
        if (selected.includes(id)) {
            onChange(selected.filter((t) => t !== id));
        } else if (selected.length < 2) {
            onChange([...selected, id]);
        }
    };

    return (
        <div className={'flex flex-wrap gap-2'}>
            {CATEGORIES.map((cat) => {
                const active = selected.includes(cat.id);
                const disabled = !active && selected.length >= 2;
                return (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggle(cat.id)}
                        disabled={disabled}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer
                            ${active
                                ? 'bg-orange-500 border-orange-500 text-white'
                                : disabled
                                    ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
                            }`}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
