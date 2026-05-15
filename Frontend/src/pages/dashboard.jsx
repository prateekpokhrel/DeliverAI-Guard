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

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
        case "Stormy":
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
        const { name, value } = e.target;
        const numericKeys = [
            "Agent_Age",
            "Agent_Rating",
            "Distance_km",
            "Pickup_Delay_Minutes",
            "Rush_Hour",
            "Order_Hour",
        ];

        setFormData({
            ...formData,
            [name]: numericKeys.includes(name)
                ? Number(value)
                : value,
        });
    };

    // =====================================================
    // FETCH DELIVERIES
    // =====================================================

    const fetchDeliveries = async () => {
        try {

            const response = await axios.get(
                `${API_BASE_URL}/api/monitoring/all`
            );

            console.log("Deliveries API Response:", response.data);

            let deliveriesData = [];

            // Handle different backend response formats
            if (Array.isArray(response.data)) {
                deliveriesData = response.data;
            } else if (Array.isArray(response.data?.deliveries)) {
                deliveriesData = response.data.deliveries;
            } else if (Array.isArray(response.data?.data)) {
                deliveriesData = response.data.data;
            }

            // Normalize backend fields
            const normalizedDeliveries = deliveriesData.map((d) => ({
                category:
                    d.category ||
                    d.Category ||
                    "Unknown",

                area:
                    d.area ||
                    d.Area ||
                    "Unknown",

                weather:
                    d.weather ||
                    d.Weather ||
                    "Cloudy",

                predictedRisk:
                    d.predictedRisk ||
                    d.Predicted_Delivery_Risk ||
                    "LOW",

                distanceKm:
                    d.distanceKm ||
                    d.Distance_km ||
                    0,

                pickupDelayMinutes:
                    d.pickupDelayMinutes ||
                    d.Pickup_Delay_Minutes ||
                    0,
            }));

            setDeliveries(normalizedDeliveries);

            setTimeout(() => {
                setPageLoading(false);
            }, 800);

        } catch (error) {

            console.log(
                "Failed to fetch deliveries:",
                error
            );

            setDeliveries([]);

            setPageLoading(false);
        }
    };

    // =====================================================
    // WEBSOCKET
    // =====================================================

    useEffect(() => {

        fetchDeliveries();

        connectWebSocket((newDelivery) => {

            const normalizedDelivery = {
                category:
                    newDelivery.category ||
                    newDelivery.Category ||
                    "Unknown",

                area:
                    newDelivery.area ||
                    newDelivery.Area ||
                    "Unknown",

                weather:
                    newDelivery.weather ||
                    newDelivery.Weather ||
                    "Cloudy",

                predictedRisk:
                    newDelivery.predictedRisk ||
                    newDelivery.Predicted_Delivery_Risk ||
                    "LOW",

                distanceKm:
                    newDelivery.distanceKm ||
                    newDelivery.Distance_km ||
                    0,

                pickupDelayMinutes:
                    newDelivery.pickupDelayMinutes ||
                    newDelivery.Pickup_Delay_Minutes ||
                    0,
            };

            setDeliveries((prev) => {

                const safePrev = Array.isArray(prev)
                    ? prev
                    : [];

                return [
                    normalizedDelivery,
                    ...safePrev,
                ];
            });

            toast.success(
                "New live prediction received"
            );
        });

        return () => {
            disconnectWebSocket();
        };

    }, []);

    // =====================================================
    // PREDICT RISK
    // =====================================================

    const predictRisk = async () => {

        try {

            setLoading(true);

            toast.loading(
                "AI analyzing delivery...",
                { id: "prediction" }
            );

            const response = await axios.post(
                `${API_BASE_URL}/api/delivery/predict`,
                formData
            );

            console.log(
                "Prediction Response:",
                response.data
            );

            const risk =
                response.data.predictedDeliveryRisk ||
                response.data.Predicted_Delivery_Risk ||
                "UNKNOWN";

            setPrediction(risk);

            setRecommendations(
                response.data.recommendations ||
                response.data.Recommendations ||
                []
            );

            setMainCauses(
                response.data.mainCauses ||
                response.data.Main_Causes ||
                []
            );

            setExplainability(
                response.data.Explainability ||
                null
            );

            // Refresh dashboard
            await fetchDeliveries();

            toast.success(
                "Prediction completed",
                { id: "prediction" }
            );

        } catch (error) {

            console.log(error);

            toast.error(
                "Prediction failed",
                { id: "prediction" }
            );

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // FILTER SEARCH
    // =====================================================

    const filteredLiveDeliveries =
        Array.isArray(deliveries)
            ? deliveries.filter((delivery) =>
                delivery.category
                    ?.toLowerCase()
                    .includes(
                        liveSearch.toLowerCase()
                    )
            )
            : [];

    // =====================================================
    // LOADING
    // =====================================================

    if (pageLoading) {
        return <DashboardSkeleton />;
    }

    // =====================================================
    // UI
    // =====================================================

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

                    <section className="mt-6 rounded-[20px] bg-gradient-to-br from-[#071024] to-[#0b1624] p-5 text-white shadow-lg border border-slate-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Zap size={18} className="text-orange-400" />
                                <h3 className="text-lg font-semibold">AI Parameters</h3>
                                <span className="text-sm text-slate-400">Edit inputs before running prediction</span>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className="block text-xs text-slate-300">Agent Age</label>
                                <input name="Agent_Age" type="number" value={formData.Agent_Age} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-white text-black" />
                            </div>

                            <div>
                                <label className="block text-xs text-slate-300">Agent Rating</label>
                                <select name="Agent_Rating" value={formData.Agent_Rating} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-white text-black">
                                    {[...Array(26)].map((_, index) => {
                                        const value = (2.5 + index * 0.1).toFixed(1);
                                        return (
                                            <option key={value} value={value}>
                                                {value}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-slate-300">Weather</label>
                                <select name="Weather" value={formData.Weather} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-white text-black">
                                    <option>Cloudy</option>
                                    <option>Fog</option>
                                    <option>Sandstorms</option>
                                    <option>Stormy</option>
                                    <option>Sunny</option>
                                    <option>Windy</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-slate-300">Traffic</label>
                                <select name="Traffic" value={formData.Traffic} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-white text-black">
                                    <option>High</option>
                                    <option>Jam</option>
                                    <option>Low</option>
                                    <option>Medium</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-slate-300">Vehicle</label>
                                <select name="Vehicle" value={formData.Vehicle} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-white text-black">
                                    <option value="motorcycle">motorcycle</option>
                                    <option value="scooter">scooter</option>
                                    <option value="van">van</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-slate-300">Category</label>
                                <select name="Category" value={formData.Category} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-white text-black">
                                    <option value="Apparel">Apparel</option>
                                    <option value="Books">Books</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Cosmetics">Cosmetics</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Grocery">Grocery</option>
                                    <option value="Home">Home</option>
                                    <option value="Jewelry">Jewelry</option>
                                    <option value="Kitchen">Kitchen</option>
                                    <option value="Outdoors">Outdoors</option>
                                    <option value="Pet Supplies">Pet Supplies</option>
                                    <option value="Shoes">Shoes</option>
                                    <option value="Skincare">Skincare</option>
                                    <option value="Snacks">Snacks</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Toys">Toys</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-slate-300">Area</label>
                                <select name="Area" value={formData.Area} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-white text-black">
                                    <option value="Metropolitian">Metropolitian</option>
                                    <option value="Other">Other</option>
                                    <option value="Semi-Urban">Semi-Urban</option>
                                    <option value="Urban">Urban</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-slate-300">Distance (km)</label>
                                <input name="Distance_km" type="number" step="0.1" value={formData.Distance_km} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-white text-black" />
                            </div>

                            <div>
                                <label className="block text-xs text-slate-300">Pickup Delay (mins)</label>
                                <input name="Pickup_Delay_Minutes" type="number" value={formData.Pickup_Delay_Minutes} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-white text-black" />
                            </div>

                            <div>
                                <label className="block text-xs text-slate-300">Rush Hour</label>
                                <select name="Rush_Hour" value={formData.Rush_Hour} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-white text-black">
                                    <option value={0}>No</option>
                                    <option value={1}>Yes</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-slate-300">Order Hour</label>
                                <input name="Order_Hour" type="number" value={formData.Order_Hour} onChange={handleChange} className="mt-1 w-full rounded-md p-2 bg-white text-black" />
                            </div>
                        </div>
                    </section>

                    <button
                        onClick={predictRisk}
                        disabled={loading}
                        className="mt-10 flex items-center gap-3 rounded-2xl bg-orange-500 px-8 py-4 font-semibold shadow-2xl transition hover:scale-[1.02] hover:bg-orange-600 disabled:opacity-70 disabled:hover:scale-100"
                    >

                        {loading ? (
                            <>
                                <Loader2
                                    className="animate-spin"
                                    size={20}
                                />
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
                    value={
                        Array.isArray(deliveries)
                            ? deliveries.length
                            : 0
                    }
                    icon={<Truck size={28} />}
                    color="text-blue-500"
                />

                <KPIStatCard
                    title="High Risk"
                    value={
                        Array.isArray(deliveries)
                            ? deliveries.filter(
                                (d) =>
                                    d.predictedRisk === "HIGH"
                            ).length
                            : 0
                    }
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

                <RiskPieChart
                    deliveries={
                        Array.isArray(deliveries)
                            ? deliveries
                            : []
                    }
                />

                <DeliveryTrendChart
                    deliveries={
                        Array.isArray(deliveries)
                            ? [...deliveries].reverse()
                            : []
                    }
                />

            </div>

            {/* MAIN CONTENT GRID */}

            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-3">

                {/* LEFT COLUMN */}

                <div className="space-y-6 2xl:col-span-2">

                    {/* LIVE DELIVERY MONITORING */}

                    <div className="rounded-[36px] bg-white p-8 shadow-xl">

                        <div className="flex flex-col gap-6 md:flex-row md:items-start justify-between">

                            <div>

                                <h2 className="text-4xl font-black text-slate-900">
                                    Live AI Monitoring
                                </h2>

                                <p className="mt-2 text-slate-500">
                                    Real-time ecommerce delivery intelligence.
                                </p>

                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">

                                <div className="relative w-full md:w-64">

                                    <Search
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={18}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={liveSearch}
                                        onChange={(e) =>
                                            setLiveSearch(
                                                e.target.value
                                            )
                                        }
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

                                filteredLiveDeliveries
                                    .slice(0, 5)
                                    .map((delivery, index) => (

                                        <DeliveryCard
                                            key={index}
                                            delivery={delivery}
                                        />

                                    ))

                            ) : (

                                <div className="flex flex-col items-center justify-center py-10 text-slate-400">

                                    <Search
                                        size={40}
                                        className="mb-4 opacity-50"
                                    />

                                    <p>
                                        No active deliveries found matching "{liveSearch}"
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

                {/* RIGHT COLUMN */}

                <div className="space-y-6">

                    {/* PREDICTION */}

                    <div className="rounded-[36px] bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 p-8 text-white shadow-2xl">

                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-100">
                            Live AI Prediction
                        </p>

                        <h1 className="mt-8 text-7xl font-black">
                            {prediction}
                        </h1>

                    </div>

                    {/* EXPLAINABILITY */}

                    {explainability && (

                        <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-xl">

                            <h2 className="text-3xl font-black text-slate-900">
                                AI Explainability
                            </h2>

                            <div className="mt-6 space-y-4">

                                {Object.entries(explainability).map(
                                    ([key, value]) => (

                                        <div
                                            key={key}
                                            className="rounded-2xl bg-slate-50 p-4"
                                        >

                                            <div className="flex items-center justify-between">

                                                <span className="font-semibold text-slate-700">
                                                    {key.replace(/_/g, " ")}
                                                </span>

                                                <span className="font-bold text-orange-500">
                                                    {(value * 100).toFixed(1)}%
                                                </span>

                                            </div>

                                            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">

                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${value * 100}%`
                                                    }}
                                                    transition={{
                                                        duration: 1,
                                                        ease: "easeOut"
                                                    }}
                                                    className="h-full rounded-full bg-orange-500"
                                                />

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                    {recommendations?.length > 0 && (
                        <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-xl">
                            <h2 className="text-3xl font-black text-slate-900">
                                Smart Recommendations
                            </h2>
                            <ul className="mt-6 space-y-3 text-slate-700">
                                {recommendations.map((item, index) => (
                                    <li key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {mainCauses?.length > 0 && (
                        <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-xl">
                            <h2 className="text-3xl font-black text-slate-900">
                                Root Cause Analysis
                            </h2>
                            <div className="mt-6 space-y-3 text-slate-700">
                                {mainCauses.map((cause, index) => (
                                    <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <p className="font-semibold">Cause {index + 1}</p>
                                        <p className="mt-2 text-sm">{cause}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <AlertCenter deliveries={deliveries} />

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

                    <h2 className="text-xl font-bold text-slate-900">
                        {delivery.category}
                    </h2>

                    <p className="mt-2 text-slate-500">
                        {delivery.area}
                    </p>

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

                <InfoItem
                    icon={<Route size={16} />}
                    text={`${delivery.distanceKm} KM`}
                />

                <InfoItem
                    icon={<Clock3 size={16} />}
                    text={`${delivery.pickupDelayMinutes} Min Delay`}
                />

                <InfoItem
                    icon={getWeatherIcon(delivery.weather)}
                    text={delivery.weather}
                />

            </div>

        </div>
    );
}

function InfoItem({ icon, text }) {

    return (

        <div className="flex items-center gap-2">

            <div className="text-orange-500">
                {icon}
            </div>

            <p className="font-medium">
                {text}
            </p>

        </div>
    );
}