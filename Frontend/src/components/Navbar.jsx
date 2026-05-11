import { Bell } from "lucide-react";
import ThemeToggle from "./theme/ThemeToggle";

import {
  LogOut,
} from "lucide-react";

export default function Navbar() {
  return (
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-8 py-5">

          {/* LEFT: Theme Converter */}
          {/*<div className="flex w-1/3 justify-start">*/}
          {/*  */}
          {/*</div>*/}

          {/* CENTER: Name & Subtitle */}
          <div className="flex w-1/3 flex-col items-center text-center">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              DeliverAI Guard
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              AI-Based Delivery Failure Prevention Platform
            </p>
          </div>

          {/* RIGHT: Notification & AI Logo */}

          <div className="flex w-1/3 items-center justify-end gap-4">

            <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-100">
              <Bell size={20} className="text-slate-700" />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-lg font-black text-white shadow-md">
              AI
            </div>
            <button
                onClick={() => {

                  localStorage.removeItem(
                      "token"
                  );

                  window.location.href =
                      "/login";
                }}
                className="flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >

              <LogOut size={18} />

              Logout

            </button>

          </div>

        </div>
      </header>
  );
}