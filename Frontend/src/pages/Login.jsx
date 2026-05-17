import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    LogIn,
    UserPlus,
    Loader2,
    Mail,
    Lock,
    User,
    Phone,
    MapPin
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        contact: "",
        address: "",
    });

    /* ========================= */
    /* HANDLE CHANGE */
    /* ========================= */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    /* ========================= */
    /* TOGGLE MODE */
    /* ========================= */
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ name: "", email: "", password: "", contact: "", address: "" });
    };

    /* ========================= */
    /* GOOGLE AUTH */
    /* ========================= */
    const handleGoogleAuth = () => {
        toast.loading("Redirecting to Google...", {
            style: {
                borderRadius: '12px',
                background: '#1e293b',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500'
            },
        });

        // Actual redirect to your backend OAuth route
        window.location.href = `${API_BASE_URL}/api/auth/google`;
    };

    /* ========================= */
    /* SUBMIT (LOGIN / SIGNUP) */
    /* ========================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
            const payload = isLogin 
                ? { email: formData.email, password: formData.password } 
                : formData;

            const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload);

            localStorage.setItem("token", response.data.token);
            
            toast.success(isLogin ? "Login successful!" : "Welcome to DeliverAI Guard!");
            window.location.href = "/";

        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || 
                (isLogin ? "Invalid credentials" : "Registration failed. Please try again.");
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    /* ========================= */
    /* UI */
    /* ========================= */
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/50 to-slate-200 py-10 px-4 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900">
            
            <div className="w-full max-w-lg overflow-y-auto rounded-[2.5rem] border border-white/50 bg-white/80 p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-xl max-h-[95vh] sm:p-12 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-2xl [&::-webkit-scrollbar]:hidden">
                
                {/* HEADER */}
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                        {isLogin ? <LogIn size={28} /> : <UserPlus size={28} />}
                    </div>
                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {isLogin ? "Welcome Back" : "Create an Account"}
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {isLogin ? "Log in to access DeliverAI Guard" : "Join DeliverAI Guard today"}
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    
                    {/* SIGNUP SPECIFIC FIELDS */}
                    {!isLogin && (
                        <>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                {/* NAME */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required={!isLogin}
                                            placeholder="John Doe"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
                                        />
                                    </div>
                                </div>

                                {/* CONTACT DETAILS */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Contact Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="tel"
                                            name="contact"
                                            value={formData.contact}
                                            onChange={handleChange}
                                            required={!isLogin}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ADDRESS */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Full Address
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required={!isLogin}
                                        rows="2"
                                        placeholder="123 Main St, City, Country"
                                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
                                    ></textarea>
                                </div>
                            </div>
                        </>
                    )}

                    {/* EMAIL */}
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="name@example.com"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
                            />
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Password
                            </label>
                            {isLogin && (
                                <a href="#" className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400">
                                    Forgot password?
                                </a>
                            )}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
                            />
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                {isLogin ? "Authenticating..." : "Creating account..."}
                            </>
                        ) : (
                            <>
                                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                                {isLogin ? "Sign In" : "Sign Up"}
                            </>
                        )}
                    </button>
                </form>

                {/* DIVIDER */}
                <div className="relative mb-6 mt-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* GOOGLE AUTH BUTTON */}
                <button
                    onClick={handleGoogleAuth}
                    type="button"
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                </button>

                {/* TOGGLE FOOTER */}
                <div className="mt-8 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={toggleMode}
                        type="button"
                        className="font-bold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline dark:text-indigo-400"
                    >
                        {isLogin ? "Sign up" : "Log in"}
                    </button>
                </div>

            </div>
        </div>
    );
}