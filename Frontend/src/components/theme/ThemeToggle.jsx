import {
    Moon,
    Sun,
} from "lucide-react";

import {
    useTheme,
} from "../../context/ThemeContext";

export default function ThemeToggle() {

    const {
        darkMode,
        toggleTheme,
    } = useTheme();

    return (

        <button
            onClick={toggleTheme}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm transition hover:scale-[1.03] dark:border-slate-700 dark:bg-slate-800"
        >

            {darkMode ? (
                <>
                    <Sun
                        size={18}
                        className="text-yellow-400"
                    />

                    <span className="text-sm font-semibold text-white">

            Light

          </span>
                </>
            ) : (
                <>
                    <Moon
                        size={18}
                        className="text-slate-700"
                    />

                    <span className="text-sm font-semibold text-slate-700">

            Dark

          </span>
                </>
            )}

        </button>
    );
}