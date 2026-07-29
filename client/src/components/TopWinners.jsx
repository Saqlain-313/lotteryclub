import { Trophy, Medal, UserCircle2, Crown, Star, TrendingUp, ChevronRight, Award, Users, Zap } from "lucide-react";
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

const otherWinners = [
  { rank: 4, name: "John D.", amount: "₹3,20,000", verified: true },
  { rank: 5, name: "Amit S.", amount: "₹2,75,000", verified: true },
  { rank: 6, name: "Peter K.", amount: "₹2,10,000", verified: false },
  { rank: 7, name: "Ram C.", amount: "₹1,80,000", verified: true },
  { rank: 8, name: "David L.", amount: "₹1,50,000", verified: false },
  { rank: 9, name: "Ali R.", amount: "₹1,20,000", verified: true },
  { rank: 10, name: "Mohan T.", amount: "₹1,00,000", verified: false },
];

export default function TopWinners() {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/top-winners");
  };

  const goldenTextStyle = {
    background: "linear-gradient(135deg, #7b5800 0%, #fdba12 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <div className="w-full max-w-8xl mx-auto px-3 sm:px-6 py-6">
      {/* Header - WINZOX Style */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={goldenTextStyle}>
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
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
                🏆 Top 3 Winners
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
                  <div className="absolute -top-1 -right-1 text-lg md:text-2xl">🥈</div>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-gray-800 font-bold text-sm md:text-base">{topWinners[1].name}</p>
                  <p className="text-gray-500 text-xs md:text-sm">{topWinners[1].amount}</p>
                </div>
                <div className="w-full bg-gray-200/50 h-16 md:h-24 rounded-t-lg flex items-center justify-center mt-1 border border-gray-200/50">
                  <span className="text-gray-400 font-bold text-xl md:text-2xl">2</span>
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center flex-1">
                <div className="relative">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 border-4 border-yellow-300 flex items-center justify-center shadow-2xl">
                    <UserCircle2 className="text-white" size={36} />
                  </div>
                  <div className="absolute -top-1 -right-1 text-xl md:text-3xl animate-bounce">⭐</div>
                  <div className="absolute -bottom-1 -left-1">
                    <span className="text-xs bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full font-bold">#1</span>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-gray-900 font-extrabold text-base md:text-lg">{topWinners[0].name}</p>
                  <p className="text-yellow-600 font-bold text-sm md:text-base">{topWinners[0].amount}</p>
                </div>
                <div className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 h-20 md:h-32 rounded-t-lg flex items-center justify-center mt-1 shadow-lg">
                  <span className="text-white font-black text-2xl md:text-4xl">1</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center flex-1">
                <div className="relative">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 border-4 border-orange-300 flex items-center justify-center shadow-lg">
                    <UserCircle2 className="text-white" size={32} />
                  </div>
                  <div className="absolute -top-1 -right-1 text-lg md:text-2xl">🥉</div>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-gray-800 font-bold text-sm md:text-base">{topWinners[2].name}</p>
                  <p className="text-gray-500 text-xs md:text-sm">{topWinners[2].amount}</p>
                </div>
                <div className="w-full bg-orange-200/50 h-12 md:h-16 rounded-t-lg flex items-center justify-center mt-1 border border-orange-200/50">
                  <span className="text-orange-400 font-bold text-xl md:text-2xl">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Section - Ranks 4-10 */}
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
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <Zap size={12} className="text-yellow-400" />
                Live
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-4">
            <div className="space-y-1">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs text-gray-400 font-medium uppercase tracking-wider border-b border-gray-100">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-7">Player</div>
                <div className="col-span-4 text-right">Amount</div>
              </div>

              {otherWinners.map((winner) => (
                <div
                  key={winner.rank}
                  className="grid grid-cols-12 gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group cursor-pointer"
                >
                  <div className="col-span-1 flex items-center justify-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200
                      ${winner.rank <= 5 
                        ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700' 
                        : 'bg-gray-100 text-gray-500 group-hover:bg-yellow-100 group-hover:text-yellow-700'
                      }`}
                    >
                      {winner.rank}
                    </div>
                  </div>
                  <div className="col-span-7 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200">
                      <UserCircle2 className="text-gray-500" size={16} />
                    </div>
                    <span className="text-gray-700 font-medium text-sm group-hover:text-gray-900 transition-colors">
                      {winner.name}
                    </span>
                    {winner.verified && (
                      <span className="text-[8px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="col-span-4 flex items-center justify-end">
                    <span className="text-gray-700 font-semibold text-sm group-hover:text-yellow-600 transition-colors">
                      {winner.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats - WINZOX Style */}
      {/* <div className="mt-6 flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-green-500/20 p-1.5 rounded-lg">
              <TrendingUp className="text-green-500" size={16} />
            </div>
            <span className="text-xs text-gray-600 font-medium">
              Total Prizes: <span className="font-bold text-gray-800">₹38,65,000</span>
            </span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-gray-200"></div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex -space-x-2">
              {topWinners.slice(0, 3).map((winner, i) => (
                <div key={i} className={`w-6 h-6 rounded-full ${winner.color} border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-sm`}>
                  {winner.rank}
                </div>
              ))}
            </div>
            <span className="text-xs text-gray-500">Top performers</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs text-gray-500 font-medium">Live Updates</span>
          <div className="flex items-center gap-1 ml-2">
            <Award size={14} className="text-yellow-400" />
            <span className="text-xs font-bold text-yellow-600">2.4M</span>
            <span className="text-[10px] text-gray-400">players</span>
          </div>
        </div>
      </div> */}
    </div>
  );
}