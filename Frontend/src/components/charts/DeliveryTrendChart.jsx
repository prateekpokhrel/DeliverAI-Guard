import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

export default function DeliveryTrendChart({
                                               deliveries,
                                           }) {

    const chartData = deliveries.map(
        (d, index) => ({
            name: `D${index + 1}`,
            distance: d.distanceKm,
        })
    );

    return (

        <div className="min-w-0 rounded-[36px] bg-white p-8 shadow-xl">

            <h2 className="text-3xl font-black text-slate-900">

                Delivery Distance Trend

            </h2>

            <div className="mt-8 h-[320px]">

                <ResponsiveContainer width="100%" height="100%" minWidth={0}>

                    <LineChart data={chartData}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="name" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="distance"
                            stroke="#f97316"
                            strokeWidth={4}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}