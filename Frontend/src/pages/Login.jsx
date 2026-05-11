import { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import {
    LogIn,
    Loader2,
} from "lucide-react";

export default function Login() {

    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] =
        useState({
            email: "",
            password: "",
        });

    /* ========================= */
    /* HANDLE CHANGE */
    /* ========================= */

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
            e.target.value,
        });
    };

    /* ========================= */
    /* LOGIN */
    /* ========================= */

    const handleLogin = async (
        e
    ) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response =
                await axios.post(
                    "http://localhost:8084/api/auth/login",
                    formData
                );

            localStorage.setItem(
                "token",
                response.data.token
            );

            toast.success(
                "Login successful"
            );

            window.location.href =
                "/";

        } catch (error) {

            console.log(error);

            toast.error(
                "Invalid credentials"
            );

        } finally {

            setLoading(false);
        }
    };

    /* ========================= */
    /* UI */
    /* ========================= */

    return (

        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-orange-50 dark:from-[#020617] dark:via-[#081225] dark:to-[#111827]">

            <div className="w-full max-w-md rounded-[36px] bg-white p-10 shadow-2xl dark:bg-slate-900">

                {/* HEADER */}

                <div className="text-center">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-100 text-orange-500">

                        <LogIn size={34} />

                    </div>

                    <h1 className="mt-6 text-4xl font-black text-slate-900 dark:text-white">

                        Welcome Back

                    </h1>

                    <p className="mt-3 text-slate-500 dark:text-slate-400">

                        Login to DeliverAI Guard

                    </p>

                </div>

                {/* FORM */}

                <form
                    onSubmit={handleLogin}
                    className="mt-10 space-y-6"
                >

                    {/* EMAIL */}

                    <div>

                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">

                            Email

                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />

                    </div>

                    {/* PASSWORD */}

                    <div>

                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">

                            Password

                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />

                    </div>

                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 py-4 font-semibold text-white shadow-lg transition hover:bg-orange-600"
                    >

                        {loading ? (
                            <>
                                <Loader2
                                    size={20}
                                    className="animate-spin"
                                />

                                Logging in...
                            </>
                        ) : (
                            <>
                                <LogIn size={20} />

                                Login
                            </>
                        )}

                    </button>

                </form>

            </div>

        </div>
    );
}