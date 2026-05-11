import {
    Route,
    Clock3,
} from "lucide-react";

import { getWeatherIcon }
    from "../../utils/weatherIcons";

import InfoItem
    from "../ui/InfoItem";

export default function DeliveryCard({
                                         delivery,
                                     }) {

    return (

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-800">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">

                        {delivery.category}

                    </h2>

                    <p className="mt-2 text-slate-500 dark:text-slate-400">

                        {delivery.area}

                    </p>

                </div>

                <div
                    className={`rounded-2xl px-5 py-2 font-bold text-white ${
                        delivery.predictedRisk ===
                        "HIGH"
                            ? "bg-red-500"
                            : delivery.predictedRisk ===
                            "MEDIUM"
                                ? "bg-orange-500"
                                : "bg-green-500"
                    }`}
                >

                    {delivery.predictedRisk}

                </div>

            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-3">

                <InfoItem
                    icon={<Route size={16} />}
                    text={`${delivery.distanceKm} KM`}
                />

                <InfoItem
                    icon={<Clock3 size={16} />}
                    text={`${delivery.pickupDelayMinutes} Min Delay`}
                />

                <InfoItem
                    icon={getWeatherIcon(
                        delivery.weather
                    )}
                    text={delivery.weather}
                />

            </div>

        </div>
    );
}