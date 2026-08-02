import Image from "next/image";
import { Trophy, Flame, CheckCircle2, Medal } from "lucide-react";

type LeaderboardCardProps = {
    rank: number;
    avatar: string;
    username: string;   
    streak: number;
    todaySolved: number;
    totalSolved: number;
};

export default function LeaderboardCard({
    rank,
    avatar,
    username,
    streak,
    todaySolved,
    totalSolved,
}: LeaderboardCardProps) {
    return (
        <div className="group flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#131313] px-8 py-5 transition-all duration-300 hover:border-amber-500/40 hover:bg-[#191919] hover:-translate-y-1">

            {/* Left */}
            <div className="flex items-center gap-6">

                {/* Rank */}
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-xl font-bold text-amber-400">
                    #{rank}
                </div>

                {/* Avatar */}
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-amber-500/30">
                    <Image
                        src={avatar}
                        alt={username}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Username */}
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        {username}
                    </h2>

                    <p className="text-sm text-zinc-500">
                        Codeforces
                    </p>
                </div>

            </div>

            {/* Right */}
            <div className="flex items-center gap-10">

                <div className="text-center">
                    <div className="mb-2 flex justify-center">
                        <Flame className="text-orange-400" size={18} />
                    </div>

                    <p className="text-xs uppercase tracking-widest text-zinc-500">
                        Streak
                    </p>

                    <h3 className="text-xl font-bold text-white">
                        {streak}
                    </h3>
                </div>

                <div className="text-center">
                    <div className="mb-2 flex justify-center">
                        <CheckCircle2 className="text-green-400" size={18} />
                    </div>

                    <p className="text-xs uppercase tracking-widest text-zinc-500">
                        Today
                    </p>

                    <h3 className="text-xl font-bold text-white">
                        {todaySolved}
                    </h3>
                </div>

                <div className="text-center">
                    <div className="mb-2 flex justify-center">
                        <Trophy className="text-amber-400" size={18} />
                    </div>

                    <p className="text-xs uppercase tracking-widest text-zinc-500">
                        Solved
                    </p>

                    <h3 className="text-xl font-bold text-white">
                        {totalSolved}
                    </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 group-hover:border-amber-500/40">
                    <Medal
                        className="text-zinc-400 group-hover:text-amber-400"
                        size={20}
                    />
                </div>

            </div>
        </div>
    );
}