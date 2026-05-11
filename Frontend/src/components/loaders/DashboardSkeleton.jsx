import Skeleton from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";

export default function DashboardSkeleton() {

    return (

        <div className="space-y-8">

            {/* HERO */}

            <div className="rounded-[40px] bg-white p-10 shadow-xl dark:bg-slate-900">

                <Skeleton
                    height={40}
                    width={300}
                />

                <Skeleton
                    height={80}
                    className="mt-6"
                />

                <Skeleton
                    height={20}
                    count={3}
                    className="mt-4"
                />

            </div>

            {/* KPI */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

                {[...Array(4)].map((_, i) => (

                    <div
                        key={i}
                        className="rounded-[30px] bg-white p-8 shadow-xl dark:bg-slate-900"
                    >

                        <Skeleton
                            height={20}
                            width={120}
                        />

                        <Skeleton
                            height={60}
                            width={100}
                            className="mt-5"
                        />

                    </div>

                ))}

            </div>

        </div>
    );
}