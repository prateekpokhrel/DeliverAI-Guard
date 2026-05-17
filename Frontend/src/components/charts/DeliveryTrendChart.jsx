import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

// Custom accessible tooltip for better UX and readability
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-slate-100 bg-white/95 p-4 shadow-xl shadow-slate-200/50 backdrop-blur-sm focus:outline-none">
                <p className="font-bold text-slate-500 text-sm mb-1 uppercase tracking-wider">
                    {label}
                </p>
                <div className="flex items-center gap-2 font-medium text-indigo-600">
                    <div 
                        className="h-2.5 w-2.5 rounded-full bg-indigo-600" 
                        aria-hidden="true" 
                    />
                    <span>
                        <strong className="text-slate-900 text-lg font-black">{payload[0].value}</strong> km
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

export default function DeliveryTrendChart({ deliveries }) {
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
            <div className="min-w-0 rounded-[2.5rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                    Delivery Distance Trend
                </h2>
                <div className="mt-8 flex h-[320px] items-center justify-center rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/50">
                    <p className="text-sm font-medium text-slate-500">
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
        <div 
            className="min-w-0 rounded-[2.5rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40 transition-all hover:shadow-2xl hover:shadow-slate-200/50"
            role="region" 
            aria-label="Delivery Distance Trend Chart"
        >
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Delivery Distance Trend
            </h2>

            <div className="mt-8 h-[320px] w-full min-w-0 relative">
                
                {/* Screen reader only text for visually impaired users */}
                <div className="sr-only">
                    {chartData.map((item) => (
                        <p key={item.name}>
                            Delivery {item.name}: {item.distance} kilometers.
                        </p>
                    ))}
                </div>

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
                            left: -10, // Adjusted to pull the Y-axis closer
                            bottom: 0,
                        }}
                    >
                        {/* Softened grid lines, removed vertical lines for a cleaner modern look */}
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false} 
                            stroke="#f1f5f9"
                        />

                        <XAxis
                            dataKey="name"
                            tick={{
                                fontSize: 12,
                                fill: '#64748b', // text-slate-500
                                fontWeight: 600
                            }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />

                        <YAxis
                            tick={{
                                fontSize: 12,
                                fill: '#64748b', // text-slate-500
                                fontWeight: 600
                            }}
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                        />

                        <Tooltip 
                            content={<CustomTooltip />} 
                            cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '5 5' }}
                        />

                        <Line
                            type="monotone"
                            dataKey="distance"
                            stroke="#4f46e5" // Indigo-600 (Replaced Orange)
                            strokeWidth={4}
                            dot={{
                                r: 4,
                                fill: "#ffffff",
                                stroke: "#4f46e5",
                                strokeWidth: 2
                            }}
                            activeDot={{
                                r: 7,
                                fill: "#4f46e5",
                                stroke: "#ffffff",
                                strokeWidth: 3,
                                className: "outline-none focus:outline-none"
                            }}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}