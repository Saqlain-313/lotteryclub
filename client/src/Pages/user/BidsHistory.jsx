import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getBiddingHistory,
  cancelBid,
  clearBidError,
} from "../../redux/slices/bidSlice";
import {
  History,
  Clock,
  Trophy,
  XCircle,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Coins,
  TrendingUp,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const BidsHistory = () => {
  const dispatch = useDispatch();
  const { bids, loading, pagination, error, message } = useSelector(
    (state) => state.bid
  );
  const [filter, setFilter] = useState({
    status: "",
    page: 1,
    limit: 10,
  });
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    dispatch(getBiddingHistory(filter));
  }, [dispatch, filter]);

  useEffect(() => {
    if (error) {
      setActionMessage({ type: "error", text: error });
      setTimeout(() => {
        setActionMessage("");
        dispatch(clearBidError());
      }, 5000);
    }
    if (message) {
      setActionMessage({ type: "success", text: message });
      setTimeout(() => setActionMessage(""), 3000);
    }
  }, [error, message, dispatch]);

  const handleCancelBid = async (bidId) => {
    if (window.confirm("Are you sure you want to cancel this bid? You will get a full refund.")) {
      await dispatch(cancelBid(bidId));
      dispatch(getBiddingHistory(filter));
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "from-amber-400 to-yellow-500",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        icon: Clock,
        label: "Pending",
        glow: "shadow-amber-500/30",
      },
      won: {
        color: "from-emerald-400 to-green-500",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        icon: Trophy,
        label: "Won",
        glow: "shadow-emerald-500/30",
      },
      lost: {
        color: "from-red-400 to-rose-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: XCircle,
        label: "Lost",
        glow: "shadow-red-500/30",
      },
      cancelled: {
        color: "from-gray-400 to-gray-500",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        icon: AlertCircle,
        label: "Cancelled",
        glow: "shadow-gray-500/30",
      },
    };
    return configs[status] || configs.pending;
  };

  const getGameTypeDisplay = (type) => {
    const display = {
      single: "Single",
      jodi: "Jodi",
      panna: "Panna",
      "half-sangam": "Half-Sangam",
      "full-sangam": "Full-Sangam",
      "last-digit": "Last Digit",
      "first-digit": "First Digit"
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
      "first-digit": "from-pink-400 to-rose-500"
    };
    return gradients[type] || "from-gray-400 to-gray-500";
  };

  const getGameTypeIcon = (type) => {
    const icons = {
      single: "🎯",
      jodi: "🔢",
      panna: "🎲",
      "half-sangam": "🌓",
      "full-sangam": "🌕",
      "last-digit": "🔚",
      "first-digit": "🔛"
    };
    return icons[type] || "⭐";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Calculate statistics
  const totalBids = bids?.length || 0;
  const totalWon = bids?.filter(b => b.status === "won").length || 0;
  const totalPending = bids?.filter(b => b.status === "pending").length || 0;
  const totalAmount = bids?.reduce((sum, b) => sum + b.bidAmount, 0) || 0;
  const totalWinAmount = bids?.reduce((sum, b) => sum + (b.winAmount || 0), 0) || 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-amber-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 px-4 sm:px-6 py-6">
      <div className=" mx-auto space-y-6">
        {/* Header with 3D effect */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 transform group-hover:scale-[1.01] transition duration-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full blur-md"></div>
                  <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-full shadow-lg">
                    <History size={28} className="text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                    Bidding History
                  </h1>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <Sparkles size={14} className="text-amber-400" />
                    {pagination.total || 0} total bids placed
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value, page: 1 })}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition duration-200"
                >
                  <option value="">📊 All Status</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="won">🏆 Won</option>
                  <option value="lost">❌ Lost</option>
                  <option value="cancelled">🚫 Cancelled</option>
                </select>
                <button
                  onClick={() => dispatch(getBiddingHistory(filter))}
                  className="p-2.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  <RefreshCw size={18} className="animate-spin-slow" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {bids?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                icon: Coins, 
                gradient: "from-blue-500 to-indigo-600", 
                label: "Total Bids", 
                value: totalBids,
                shadow: "shadow-blue-500/30"
              },
              { 
                icon: TrendingUp, 
                gradient: "from-green-500 to-emerald-600", 
                label: "Total Invested", 
                value: formatCurrency(totalAmount),
                shadow: "shadow-green-500/30"
              },
              { 
                icon: Trophy, 
                gradient: "from-amber-500 to-orange-600", 
                label: "Total Won", 
                value: formatCurrency(totalWinAmount),
                shadow: "shadow-amber-500/30"
              },
              { 
                icon: BarChart3, 
                gradient: "from-purple-500 to-violet-600", 
                label: "Win Rate", 
                value: totalBids > 0 ? `${Math.round((totalWon / totalBids) * 100)}%` : "0%",
                shadow: "shadow-purple-500/30"
              },
            ].map((stat, index) => (
              <div 
                key={index}
                className="group relative transform hover:-translate-y-1 transition duration-300"
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition duration-300`}></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-gray-50/50 rounded-full -mr-10 -mt-10"></div>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow} transform group-hover:scale-110 transition duration-300`}>
                      <stat.icon size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                      <p className="text-xl font-extrabold text-gray-800 mt-0.5">{stat.value}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Message */}
        {actionMessage && (
          <div className={`relative group transform transition-all duration-500 ${
            actionMessage.type === "success" ? "animate-fade-in" : "animate-shake"
          }`}>
            <div className={`absolute -inset-1 bg-gradient-to-r ${
              actionMessage.type === "success" ? "from-emerald-400/20 to-green-400/20" : "from-red-400/20 to-rose-400/20"
            } rounded-2xl blur-xl`}></div>
            <div className={`relative px-4 py-3 rounded-2xl backdrop-blur-sm border flex items-center gap-2 ${
              actionMessage.type === "success"
                ? "bg-emerald-50/80 border-emerald-200 text-emerald-700"
                : "bg-red-50/80 border-red-200 text-red-700"
            }`}>
              {actionMessage.type === "success" ? "✅" : "⚠️"} {actionMessage.text}
            </div>
          </div>
        )}

        {/* Results Table with 3D effect */}
        {bids?.length > 0 ? (
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-yellow-400/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Transaction</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Market</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Game</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Number</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Win</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    {bids.map((bid, index) => {
                      const statusConfig = getStatusConfig(bid.status);
                      const StatusIcon = statusConfig.icon;
                      const gameTypeDisplay = getGameTypeDisplay(bid.gameType);
                      const gameTypeGradient = getGameTypeGradient(bid.gameType);
                      const gameTypeIcon = getGameTypeIcon(bid.gameType);
                      
                      return (
                        <tr 
                          key={bid._id} 
                          className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-all duration-300 group/row transform hover:scale-[1.002]"
                        >
                          <td className="px-4 py-3.5">
                            <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                              {bid.transactionId?.slice(0, 12)}...
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="inline-block px-3 py-1 text-xs font-bold text-white rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg transform group-hover/row:scale-105 transition duration-300">
                              {bid.marketId?.name || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full shadow-lg transform group-hover/row:scale-105 transition duration-300 bg-gradient-to-r ${gameTypeGradient} text-white`}>
                              {gameTypeIcon} {gameTypeDisplay}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="inline-block text-lg font-black text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text transform group-hover/row:scale-110 transition duration-300">
                              {bid.number}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-sm font-bold text-gray-700">
                            {formatCurrency(bid.bidAmount)}
                          </td>
                          <td className="px-4 py-3.5">
                            {bid.winAmount > 0 ? (
                              <span className="inline-block text-sm font-extrabold text-transparent bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text transform group-hover/row:scale-105 transition duration-300">
                                +{formatCurrency(bid.winAmount)}
                              </span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r ${statusConfig.color} text-white shadow-lg ${statusConfig.glow} transform group-hover/row:scale-105 transition duration-300`}>
                              <StatusIcon size={14} />
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            {bid.status === "pending" && (
                              <button
                                onClick={() => handleCancelBid(bid._id)}
                                className="px-4 py-1.5 bg-gradient-to-r from-red-400 to-rose-500 text-white text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
                              >
                                Cancel
                              </button>
                            )}
                            {bid.status === "won" && (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-sm">
                                <Trophy size={14} className="text-amber-400" />
                                {formatCurrency(bid.winAmount)}
                              </span>
                            )}
                            {bid.status === "lost" && (
                              <span className="text-red-400 text-sm font-semibold">Lost</span>
                            )}
                            {bid.status === "cancelled" && (
                              <span className="text-gray-400 text-sm font-semibold">Refunded</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-gray-100/50 bg-gradient-to-r from-amber-50/30 to-orange-50/30">
                <span className="text-sm text-gray-600 font-medium">
                  Showing <span className="font-bold text-amber-600">{bids.length}</span> of <span className="font-bold text-amber-600">{pagination.total}</span> bids
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter({ ...filter, page: Math.max(1, filter.page - 1) })}
                    disabled={filter.page === 1}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <span className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-500/30">
                    {filter.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setFilter({ ...filter, page: Math.min(pagination.pages, filter.page + 1) })}
                    disabled={filter.page === pagination.pages}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-16 text-center">
              <div className="text-7xl mb-4 animate-float">📭</div>
              <p className="text-gray-600 text-xl font-semibold">No bids found</p>
              <p className="text-gray-400 text-sm mt-1">
                Start placing bids on active markets
              </p>
              <Link
                to="/matka/markets"
                className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
              >
                Browse Markets <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default BidsHistory;