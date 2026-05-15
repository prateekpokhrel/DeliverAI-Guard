import { motion } from "framer-motion";

export default function KPIStatCard({
                                        title,
                                        value,
                                        icon,
                                        color,
                                    }) {

    return (

        <motion.div
            whileHover={{ y: -6 }}
            className="rounded-[24px] bg-gradient-to-br from-white/95 to-white p-5 shadow-md transition-all"
        >

            <div className="flex items-center justify-between">

                <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">
                        {title}
                    </p>

                    <h2 className={`mt-3 text-4xl font-extrabold ${color}`}>
                        {value}
                    </h2>
                </div>

                <div className="rounded-full bg-gradient-to-br from-orange-100 to-orange-200 p-3 text-orange-600 shadow-sm">
                    {icon}
                </div>

            </div>

        </motion.div>
    );
}