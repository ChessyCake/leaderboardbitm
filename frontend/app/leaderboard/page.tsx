"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import PodiumCard from "@/components/TopCards";
import StatsCard from "@/components/StatsCard";

interface LeaderboardUser {
    rank: number;
    name: string;
    avatar: string;
    codeforcesUsername: string;
    streak: number;
    todaySolved: number;
    totalSolved: number;
}

export default function LeaderboardPage() {

    const [data, setData] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchLeaderboard = async () => {

            try {

                const res = await api("/api/leaderboard?page=1");

                if (!res.ok)
                    throw new Error("Failed to fetch leaderboard");

                const json = await res.json();

                setData(json.leaderboard);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        };

        fetchLeaderboard();

    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    const podium = data.slice(0, 3);
    const others = data.slice(3);

    return (

        <main className="min-h-screen bg-[#090909] px-8 py-10">

            <div className="mx-auto max-w-7xl">

                {/* Heading */}

                <div className="mb-12">

                    <h1 className="text-5xl font-black text-white">
                        Leaderboard
                    </h1>

                    <p className="mt-3 text-zinc-400">
                        Today's Competitive Programming Rankings
                    </p>

                </div>

                {/* ================= PODIUM ================= */}

                <div className="grid grid-cols-3 items-end gap-6">

                    {/* Rank 2 */}

                    <div>

                        {podium[1] && (

                            <PodiumCard
                                place={2}
                                size="small"
                                avatar={podium[1].avatar}
                                username={podium[1].codeforcesUsername}
                                streak={podium[1].streak}
                                todaySolved={podium[1].todaySolved}
                                totalSolved={podium[1].totalSolved}
                            />

                        )}

                    </div>

                    {/* Rank 1 */}

                    <div>

                        {podium[0] && (

                            <PodiumCard
                                place={1}
                                size="large"
                                avatar={podium[0].avatar}
                                username={podium[0].codeforcesUsername}
                                streak={podium[0].streak}
                                todaySolved={podium[0].todaySolved}
                                totalSolved={podium[0].totalSolved}
                            />

                        )}

                    </div>

                    {/* Rank 3 */}

                    <div>

                        {podium[2] && (

                            <PodiumCard
                                place={3}
                                size="small"
                                avatar={podium[2].avatar}
                                username={podium[2].codeforcesUsername}
                                streak={podium[2].streak}
                                todaySolved={podium[2].todaySolved}
                                totalSolved={podium[2].totalSolved}
                            />

                        )}

                    </div>

                </div>

                {/* ================= REST ================= */}

                {others.length > 0 && (

                    <div className="mt-12 flex flex-col gap-5">

                        {others.map((user) => (

                            <StatsCard
                                key={user.rank}
                                rank={user.rank}
                                avatar={user.avatar}
                                username={user.codeforcesUsername}
                                streak={user.streak}
                                todaySolved={user.todaySolved}
                                totalSolved={user.totalSolved}
                            />

                        ))}

                    </div>

                )}

            </div>

        </main>

    );

}