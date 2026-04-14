import { CATEGORIES } from "../constants/categories.js";

export default function CategoryFilter({ active, onChange }) {
    const toggle = (id) => onChange(active === id ? null : id);

    return (
        <div className={'flex gap-2 overflow-x-auto px-3 py-2 bg-white border-b border-gray-100 scrollbar-none'}>
            {CATEGORIES.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => toggle(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all cursor-pointer flex-shrink-0
                        ${active === cat.id
                            ? 'bg-orange-500 border-orange-500 text-white'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
                        }`}
                >
                    <span>{cat.icon}</span>
                    <span className={'hidden sm:inline'}>{cat.label}</span>
                </button>
            ))}
        </div>
    );
}
