import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

const COLORS = [
    "#22c55e",
    "#f97316",
    "#ef4444",
];

export default function RiskPieChart({
                                         deliveries,
                                     }) {

    const data = [
        {
            name: "LOW",
            value: deliveries.filter(
                (d) =>
                    d.predictedRisk === "LOW"
            ).length,
        },
        {
            name: "MEDIUM",
            value: deliveries.filter(
                (d) =>
                    d.predictedRisk === "MEDIUM"
            ).length,
        },
        {
            name: "HIGH",
            value: deliveries.filter(
                (d) =>
                    d.predictedRisk === "HIGH"
            ).length,
        },
    ];

    return (

        <div className="rounded-[36px] bg-white p-8 shadow-xl">

            <h2 className="text-3xl font-black text-slate-900">

                Risk Distribution

            </h2>

            <div className="mt-8 h-[320px]">

                <ResponsiveContainer width="100%" height="100%" minWidth={0}>

                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="value"
                            outerRadius={120}
                            innerRadius={70}
                        >

                            {data.map((entry, index) => (

                                <Cell
                                    key={index}
                                    fill={COLORS[index]}
                                />

                            ))}

                        </Pie>

                        <Tooltip />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}