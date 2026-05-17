import React from "react";
import { Bell, LogOut, Sparkles } from "lucide-react";
// import ThemeToggle from "./theme/ThemeToggle"; // Kept your import just in case you need it later

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
                
                {/* LEFT: Theme Converter (Placeholder for your future implementation) */}
                {/* <div className="hidden lg:flex w-1/3 justify-start">
                    <ThemeToggle />
                </div> */}

                {/* CENTER: Name & Subtitle */}
                <div className="flex flex-col justify-center lg:w-1/3 lg:items-center text-left lg:text-center">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                        DeliverAI Guard
                    </h1>
                    <p className="hidden sm:block mt-0.5 text-xs sm:text-sm font-semibold text-slate-500">
                        AI-Based Delivery Failure Prevention Platform
                    </p>
                </div>

                {/* RIGHT: Notification, AI Badge & Logout */}
                <div className="flex items-center justify-end gap-3 sm:gap-4 lg:w-1/3">
                    
                    {/* NOTIFICATIONS */}
                    <button 
                        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                        aria-label="View notifications"
                    >
                        <Bell size={20} aria-hidden="true" />
                    </button>

                    {/* AI BADGE (Replaced Orange with Indigo) */}
                    <div 
                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 font-black tracking-wide text-white shadow-md shadow-indigo-600/20 cursor-default"
                        aria-label="AI Status Active"
                    >
                        <Sparkles size={18} className="hidden sm:block" aria-hidden="true" />
                        AI
                    </div>

                    {/* LOGOUT (Original Logic Preserved) */}
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/login";
                        }}
                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 font-bold text-white shadow-md shadow-rose-500/20 transition-all hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 focus:outline-none focus:ring-4 focus:ring-rose-500/40"
                        aria-label="Log out of account"
                    >
                        <LogOut size={18} aria-hidden="true" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>

                </div>
            </div>
        </header>
    );
}