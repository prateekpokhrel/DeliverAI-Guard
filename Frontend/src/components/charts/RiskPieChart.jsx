import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

const COLORS = [
    // MEDIUM, LOW, HIGH (match legend order and site accent)
    "#f97316",
    "#22c55e",
    "#ef4444",
];

export default function RiskPieChart({
                                         deliveries,
                                     }) {

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

            <div className="min-w-0 rounded-[36px] bg-white p-8 shadow-xl">

                <h2 className="text-3xl font-black text-slate-900">
                    Risk Distribution
                </h2>

                <div className="mt-8 flex h-[320px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50">
                    <p className="text-slate-500">No risk distribution data available</p>
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

                Risk Distribution

            </h2>

            <div className="mt-8 h-[320px] w-full min-w-0">

                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} innerRadius={68} paddingAngle={4} label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Pie>

                        <Tooltip formatter={(value) => `${value} deliveries`} />

                        <Legend verticalAlign="bottom" height={36} formatter={(value) => value.charAt(0) + value.slice(1).toLowerCase()} />
                    </PieChart>
                </ResponsiveContainer>

            </div>

        </div>
    );
}