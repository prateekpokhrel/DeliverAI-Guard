import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

// Updated color palette to remove orange and match the new cool/accessible theme
const COLORS = [
    "#8b5cf6", // MEDIUM (Purple - Replaced Orange)
    "#10b981", // LOW (Emerald)
    "#f43f5e", // HIGH (Rose)
];

// Custom accessible tooltip for better UX and readability
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-slate-100 bg-white/95 p-4 shadow-xl shadow-slate-200/50 backdrop-blur-sm focus:outline-none">
                <p className="font-black tracking-wide text-slate-800">
                    {`${payload[0].name} RISK`}
                </p>
                <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: payload[0].payload.fill }} 
                        aria-hidden="true"
                    />
                    <span>
                        <strong className="text-slate-900">{payload[0].value}</strong> deliveries
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

export default function RiskPieChart({ deliveries }) {
    // =====================================================
    // SAFETY CHECK
    // =====================================================

    const safeDeliveries = Array.isArray(deliveries)
        ? deliveries
        : [];

    // =====================================================
    // NORMALIZE RISK VALUES
    // =====================================================

    const normalizedDeliveries =
        safeDeliveries.map((d) => ({
            predictedRisk:
                d.predictedRisk ||
                d.Predicted_Delivery_Risk ||
                "LOW",
        }));

    // =====================================================
    // CHART DATA
    // =====================================================

    const data = [
        { name: "MEDIUM", value: normalizedDeliveries.filter((d) => d.predictedRisk === "MEDIUM").length },
        { name: "LOW", value: normalizedDeliveries.filter((d) => d.predictedRisk === "LOW").length },
        { name: "HIGH", value: normalizedDeliveries.filter((d) => d.predictedRisk === "HIGH").length },
    ];

    // =====================================================
    // TOTAL DELIVERIES
    // =====================================================

    const totalDeliveries =
        data.reduce(
            (acc, item) => acc + item.value,
            0
        );

    // =====================================================
    // EMPTY STATE
    // =====================================================

    if (totalDeliveries === 0) {
        return (
            <div className="min-w-0 rounded-[2.5rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                    Risk Distribution
                </h2>
                <div className="mt-8 flex h-[320px] items-center justify-center rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/50">
                    <p className="text-sm font-medium text-slate-500">No risk distribution data available</p>
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
            aria-label="Delivery Risk Distribution Chart"
        >
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Risk Distribution
            </h2>

            <div className="mt-8 h-[320px] w-full min-w-0 relative">
                {/* Screen reader only text for visually impaired users to get the stats 
                  without needing to interact with the SVG canvas
                */}
                <div className="sr-only">
                    {data.map((item) => (
                        <p key={item.name}>
                            {item.name} Risk: {item.value} deliveries, which is {Math.round((item.value / totalDeliveries) * 100)} percent.
                        </p>
                    ))}
                </div>

                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <PieChart>
                        <Pie 
                            data={data} 
                            dataKey="value" 
                            nameKey="name" 
                            cx="50%" 
                            cy="50%" 
                            outerRadius={110} 
                            innerRadius={70} // Slightly increased for a cleaner donut look
                            paddingAngle={5} // Slightly increased for better visual separation
                            label={({ name, percent }) => percent > 0 ? `${name} ${Math.round(percent * 100)}%` : ''}
                            labelLine={false}
                            className="font-bold text-xs outline-none focus:outline-none"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index]} 
                                    className="transition-all duration-300 hover:opacity-80 cursor-pointer outline-none focus:outline-none"
                                />
                            ))}
                        </Pie>

                        <Tooltip content={<CustomTooltip />} />

                        <Legend 
                            verticalAlign="bottom" 
                            height={36} 
                            iconType="circle"
                            formatter={(value) => <span className="font-semibold text-slate-700 ml-1">{value.charAt(0) + value.slice(1).toLowerCase()}</span>} 
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}