import {
    Bell,
    AlertTriangle,
    ShieldAlert,
    Truck,
} from "lucide-react";

import {
    motion,
    AnimatePresence,
} from "framer-motion";

export default function AlertCenter({
                                        deliveries,
                                    }) {

    const alerts =
        deliveries
            .filter(
                (d) =>
                    d.predictedRisk ===
                    "HIGH" ||
                    d.traffic === "Jam" ||
                    d.pickupDelayMinutes > 20
            )
            .slice(0, 5);

    return (

        <div className="rounded-[36px] bg-white p-8 shadow-xl dark:bg-slate-900">

            {/* HEADER */}

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">

                        Live Alert Center

                    </h2>

                    <p className="mt-2 text-slate-500 dark:text-slate-400">

                        AI-detected operational incidents.

                    </p>

                </div>

                <div className="relative">

                    <div className="rounded-2xl bg-red-100 p-4 text-red-500">

                        <Bell size={28} />

                    </div>

                    {alerts.length > 0 && (

                        <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">

                            {alerts.length}

                        </div>

                    )}

                </div>

            </div>

            {/* ALERTS */}

            <div className="mt-8 space-y-4">

                <AnimatePresence>

                    {alerts.length > 0 ? (

                        alerts.map(
                            (
                                delivery,
                                index
                            ) => (

                                <motion.div
                                    key={index}
                                    initial={{
                                        opacity: 0,
                                        y: 20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                    }}
                                    transition={{
                                        duration: 0.3,
                                    }}
                                    className="flex items-start gap-4 rounded-3xl border border-red-100 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30"
                                >

                                    {/* ICON */}

                                    <div className="rounded-2xl bg-red-100 p-3 text-red-500 dark:bg-red-900">

                                        {delivery.predictedRisk ===
                                        "HIGH" ? (
                                            <ShieldAlert
                                                size={20}
                                            />
                                        ) : (
                                            <AlertTriangle
                                                size={20}
                                            />
                                        )}

                                    </div>

                                    {/* CONTENT */}

                                    <div className="flex-1">

                                        <div className="flex items-center justify-between gap-4">

                                            <h3 className="font-bold text-slate-900 dark:text-white">

                                                {
                                                    delivery.category
                                                }

                                            </h3>

                                            <span className="rounded-xl bg-red-500 px-3 py-1 text-xs font-bold text-white">

                        ALERT

                      </span>

                                        </div>

                                        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">

                                            Delivery risk increased due to{" "}
                                            <span className="font-semibold">

                        {
                            delivery.traffic
                        }

                      </span>{" "}
                                            traffic and{" "}
                                            <span className="font-semibold">

                        {
                            delivery.weather
                        }

                      </span>{" "}
                                            conditions.

                                        </p>

                                        <div className="mt-4 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">

                                            <Truck
                                                size={14}
                                            />

                                            {
                                                delivery.vehicle
                                            }

                                            •

                                            {
                                                delivery.distanceKm
                                            }
                                            KM

                                        </div>

                                    </div>

                                </motion.div>

                            )
                        )

                    ) : (

                        <div className="rounded-3xl bg-slate-50 p-8 text-center dark:bg-slate-800">

                            <p className="font-medium text-slate-500 dark:text-slate-400">

                                No active alerts detected.

                            </p>

                        </div>

                    )}

                </AnimatePresence>

            </div>

        </div>
    );
}