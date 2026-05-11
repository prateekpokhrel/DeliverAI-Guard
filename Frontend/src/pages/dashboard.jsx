import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// IMPORT WEBSOCKET SERVICES
import {
    connectWebSocket,
    disconnectWebSocket,
} from "../services/websocketService";

import DashboardSkeleton from "../components/loaders/DashboardSkeleton";
import AlertCenter from "../components/alerts/AlertCenter";

import KPIStatCard from "../components/cards/KPIStatCard";
import RiskPieChart from "../components/charts/RiskPieChart";
import DeliveryTrendChart from "../components/charts/DeliveryTrendChart";

import {
    AlertTriangle,
    BrainCircuit,
    ShieldCheck,
    Truck,
    Loader2,
    Sparkles,
    Zap,
    Radar,
    Activity,
    Route,
    Clock3,
    CloudRain,
    CloudFog,
    Wind,
    Cloud,
    Sun,
    Search,
} from "lucide-react";

const getWeatherIcon = (weather) => {
    switch (weather) {
        case "Sunny":
            return <Sun size={20} className="text-yellow-500" />;
        case "Rainy":
            return <CloudRain size={20} className="text-blue-500" />;
        case "Fog":
            return <CloudFog size={20} className="text-slate-500" />;
        case "Sandstorms":
            return <Wind size={20} className="text-orange-400" />;
        case "Windy":
            return <Wind size={20} className="text-cyan-500" />;
        case "Cloudy":
        default:
            return <Cloud size={20} className="text-slate-400" />;
    }
};

