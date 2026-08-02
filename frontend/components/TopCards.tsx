import Image from "next/image";
import { Trophy, Flame, CheckCircle2, Crown } from "lucide-react";

type PodiumCardProps = {
    place: 1 | 2 | 3;
    size: "large" | "small";

    avatar: string;
    username: string;

    streak: number;
    todaySolved: number;
    totalSolved: number;
};

export default function PodiumCard({
    place,
    size,
    avatar,
    username,
    streak,
    todaySolved,
    totalSolved,
}: PodiumCardProps) {

    const isLarge = size === "large";

    return (
        <div
            className={`
                relative overflow-hidden rounded-3xl
                border border-amber-500/20
                bg-gradient-to-br
                from-zinc-900
                via-[#181513]
                to-black
                shadow-[0_0_30px_rgba(245,158,11,0.08)]
                transition-all duration-300
                hover:border-amber-400/50
                hover:-translate-y-1
                hover:shadow-[0_0_45px_rgba(245,158,11,0.15)]

                ${isLarge ? "h-[430px] p-8" : "h-[205px] p-6"}
            `}
        >
            {/* background glow */}
            <div className="absolute -top-28 -right-20 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />

            {/* Rank */}
            <div className="absolute left-6 top-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-xl font-bold text-amber-400">
                    #{place}
                </div>
            </div>

            {/* Crown */}
            {place === 1 && (
                <Crown
                    className="absolute right-7 top-7 text-yellow-400"
                    size={28}
                />
            )}

            {/* Avatar */}
            <div
                className={`
                    relative mx-auto overflow-hidden rounded-full
                    border-2 border-amber-500/40

                    ${
                        isLarge
                            ? "mt-10 h-32 w-32"
                            : "mt-2 h-20 w-20"
                    }
                `}
            >
                <Image
                    src={avatar}
                    alt={username}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Username */}
            <div className="mt-5 text-center">

                <h2
                    className={`
                        font-bold text-white

                        ${
                            isLarge
                                ? "text-3xl"
                                : "text-xl"
                        }
                    `}
                >
                    {username}
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                    Codeforces
                </p>

            </div>

            {/* Large stats */}
            {isLarge ? (

                <div className="mt-10 grid grid-cols-3 gap-5">

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">

                        <Flame className="mb-2 text-orange-400" />

                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                            Streak
                        </p>

                        <h3 className="mt-2 text-2xl font-bold text-white">
                            {streak}
                        </h3>

                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">

                        <CheckCircle2 className="mb-2 text-green-400" />

                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                            Today
                        </p>

                        <h3 className="mt-2 text-2xl font-bold text-white">
                            {todaySolved}
                        </h3>

                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">

                        <Trophy className="mb-2 text-amber-400" />

                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                            Solved
                        </p>

                        <h3 className="mt-2 text-2xl font-bold text-white">
                            {totalSolved}
                        </h3>

                    </div>

                </div>

            ) : (

                <div className="mt-6 flex items-center justify-between">

                    <div className="flex items-center gap-2 text-orange-400">

                        <Flame size={18} />

                        <span className="font-semibold">
                            {streak}
                        </span>

                    </div>

                    <div className="flex items-center gap-2 text-green-400">

                        <CheckCircle2 size={18} />

                        <span className="font-semibold">
                            {todaySolved}
                        </span>

                    </div>

                    <div className="flex items-center gap-2 text-amber-400">

                        <Trophy size={18} />

                        <span className="font-semibold">
                            {totalSolved}
                        </span>

                    </div>

                </div>

            )}
        </div>
    );
}