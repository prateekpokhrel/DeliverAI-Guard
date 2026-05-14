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

    // =====================================================
    // SAFETY CHECK
    // =====================================================

    const safeDeliveries = Array.isArray(deliveries)
        ? deliveries
        : [];

    // =====================================================
    // NORMALIZE CHART DATA
    // =====================================================

    const chartData = safeDeliveries.map(
        (d, index) => ({

            name: `D${index + 1}`,

            distance:
                Number(
                    d.distanceKm ||
                    d.Distance_km ||
                    0
                ),

        })
    );

    // =====================================================
    // EMPTY STATE
    // =====================================================

    if (chartData.length === 0) {

        return (

            <div className="min-w-0 rounded-[36px] bg-white p-8 shadow-xl">

                <h2 className="text-3xl font-black text-slate-900">
                    Delivery Distance Trend
                </h2>

                <div className="mt-8 flex h-[320px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50">

                    <p className="text-slate-500">
                        No delivery trend data available
                    </p>

                </div>

            </div>
        );
    }

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="min-w-0 rounded-[36px] bg-white p-8 shadow-xl">

            <h2 className="text-3xl font-black text-slate-900">

                Delivery Distance Trend

            </h2>

            <div className="mt-8 h-[320px] w-full min-w-0">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={0}
                >

                    <LineChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 20,
                            left: 0,
                            bottom: 0,
                        }}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="name"
                            tick={{
                                fontSize: 12,
                            }}
                        />

                        <YAxis
                            tick={{
                                fontSize: 12,
                            }}
                        />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="distance"
                            stroke="#f97316"
                            strokeWidth={4}
                            dot={{
                                r: 4,
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}