export default function Dashboard() {
    // =====================================================
    // STATES
    // =====================================================
    const [pageLoading, setPageLoading] = useState(true);
    const [prediction, setPrediction] = useState("MEDIUM");
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [mainCauses, setMainCauses] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [liveSearch, setLiveSearch] = useState("");

    // NEW STATE FOR EXPLAINABILITY
    const [explainability, setExplainability] = useState(null);

    const [formData, setFormData] = useState({
        Agent_Age: 35,
        Agent_Rating: 4.7,
        Weather: "Sunny",
        Traffic: "High",
        Vehicle: "motorcycle",
        Area: "Urban",
        Category: "Clothing",
        Distance_km: 8.5,
        Pickup_Delay_Minutes: 18,
        Rush_Hour: 1,
        Order_Hour: 18,
    });

    // =====================================================
    // HANDLERS
    // =====================================================
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const fetchDeliveries = async () => {
        try {
            const response = await axios.get("http://localhost:8084/api/monitoring/all");
            setDeliveries(response.data);

            setTimeout(() => {
                setPageLoading(false);
            }, 800);
        } catch (error) {
            console.log("Failed to fetch deliveries:", error);
            setPageLoading(false);
        }
    };

    // =====================================================
    // WEBSOCKET INTEGRATION
    // =====================================================
    useEffect(() => {
        fetchDeliveries();

        connectWebSocket((newDelivery) => {
            setDeliveries((prev) => [
                newDelivery,
                ...prev,
            ]);
            toast.success("New live prediction received");
        });

        return () => {
            disconnectWebSocket();
        };
    }, []);

    const predictRisk = async () => {
        try {
            setLoading(true);
            toast.loading("AI analyzing delivery...", { id: "prediction" });

            const response = await axios.post("http://localhost:8084/api/delivery/predict", formData);

            const risk =
                response.data.predictedDeliveryRisk ||
                response.data.Predicted_Delivery_Risk ||
                "UNKNOWN";

            setPrediction(risk);
            setRecommendations(response.data.recommendations || response.data.Recommendations || []);
            setMainCauses(response.data.mainCauses || response.data.Main_Causes || []);

            // SET EXPLAINABILITY STATE
            setExplainability(response.data.Explainability || null);

            toast.success("Prediction completed", { id: "prediction" });
        } catch (error) {
            console.log(error);
            toast.error("Prediction failed", { id: "prediction" });
        } finally {
            setLoading(false);
        }
    };

    // Filter for Live AI Monitoring
    const filteredLiveDeliveries = deliveries.filter((delivery) =>
        delivery.category?.toLowerCase().includes(liveSearch.toLowerCase())
    );

    // =====================================================
    // UI
    // =====================================================
    if (pageLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8">
            {/* HERO SECTION */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#020617] via-[#081225] to-[#111827] p-10 text-white shadow-2xl"
            >
                <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-orange-400">
                        <Sparkles size={22} />
                        <p className="text-sm font-semibold uppercase tracking-[0.3em]">
                            AI Operations Center
                        </p>
                    </div>
                    <h1 className="mt-8 max-w-4xl text-6xl font-black leading-tight">
                        Prevent Delivery Failures Before They Happen
                    </h1>
                    <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
                        Unified ecommerce delivery intelligence system powered by AI risk analysis,
                        logistics monitoring, traffic analysis, and smart prevention recommendations.
                    </p>
                    <button
                        onClick={predictRisk}
                        disabled={loading}
                        className="mt-10 flex items-center gap-3 rounded-2xl bg-orange-500 px-8 py-4 font-semibold shadow-2xl transition hover:scale-[1.02] hover:bg-orange-600 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Processing AI...
                            </>
                        ) : (
                            <>
                                <Zap size={20} />
                                Launch AI Prediction
                            </>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <KPIStatCard
                    title="Total Deliveries"
                    value={deliveries.length}
                    icon={<Truck size={28} />}
                    color="text-blue-500"
                />
                <KPIStatCard
                    title="High Risk"
                    value={deliveries.filter((d) => d.predictedRisk === "HIGH").length}
                    icon={<AlertTriangle size={28} />}
                    color="text-red-500"
                />
                <KPIStatCard
                    title="AI Accuracy"
                    value={96}
                    icon={<ShieldCheck size={28} />}
                    color="text-green-500"
                />
                <KPIStatCard
                    title="AI Status"
                    value="LIVE"
                    icon={<BrainCircuit size={28} />}
                    color="text-orange-500"
                />
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <RiskPieChart deliveries={deliveries} />
                <DeliveryTrendChart deliveries={[...deliveries].reverse()} />
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-3">

                {/* LEFT COLUMN */}
                <div className="space-y-6 2xl:col-span-2">

                    {/* AI INPUTS */}
                    <div className="rounded-[36px] bg-white p-8 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900">AI Prediction Inputs</h2>
                                <p className="mt-2 text-slate-500">Configure operational delivery parameters.</p>
                            </div>
                            <div className="rounded-2xl bg-orange-100 p-4 text-orange-500">
                                <Radar size={30} />
                            </div>
                        </div>

                        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                            <InputField label="Agent Age" name="Agent_Age" value={formData.Agent_Age} onChange={handleChange} />
                            <InputField label="Agent Rating" name="Agent_Rating" value={formData.Agent_Rating} onChange={handleChange} />
                            <SelectField
                                label="Weather"
                                name="Weather"
                                value={formData.Weather}
                                onChange={handleChange}
                                options={["Sunny", "Rainy", "Fog", "Sandstorms", "Windy", "Cloudy"]}
                            />
                            <SelectField
                                label="Traffic"
                                name="Traffic"
                                value={formData.Traffic}
                                onChange={handleChange}
                                options={["Low", "Medium", "High", "Jam"]}
                            />
                            <SelectField
                                label="Vehicle"
                                name="Vehicle"
                                value={formData.Vehicle}
                                onChange={handleChange}
                                options={["motorcycle", "scooter", "van"]}
                            />
                            <SelectField
                                label="Area"
                                name="Area"
                                value={formData.Area}
                                onChange={handleChange}
                                options={["Urban", "Semi-Urban"]}
                            />
                            <SelectField
                                label="Category"
                                name="Category"
                                value={formData.Category}
                                onChange={handleChange}
                                options={["Clothing", "Electronics", "Grocery"]}
                            />
                            <InputField label="Distance KM" name="Distance_km" value={formData.Distance_km} onChange={handleChange} />
                            <InputField label="Pickup Delay" name="Pickup_Delay_Minutes" value={formData.Pickup_Delay_Minutes} onChange={handleChange} />
                            <InputField label="Order Hour" name="Order_Hour" value={formData.Order_Hour} onChange={handleChange} />
                        </div>
                    </div>

                    {/* LIVE DELIVERY MONITORING WITH SEARCH */}
                    <div className="rounded-[36px] bg-white p-8 shadow-xl">
                        <div className="flex flex-col gap-6 md:flex-row md:items-start justify-between">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900">Live AI Monitoring</h2>
                                <p className="mt-2 text-slate-500">Real-time ecommerce delivery intelligence.</p>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={liveSearch}
                                        onChange={(e) => setLiveSearch(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>
                                <div className="hidden md:flex rounded-2xl bg-blue-100 p-4 text-blue-500">
                                    <Activity size={30} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-5">
                            {filteredLiveDeliveries.length > 0 ? (
                                filteredLiveDeliveries.slice(0, 5).map((delivery, index) => (
                                    <DeliveryCard key={index} delivery={delivery} />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                    <Search size={40} className="mb-4 opacity-50" />
                                    <p>No active deliveries found matching "{liveSearch}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">

                    {/* PREDICTION RESULT */}
                    <div className="rounded-[36px] bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 p-8 text-white shadow-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-100">
                            Live AI Prediction
                        </p>
                        <h1 className="mt-8 text-7xl font-black">{prediction}</h1>
                    </div>

                    {/* AI EXPLAINABILITY SECTION */}
                    {explainability && (
                        <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                                AI Explainability
                            </h2>
                            <p className="mt-2 text-slate-500 dark:text-slate-400">
                                Top factors influencing prediction
                            </p>
                            <div className="mt-6 space-y-4">
                                {Object.entries(explainability).map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                                                {key.replace(/_/g, " ")}
                                            </span>
                                            <span className="font-bold text-orange-500">
                                                {(value * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${value * 100}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full rounded-full bg-orange-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ROOT CAUSE ANALYSIS */}
                    <AlertCenter deliveries={deliveries} />
                    <div className="rounded-[36px] bg-white p-8 shadow-xl">
                        <h2 className="text-3xl font-black text-slate-900">Root Cause Analysis</h2>
                        <div className="mt-6 space-y-4">
                            {mainCauses.length > 0 ? (
                                mainCauses.map((cause, index) => (
                                    <AlertItem key={index} icon={<AlertTriangle size={18} />} text={cause} />
                                ))
                            ) : (
                                <p className="text-slate-500">No causes detected.</p>
                            )}
                        </div>
                    </div>

                    {/* RECOMMENDATIONS */}
                    <div className="rounded-[36px] bg-white p-8 shadow-xl">
                        <h2 className="text-3xl font-black text-slate-900">Smart Recommendations</h2>
                        <div className="mt-6 space-y-4">
                            {recommendations.length > 0 ? (
                                recommendations.map((recommendation, index) => (
                                    <AlertItem key={index} icon={<ShieldCheck size={18} />} text={recommendation} />
                                ))
                            ) : (
                                <p className="text-slate-500">No recommendations available.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

/* ===================================================== */
/* REUSABLE COMPONENTS */
/* ===================================================== */

function DeliveryCard({ delivery }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-blue-200 hover:bg-blue-50/50">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{delivery.category}</h2>
                    <p className="mt-2 text-slate-500">{delivery.area}</p>
                </div>
                <div
                    className={`rounded-2xl px-5 py-2 font-bold text-white ${
                        delivery.predictedRisk === "HIGH"
                            ? "bg-red-500"
                            : delivery.predictedRisk === "MEDIUM"
                                ? "bg-orange-500"
                                : "bg-green-500"
                    }`}
                >
                    {delivery.predictedRisk}
                </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 text-sm text-slate-600 md:grid-cols-3">
                <InfoItem icon={<Route size={16} />} text={`${delivery.distanceKm} KM`} />
                <InfoItem icon={<Clock3 size={16} />} text={`${delivery.pickupDelayMinutes} Min Delay`} />
                <InfoItem icon={getWeatherIcon(delivery.weather)} text={delivery.weather} />
            </div>
        </div>
    );
}

function AlertItem({ icon, text }) {
    return (
        <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-5">
            <div className="rounded-xl bg-orange-100 p-3 text-orange-500 flex-shrink-0">{icon}</div>
            <p className="font-medium leading-relaxed text-slate-700">{text}</p>
        </div>
    );
}

function InputField({ label, name, value, onChange }) {
    return (
        <div>
            <label className="text-sm font-semibold text-slate-600">{label}</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
        </div>
    );
}

function SelectField({ label, name, value, onChange, options }) {
    return (
        <div>
            <label className="text-sm font-semibold text-slate-600">{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

function InfoItem({ icon, text }) {
    return (
        <div className="flex items-center gap-2">
            <div className="text-orange-500">{icon}</div>
            <p className="font-medium">{text}</p>
        </div>
    );
}