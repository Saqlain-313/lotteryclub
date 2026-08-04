import {
  ArrowLeftFromLine,
  ArrowRight,
  ArrowRightFromLine,
  Award,
  Calendar,
  Clock,
  Coins,
  Crown,
  Dice5,
  Eye,
  Gamepad2,
  Gem,
  Hash,
  Inbox,
  List,
  Moon,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Trophy,
  Wallet,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTodayBidsSummary } from "../../redux/slices/bidSlice";
import { getActiveMarkets } from "../../redux/slices/marketSlice";
import { getTodayResults } from "../../redux/slices/resultSlice";

// Helper function to get currency symbol based on country
const getCurrencySymbol = (country) => {
  const symbols = {
    'IN': '₹',
    'US': '$',
    'GB': '£',
    'EU': '€',
    'JP': '¥',
    'CN': '¥',
    'AU': '$',
    'CA': '$',
    'SG': 'S$',
    'MY': 'RM',
    'AE': 'د.إ',
    'SA': '﷼',
    'default': '₹'
  };
  return symbols[country] || symbols.default;
};

const MatkaDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { todaySummary } = useSelector((state) => state.bid);
  const { todayResults } = useSelector((state) => state.result);
  const { activeMarkets } = useSelector((state) => state.market);
  const { loading } = useSelector((state) => state.bid);

  // Get currency symbol based on user's country
  const currencySymbol = getCurrencySymbol(user?.country);

  // Format currency function using the currency symbol
  const formatCurrency = (amount) => {
    return `${currencySymbol}${Number(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  };

  useEffect(() => {
    dispatch(getTodayBidsSummary());
    dispatch(getTodayResults());
    dispatch(getActiveMarkets());
  }, [dispatch]);

  const getGameTypeDisplay = (type) => {
    const display = {
      single: "Single",
      jodi: "Jodi",
      panna: "Panna",
      "half-sangam": "Half-Sangam",
      "full-sangam": "Full-Sangam",
      "last-digit": "Last Digit",
      "first-digit": "First Digit",
    };
    return display[type] || type;
  };

  const getGameTypeGradient = (type) => {
    const gradients = {
      single: "from-blue-400 to-indigo-500",
      jodi: "from-green-400 to-emerald-500",
      panna: "from-purple-400 to-violet-500",
      "half-sangam": "from-orange-400 to-amber-500",
      "full-sangam": "from-red-400 to-rose-500",
      "last-digit": "from-cyan-400 to-blue-500",
      "first-digit": "from-pink-400 to-rose-500",
    };
    return gradients[type] || "from-gray-400 to-gray-500";
  };

  const getGameTypeIcon = (type) => {
    const icons = {
      single: Target,
      jodi: Hash,
      panna: Dice5,
      "half-sangam": Moon,
      "full-sangam": Sun,
      "last-digit": ArrowRightFromLine,
      "first-digit": ArrowLeftFromLine,
    };
    return icons[type] || Gamepad2;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-amber-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse"></div>
          </div>
          <p className="text-gray-500 text-sm mt-4 text-center font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const recentWins = todaySummary?.won?.totalBids || 0;
  const totalWonAmount = todaySummary?.won?.totalAmount || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 px-4 sm:px-6 py-6">
      <div className=" mx-auto space-y-6">
        {/* Welcome Section with 3D Glass Effect */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl shadow-2xl p-8 text-white overflow-hidden transform group-hover:scale-[1.01] transition duration-500">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full filter blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 backdrop-blur-lg rounded-full p-2 shadow-lg border border-white/30">
                    <Crown className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                  </div>
                  <span className="text-amber-100 font-semibold tracking-wider uppercase text-xs bg-white/20 backdrop-blur-lg px-3 py-1 rounded-full border border-white/30">
                    VIP Dashboard
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-2">
                  Welcome back, {user?.name || "User"}!
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                </h1>
                <p className="text-amber-100/90 text-sm mt-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Here's your Matka game summary for today
                </p>
              </div>
              <Link
                to="/matka/markets"
                className="group/btn relative px-8 py-3.5 bg-white text-amber-600 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50 opacity-0 group-hover/btn:opacity-100 transition duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <Target
                    size={18}
                    className="group-hover/btn:rotate-12 transition duration-300"
                  />
                  Place Bid
                  <ArrowRight
                    size={16}
                    className="group-hover/btn:translate-x-1 transition duration-300"
                  />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Balance Card - Premium 3D Style */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-yellow-400/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 overflow-hidden transform group-hover:scale-[1.01] transition duration-300">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full filter blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-md"></div>
                  <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-3 shadow-lg">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Available Balance
                  </p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                      {formatCurrency(user?.balance?.local || 0)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold bg-green-100 px-3 py-1 rounded-full border border-green-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm bg-gray-50/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200">
                <Clock className="w-4 h-4" />
                <span>Last updated: Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats with 3D Hover Effects */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: Target,
              gradient: "from-blue-400 to-indigo-500",
              label: "Today's Bids",
              value: todaySummary?.totalBids || 0,
              shadow: "shadow-blue-500/30",
              border: "hover:border-blue-200",
            },
            {
              icon: Coins,
              gradient: "from-purple-400 to-violet-500",
              label: "Total Amount",
              value: formatCurrency(todaySummary?.totalAmount || 0),
              shadow: "shadow-purple-500/30",
              border: "hover:border-purple-200",
            },
            {
              icon: TrendingUp,
              gradient: "from-green-400 to-emerald-500",
              label: "Active Markets",
              value: activeMarkets?.length || 0,
              shadow: "shadow-green-500/30",
              border: "hover:border-green-200",
            },
            {
              icon: Trophy,
              gradient: "from-amber-400 to-orange-500",
              label: "Today's Wins",
              value: recentWins > 0 ? `+${recentWins}` : "0",
              shadow: "shadow-amber-500/30",
              border: "hover:border-amber-200",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="group relative transform hover:-translate-y-2 transition duration-300"
            >
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition duration-300`}
              ></div>
              <div
                className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5 overflow-hidden hover:${stat.border} transition duration-300`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-gray-50/50 rounded-full -mr-10 -mt-10"></div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow} transform group-hover:scale-110 transition duration-300`}
                  >
                    <stat.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-extrabold text-gray-800 mt-0.5">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Results with Premium Design */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-yellow-400/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <div className="p-6 border-b border-gray-100/50 bg-gradient-to-r from-amber-50/30 to-orange-50/30">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl blur-sm"></div>
                    <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-2.5 shadow-lg">
                      <Calendar size={20} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
                      Today's Results
                      <span className="text-xs font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded-full">
                        Live
                      </span>
                    </h2>
                    <p className="text-gray-500 text-xs">
                      Latest winning numbers from today's games
                    </p>
                  </div>
                </div>
                <Link
                  to="/matka/results"
                  className="group/btn text-amber-600 hover:text-amber-700 text-sm font-bold flex items-center gap-1.5 bg-amber-50/80 backdrop-blur-sm px-4 py-2.5 rounded-xl hover:bg-amber-100/80 transition-all duration-300 border border-amber-200/50 hover:border-amber-300"
                >
                  View All
                  <ArrowRight
                    size={16}
                    className="group-hover/btn:translate-x-1 transition duration-300"
                  />
                </Link>
              </div>
            </div>

            {todayResults?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-amber-50/30">
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Market
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Game Type
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Winning Number
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Payout
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayResults.slice(0, 5).map((result, index) => {
                      const gameTypeDisplay = getGameTypeDisplay(
                        result.gameType,
                      );
                      const gameTypeGradient = getGameTypeGradient(
                        result.gameType,
                      );
                      const GameTypeIcon = getGameTypeIcon(result.gameType);

                      return (
                        <tr
                          key={result._id}
                          className={`border-b border-gray-100/50 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-all duration-300 cursor-pointer group/row transform hover:scale-[1.002] ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                          }`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                              <span className="font-bold text-gray-800">
                                {result.marketName}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r ${gameTypeGradient} text-white shadow-lg transform group-hover/row:scale-105 transition duration-300`}
                            >
                              <GameTypeIcon size={14} />
                              {gameTypeDisplay}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-black rounded-xl text-xl border border-green-200 shadow-lg shadow-green-500/10 transform group-hover/row:scale-105 transition duration-300">
                              <Award className="w-5 h-5 text-green-500" />
                              {result.winningNumber}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-extrabold text-transparent bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text">
                              {formatCurrency(result.totalPayout)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="flex justify-center mb-4">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center animate-float">
                    <Inbox
                      size={56}
                      className="text-amber-500"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                <p className="text-gray-700 font-bold text-xl">
                  No results declared today
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Results will appear here once announced
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links with 3D Hover Effects */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              to: "/matka/markets",
              icon: Target,
              label: "Place Bid",
              sub: "Play now",
              gradient: "from-amber-400 to-orange-500",
              border: "hover:border-amber-200",
            },
            {
              to: "/matka/bids-history",
              icon: List,
              label: "My Bids",
              sub: "View history",
              gradient: "from-purple-400 to-violet-500",
              border: "hover:border-purple-200",
            },
            {
              to: "/matka/results",
              icon: Eye,
              label: "Results",
              sub: "Check winners",
              gradient: "from-green-400 to-emerald-500",
              border: "hover:border-green-200",
            },
          ].map((link, index) => {
            const Icon = link.icon;
            return (
              <Link
                key={index}
                to={link.to}
                className="group relative transform hover:-translate-y-2 transition duration-300"
              >
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${link.gradient} rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition duration-300`}
                ></div>
                <div
                  className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 text-center transition-all duration-300 hover:${link.border}`}
                >
                  <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${link.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <Icon size={28} className="text-white" />
                    </div>
                  </div>
                  <p className="font-extrabold text-gray-700 group-hover:text-amber-600 transition">
                    {link.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{link.sub}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-gray-400 pt-4">
          <span className="inline-flex items-center gap-1">
            <Gem size={12} className="text-amber-400" />
            Premium Matka Dashboard • Stay updated with live results
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default MatkaDashboard;