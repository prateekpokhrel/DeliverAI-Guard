import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/dashboard";
import Login from "./pages/Login";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* LOGIN */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* DASHBOARD */}

                <Route
                    path="/"
                    element={

                        <div className="min-h-screen bg-[#f4f7fb] dark:bg-[#020617]">

                            <Navbar />

                            <div className="p-4 md:p-6 xl:p-8">

                                <Dashboard />

                            </div>

                        </div>

                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;