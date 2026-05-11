import { motion } from "framer-motion";

export default function KPIStatCard({
                                        title,
                                        value,
                                        icon,
                                        color,
                                    }) {

    return (

        <motion.div
            whileHover={{ y: -5 }}
            className="rounded-[30px] bg-white p-6 shadow-xl transition-all"
        >

            <div className="flex items-center justify-between">

                <div>

                    <p className="font-medium text-slate-500">

                        {title}

                    </p>

                    <h2
                        className={`mt-4 text-5xl font-black ${color}`}
                    >

                        {value}

                    </h2>

                </div>

                <div className="rounded-2xl bg-slate-100 p-4 text-slate-700">

                    {icon}

                </div>

            </div>

        </motion.div>
    );
}