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
            return <Sun size={20} className="text-amber-500" />;
        case "Rainy":
        case "Stormy":
            return <CloudRain size={20} className="text-blue-500" />;
        case "Fog":
            return <CloudFog size={20} className="text-slate-500" />;
        case "Sandstorms":
            return <Wind size={20} className="text-yellow-600" />;
        case "Windy":
            return <Wind size={20} className="text-cyan-600" />;
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
                "New live prediction received",
                {
                    style: {
                        borderRadius: '12px',
                        background: '#333',
                        color: '#fff',
                    },
                }
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
        <div className="space-y-8 max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            {/* HERO SECTION */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-10 lg:p-12 text-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)]"
            >
                <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none"></div>
                <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-indigo-400">
                        <Sparkles size={22} aria-hidden="true" />
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em]">
                            AI Operations Center
                        </p>
                    </div>

                    <h1 className="mt-6 max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                        Prevent Delivery Failures Before They Happen
                    </h1>

                    <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300 font-medium">
                        Unified ecommerce delivery intelligence system powered by AI risk analysis,
                        logistics monitoring, traffic analysis, and smart prevention recommendations.
                    </p>

                    <section className="mt-10 rounded-[2rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 pb-5 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                                    <Zap size={20} aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">AI Parameters</h3>
                                    <p className="text-sm text-slate-400 mt-0.5">Adjust variables to run custom predictions</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            <div className="space-y-1.5">
                                <label htmlFor="Agent_Age" className="block text-sm font-medium text-slate-300">Agent Age</label>
                                <input id="Agent_Age" name="Agent_Age" type="number" min="18" max="100" value={formData.Agent_Age} onChange={handleChange} className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-slate-100 placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="Agent_Rating" className="block text-sm font-medium text-slate-300">Agent Rating</label>
                                <select id="Agent_Rating" name="Agent_Rating" value={formData.Agent_Rating} onChange={handleChange} className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-slate-100 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 appearance-none">
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

                            <div className="space-y-1.5">
                                <label htmlFor="Weather" className="block text-sm font-medium text-slate-300">Weather</label>
                                <select id="Weather" name="Weather" value={formData.Weather} onChange={handleChange} className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-slate-100 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 appearance-none">
                                    <option value="Cloudy">Cloudy</option>
                                    <option value="Fog">Fog</option>
                                    <option value="Sandstorms">Sandstorms</option>
                                    <option value="Stormy">Stormy</option>
                                    <option value="Sunny">Sunny</option>
                                    <option value="Windy">Windy</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="Traffic" className="block text-sm font-medium text-slate-300">Traffic</label>
                                <select id="Traffic" name="Traffic" value={formData.Traffic} onChange={handleChange} className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-slate-100 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 appearance-none">
                                    <option value="High">High</option>
                                    <option value="Jam">Jam</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="Vehicle" className="block text-sm font-medium text-slate-300">Vehicle</label>
                                <select id="Vehicle" name="Vehicle" value={formData.Vehicle} onChange={handleChange} className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-slate-100 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 appearance-none">
                                    <option value="motorcycle">Motorcycle</option>
                                    <option value="scooter">Scooter</option>
                                    <option value="van">Van</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="Category" className="block text-sm font-medium text-slate-300">Category</label>
                                <select id="Category" name="Category" value={formData.Category} onChange={handleChange} className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-slate-100 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 appearance-none">
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

                            <div className="space-y-1.5">
                                <label htmlFor="Area" className="block text-sm font-medium text-slate-300">Area</label>
                                <select id="Area" name="Area" value={formData.Area} onChange={handleChange} className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-slate-100 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 appearance-none">
                                    <option value="Metropolitian">Metropolitian</option>
                                    <option value="Other">Other</option>
                                    <option value="Semi-Urban">Semi-Urban</option>
                                    <option value="Urban">Urban</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="Distance_km" className="block text-sm font-medium text-slate-300">Distance (km)</label>
                                <input id="Distance_km" name="Distance_km" type="number" step="0.1" min="0" value={formData.Distance_km} onChange={handleChange} className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-slate-100 placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="Pickup_Delay_Minutes" className="block text-sm font-medium text-slate-300">Pickup Delay (mins)</label>
                                <input id="Pickup_Delay_Minutes" name="Pickup_Delay_Minutes" type="number" min="0" value={formData.Pickup_Delay_Minutes} onChange={handleChange} className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-slate-100 placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="Rush_Hour" className="block text-sm font-medium text-slate-300">Rush Hour</label>
                                <select id="Rush_Hour" name="Rush_Hour" value={formData.Rush_Hour} onChange={handleChange} className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-slate-100 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 appearance-none">
                                    <option value={0}>No</option>
                                    <option value={1}>Yes</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="Order_Hour" className="block text-sm font-medium text-slate-300">Order Hour (0-23)</label>
                                <input id="Order_Hour" name="Order_Hour" type="number" min="0" max="23" value={formData.Order_Hour} onChange={handleChange} className="w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-slate-100 placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                            </div>
                        </div>

                        <button
                            onClick={predictRisk}
                            disabled={loading}
                            aria-busy={loading}
                            className="mt-8 w-full sm:w-auto flex items-center justify-center gap-3 rounded-xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} aria-hidden="true" />
                                    <span>Processing AI...</span>
                                </>
                            ) : (
                                <>
                                    <Zap size={20} aria-hidden="true" />
                                    <span>Launch AI Prediction</span>
                                </>
                            )}
                        </button>
                    </section>
                </div>
            </motion.div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <KPIStatCard
                    title="Total Deliveries"
                    value={
                        Array.isArray(deliveries)
                            ? deliveries.length
                            : 0
                    }
                    icon={<Truck size={28} />}
                    color="text-indigo-600"
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
                    color="text-rose-600"
                />

                <KPIStatCard
                    title="AI Accuracy"
                    value={96}
                    icon={<ShieldCheck size={28} />}
                    color="text-emerald-600"
                />

                <KPIStatCard
                    title="AI Status"
                    value="LIVE"
                    icon={<BrainCircuit size={28} />}
                    color="text-blue-600"
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
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* LEFT COLUMN */}
                <div className="space-y-6 xl:col-span-2">
                    {/* LIVE DELIVERY MONITORING */}
                    <div className="rounded-[2.5rem] bg-white border border-slate-100 p-6 sm:p-8 lg:p-10 shadow-xl shadow-slate-200/40">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                    Live AI Monitoring
                                </h2>
                                <p className="mt-2 text-base text-slate-500 font-medium">
                                    Real-time ecommerce delivery intelligence.
                                </p>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="relative w-full md:w-72">
                                    <label htmlFor="search-deliveries" className="sr-only">Search category</label>
                                    <Search
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={20}
                                        aria-hidden="true"
                                    />
                                    <input
                                        id="search-deliveries"
                                        type="text"
                                        placeholder="Search category..."
                                        value={liveSearch}
                                        onChange={(e) => setLiveSearch(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                                    />
                                </div>
                                <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100 flex-shrink-0">
                                    <Activity size={24} aria-hidden="true" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-5">
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
                                <div className="flex flex-col items-center justify-center py-16 text-slate-400 rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/50">
                                    <Search size={48} className="mb-4 text-slate-300" aria-hidden="true" />
                                    <p className="text-lg font-medium text-slate-500">
                                        No active deliveries found matching "{liveSearch}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                    {/* PREDICTION RESULT CARD */}
                    <div className="rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 sm:p-10 text-white shadow-xl shadow-indigo-600/20">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-200">
                                Live Prediction
                            </p>
                            <Radar size={24} className="text-indigo-300 opacity-70" aria-hidden="true" />
                        </div>
                        <h2 className="mt-8 text-5xl sm:text-6xl font-black tracking-tight" aria-live="polite">
                            {prediction}
                        </h2>
                    </div>

                    {/* EXPLAINABILITY */}
                    {explainability && (
                        <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                AI Explainability
                            </h2>
                            <div className="mt-6 space-y-4">
                                {Object.entries(explainability).map(
                                    ([key, value]) => (
                                        <div
                                            key={key}
                                            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-slate-200 hover:bg-slate-100/50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-700">
                                                    {key.replace(/_/g, " ")}
                                                </span>
                                                <span className="font-bold text-indigo-600">
                                                    {(value * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={value * 100} aria-valuemin="0" aria-valuemax="100">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${value * 100}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="h-full rounded-full bg-indigo-600"
                                                />
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* RECOMMENDATIONS */}
                    {recommendations?.length > 0 && (
                        <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                Smart Recommendations
                            </h2>
                            <ul className="mt-6 space-y-3">
                                {recommendations.map((item, index) => (
                                    <li key={index} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-slate-700 font-medium leading-relaxed">
                                        <span className="flex-shrink-0 mt-0.5 text-indigo-500">
                                            <Sparkles size={18} aria-hidden="true" />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ROOT CAUSE ANALYSIS */}
                    {mainCauses?.length > 0 && (
                        <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                Root Cause Analysis
                            </h2>
                            <div className="mt-6 space-y-4">
                                {mainCauses.map((cause, index) => (
                                    <div key={index} className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
                                        <p className="text-xs font-bold uppercase tracking-wider text-rose-500">
                                            Factor {index + 1}
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-slate-800 leading-relaxed">
                                            {cause}
                                        </p>
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
    // Determine accessible colors based on risk
    const getRiskStyles = (risk) => {
        switch (risk) {
            case "HIGH":
                return "bg-rose-100 text-rose-700 border-rose-200";
            case "MEDIUM":
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "LOW":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            default:
                return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    return (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-6 transition-all hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">
                        {delivery.category}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-500 flex items-center gap-1.5">
                        <Route size={14} aria-hidden="true" />
                        {delivery.area}
                    </p>
                </div>

                <div
                    className={`inline-flex items-center justify-center rounded-xl border px-4 py-1.5 text-xs font-black tracking-wide ${getRiskStyles(delivery.predictedRisk)}`}
                    aria-label={`Predicted Risk: ${delivery.predictedRisk}`}
                >
                    {delivery.predictedRisk} RISK
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 pt-5 border-t border-slate-100">
                <InfoItem
                    icon={<Route size={18} />}
                    text={`${delivery.distanceKm} KM`}
                />
                <InfoItem
                    icon={<Clock3 size={18} />}
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
        <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3 border border-slate-100">
            <div className="text-indigo-500 flex-shrink-0">
                {icon}
            </div>
            <p className="text-sm font-semibold text-slate-700 truncate">
                {text}
            </p>
        </div>
    );
}