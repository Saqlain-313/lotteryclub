import {
  ChevronRight,
  Crown,
  Medal,
  TrendingUp,
  UserCircle2,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const topWinners = [
  {
    rank: 1,
    name: "Rahul K.",
    amount: "₹12,50,000",
    color: "bg-gradient-to-r from-yellow-400 to-yellow-500",
    icon: Crown,
    badge: "🏆",
    verified: true,
  },
  {
    rank: 2,
    name: "Alex M.",
    amount: "₹8,20,000",
    color: "bg-gradient-to-r from-gray-300 to-gray-400",
    icon: Medal,
    badge: "🥈",
    verified: true,
  },
  {
    rank: 3,
    name: "Suman P.",
    amount: "₹5,60,000",
    color: "bg-gradient-to-r from-orange-400 to-orange-500",
    icon: Medal,
    badge: "🥉",
    verified: true,
  },
];

// Base ranks 4-10 (used for amount range + verified defaults, name swaps live)
const baseOtherWinners = [
  { rank: 4, name: "John D.", amount: "₹3,20,000", verified: true },
  { rank: 5, name: "Amit S.", amount: "₹2,75,000", verified: true },
  { rank: 6, name: "Peter K.", amount: "₹2,10,000", verified: false },
  { rank: 7, name: "Ram C.", amount: "₹1,80,000", verified: true },
  { rank: 8, name: "David L.", amount: "₹1,50,000", verified: false },
  { rank: 9, name: "Ali R.", amount: "₹1,20,000", verified: true },
  { rank: 10, name: "Mohan T.", amount: "₹1,00,000", verified: false },
];

// Pool of names to rotate through, simulating fresh players joining the board
const namePool = [
  "Vikram S.",
  "Neha J.",
  "Carlos R.",
  "Priya M.",
  "Tom W.",
  "Sana K.",
  "Arjun B.",
  "Emily T.",
  "Farhan A.",
  "Divya N.",
  "Michael O.",
  "Kavya R.",
  "Rohit V.",
  "Lisa C.",
  "Imran H.",
  "Ananya D.",
  "Steve P.",
  "Zoya F.",
  "Karan G.",
  "Meera S.",
  "Daniel K.",
  "Pooja L.",
  "Yusuf M.",
  "Sara B.",
  "Nikhil T.",
];

const formatINR = (num) => "₹" + Math.round(num).toLocaleString("en-IN");

export default function TopWinners() {
  const navigate = useNavigate();
  const [winners, setWinners] = useState(baseOtherWinners);
  const [flashRank, setFlashRank] = useState(null);
  const usedNames = useRef(new Set(baseOtherWinners.map((w) => w.name)));

  const handleViewAll = () => {
    navigate("/top-winners");
  };

  // Live rotation: every few seconds, swap one row (rank 4-10) with a fresh name
  useEffect(() => {
    const interval = setInterval(() => {
      setWinners((prev) => {
        const idx = Math.floor(Math.random() * prev.length);
        const current = prev[idx];

        // pick a name not already showing on the board
        let candidates = namePool.filter((n) => !usedNames.current.has(n));
        if (candidates.length === 0) candidates = namePool;
        const newName =
          candidates[Math.floor(Math.random() * candidates.length)];

        usedNames.current.delete(current.name);
        usedNames.current.add(newName);

        // small realistic jitter on the amount, kept within that rank's ballpark
        const baseAmount = parseInt(current.amount.replace(/[₹,]/g, ""), 10);
        const jitter = Math.round(baseAmount * (0.94 + Math.random() * 0.1));

        const updated = [...prev];
        updated[idx] = {
          ...current,
          name: newName,
          amount: formatINR(jitter),
          verified: Math.random() > 0.3,
        };

        setFlashRank(updated[idx].rank);
        setTimeout(() => setFlashRank(null), 1200);

        return updated;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const goldenTextStyle = {
    background: "linear-gradient(135deg, #7b5800 0%, #fdba12 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const avatarGradients = [
    "from-blue-400 to-indigo-500",
    "from-pink-400 to-rose-500",
    "from-green-400 to-teal-500",
    "from-purple-400 to-violet-500",
    "from-cyan-400 to-blue-500",
  ];

  return (
    <div className="w-full max-w-8xl mx-auto px-3 sm:px-6 py-6">
      {/* Header - WINZOX Style */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h2
            className="text-2xl md:text-3xl font-black tracking-tight"
            style={goldenTextStyle}
          >
            Top Winners
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-0.5">
            Leading performers this month
          </p>
        </div>
        <button
          onClick={handleViewAll}
          className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 text-sm"
        >
          View All
          <ChevronRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      {/* Main Grid - Podium + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Podium Section - 3 columns for top 3 */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50/50 px-4 sm:px-6 py-3 border-b border-yellow-200/30">
            <div className="flex items-center gap-2">
              <div className="bg-yellow-400 p-1.5 rounded-lg">
                <Crown className="text-white" size={16} />
              </div>
              <span className="text-yellow-700 font-bold text-sm uppercase tracking-wide">
                Top 3 Winners
              </span>
            </div>
          </div>

          {/* Podium Layout */}
          <div className="p-4 sm:p-6">
            <div className="flex items-end justify-center gap-3 md:gap-6 h-64 md:h-72">
              {/* 2nd Place */}
              <div className="flex flex-col items-center flex-1">
                <div className="relative">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-gray-300 flex items-center justify-center shadow-lg">
                    <UserCircle2 className="text-gray-600" size={32} />
                  </div>
                  <div className="absolute -top-1 -right-1 text-lg md:text-2xl">
                    🥈
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-gray-800 font-bold text-sm md:text-base">
                    {topWinners[1].name}
                  </p>
                  <p className="text-gray-500 text-xs md:text-sm">
                    {topWinners[1].amount}
                  </p>
                </div>
                <div className="w-full bg-gray-200/50 h-16 md:h-24 rounded-t-lg flex items-center justify-center mt-1 border border-gray-200/50">
                  <span className="text-gray-400 font-bold text-xl md:text-2xl">
                    2
                  </span>
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center flex-1">
                <div className="relative">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 border-4 border-yellow-300 flex items-center justify-center shadow-2xl">
                    <UserCircle2 className="text-white" size={36} />
                  </div>
                  <div className="absolute -top-1 -right-1 text-xl md:text-3xl animate-bounce">
                    ⭐
                  </div>
                  <div className="absolute -bottom-1 -left-1">
                    <span className="text-xs bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full font-bold">
                      #1
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-gray-900 font-extrabold text-base md:text-lg">
                    {topWinners[0].name}
                  </p>
                  <p className="text-yellow-600 font-bold text-sm md:text-base">
                    {topWinners[0].amount}
                  </p>
                </div>
                <div className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 h-20 md:h-32 rounded-t-lg flex items-center justify-center mt-1 shadow-lg">
                  <span className="text-white font-black text-2xl md:text-4xl">
                    1
                  </span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center flex-1">
                <div className="relative">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 border-4 border-orange-300 flex items-center justify-center shadow-lg">
                    <UserCircle2 className="text-white" size={32} />
                  </div>
                  <div className="absolute -top-1 -right-1 text-lg md:text-2xl">
                    🥉
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-gray-800 font-bold text-sm md:text-base">
                    {topWinners[2].name}
                  </p>
                  <p className="text-gray-500 text-xs md:text-sm">
                    {topWinners[2].amount}
                  </p>
                </div>
                <div className="w-full bg-orange-200/50 h-12 md:h-16 rounded-t-lg flex items-center justify-center mt-1 border border-orange-200/50">
                  <span className="text-orange-400 font-bold text-xl md:text-2xl">
                    3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Section - Ranks 4-10, live-rotating */}
        <div className="lg:col-span-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50/50 px-4 sm:px-6 py-3 border-b border-blue-200/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-400 p-1.5 rounded-lg">
                  <Users className="text-white" size={16} />
                </div>
                <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">
                  Leaderboard
                </span>
              </div>
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-4">
            <div className="space-y-1.5">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs text-gray-400 font-medium uppercase tracking-wider border-b border-gray-100">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-7">Player</div>
                <div className="col-span-4 text-right">Amount</div>
              </div>

              {winners.map((winner, i) => {
                const isFlashing = flashRank === winner.rank;
                return (
                  <div
                    key={winner.rank}
                    className={`grid grid-cols-12 gap-2 px-3 py-2.5 rounded-xl border transition-all duration-700 group cursor-pointer
                      ${
                        isFlashing
                          ? "bg-gradient-to-r from-yellow-50 to-orange-50/60 border-yellow-300/70 shadow-[0_2px_12px_-2px_rgba(251,191,36,0.35)]"
                          : "bg-transparent border-transparent hover:bg-gray-50/80 hover:border-gray-100"
                      }`}
                  >
                    <div className="col-span-1 flex items-center justify-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200
                        ${
                          winner.rank <= 5
                            ? "bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700"
                            : "bg-gray-100 text-gray-500 group-hover:bg-yellow-100 group-hover:text-yellow-700"
                        }`}
                      >
                        {winner.rank}
                      </div>
                    </div>
                    <div className="col-span-7 flex items-center gap-2 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-sm`}
                      >
                        {winner.name.charAt(0)}
                      </div>
                      <span
                        key={winner.name}
                        className={`text-gray-700 font-medium text-sm group-hover:text-gray-900 transition-colors truncate ${
                          isFlashing ? "animate-[fadeIn_0.6s_ease]" : ""
                        }`}
                      >
                        {winner.name}
                      </span>
                      {winner.verified && (
                        <span className="text-[8px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex-shrink-0">
                          ✓
                        </span>
                      )}
                      {isFlashing && (
                        <span className="text-[8px] bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex-shrink-0 flex items-center gap-0.5">
                          <Zap size={8} />
                          New
                        </span>
                      )}
                    </div>
                    <div className="col-span-4 flex items-center justify-end gap-1">
                      <span className="text-gray-700 font-semibold text-sm group-hover:text-yellow-600 transition-colors">
                        {winner.amount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live ticker footer */}
          <div className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-100 flex items-center gap-2">
            <TrendingUp size={12} className="text-green-500 flex-shrink-0" />
            <p className="text-[10px] text-gray-500 font-medium truncate">
              Leaderboard updates live as players win — rankings refresh
              automatically
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-2px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
