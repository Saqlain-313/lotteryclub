import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  Crown,
  Dice5,
  Gamepad2,
  Gift,
  Lock,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserPlus,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  claimDailyBonus,
  clearDailyClaimError,
  getDailyClaimStatus,
  resetClaimSuccess,
} from "../redux/Slices/dailyClaimSlice";

const defaultRewards = {
  1: 10,
  2: 15,
  3: 20,
  4: 25,
  5: 30,
  6: 35,
  7: 50,
};

// =======================
// IST Helpers
// =======================
const getISTDateString = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(date);

const getNextISTMidnight = () => {
  const nowIST = getISTDateString();
  const [y, m, d] = nowIST.split("-").map(Number);
  return new Date(
    `${y}-${String(m).padStart(2, "0")}-${String(d + 1).padStart(2, "0")}T00:00:00+05:30`,
  );
};

// Golden text style
const goldenTextStyle = {
  background: "linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #F59E0B 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

// =======================
// RewardCard Component with Image
// =======================
const RewardCard = ({ title, subtitle, button, bg, image, icon: Icon }) => {
  return (
    <div
      className={`bg-gradient-to-br rounded-2xl p-5 mb-4 shadow-lg relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-200 min-h-[200px]`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30"></div>

      {/* Glow Effect */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col min-h-[160px] justify-between">
        <div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/30 to-amber-500/30 backdrop-blur-sm rounded-lg px-3 py-1 inline-block mb-3 border border-yellow-400/20">
            {Icon && <Icon className="w-4 h-4 text-yellow-400" />}
            <span className="text-white text-xs font-bold tracking-wider">
              HOT OFFER
            </span>
          </div>
          <h3 className="text-white text-xl font-bold tracking-tight">
            {title}
          </h3>
          <p className="text-white/80 text-sm mt-1">{subtitle}</p>
        </div>
        <button className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 transition-all text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl mt-3 self-start text-sm flex items-center gap-2">
          {button}
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// =======================
// Main Activity Component
// =======================
const Activity = () => {
  const dispatch = useDispatch();
  const [showError, setShowError] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState("");
  const [istCurrentDate, setIstCurrentDate] = useState(getISTDateString);
  const [hoveredDay, setHoveredDay] = useState(null);

  const {
    loading,
    claimLoading,
    currentDay,
    claimedDay,
    claimSuccess,
    canClaim,
    rewards,
    error,
    lastClaimDate,
    lastClaimDateIST,
    totalCredit,
    reward,
  } = useSelector((state) => state.dailyClaim);

  // Countdown ticker
  const updateTimeRemaining = useCallback(() => {
    const now = new Date();
    const midnight = getNextISTMidnight();
    const diff = midnight.getTime() - now.getTime();

    if (diff > 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`);
    } else {
      setTimeUntilReset("New day available!");
    }
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      await dispatch(getDailyClaimStatus()).unwrap();
    } catch (err) {
      console.error("Failed to fetch status:", err);
    }
  }, [dispatch]);

  // Lifecycle effects
  useEffect(() => {
    fetchStatus();
    updateTimeRemaining();
  }, [fetchStatus, updateTimeRemaining]);

  useEffect(() => {
    const id = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(id);
  }, [updateTimeRemaining]);

  useEffect(() => {
    const id = setInterval(() => {
      setIstCurrentDate((prev) => {
        const today = getISTDateString();
        if (today !== prev) {
          fetchStatus();
          return today;
        }
        return prev;
      });
    }, 60000);
    return () => clearInterval(id);
  }, [fetchStatus]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const id = setTimeout(() => {
        setShowError(false);
        dispatch(clearDailyClaimError());
      }, 5000);
      return () => clearTimeout(id);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (claimSuccess) {
      const id = setTimeout(() => dispatch(resetClaimSuccess()), 3000);
      return () => clearTimeout(id);
    }
  }, [claimSuccess, dispatch]);

  const handleClaim = async () => {
    if (!canClaim) return;
    try {
      await dispatch(claimDailyBonus()).unwrap();
    } catch (err) {
      console.error("Claim failed:", err);
    }
  };

  const handleRefresh = () => {
    fetchStatus();
    setIstCurrentDate(getISTDateString());
    updateTimeRemaining();
  };

  const rewardData =
    rewards && Object.keys(rewards).length > 0 ? rewards : defaultRewards;
  const rewardList = Object.entries(rewardData)
    .map(([day, amount]) => ({ day: Number(day), amount }))
    .sort((a, b) => a.day - b.day);

  // Loading state with shimmer effect
  if (loading && !canClaim) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg px-5 py-4 mb-6 border border-amber-200/40">
            <h1 className="text-2xl font-bold text-center text-gray-800 tracking-tight flex items-center justify-center gap-2">
              <Gamepad2 className="w-6 h-6 text-amber-500" />
              Activity
            </h1>
          </div>
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl shadow-2xl p-8 max-w-md mx-auto border-2 border-amber-200">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent animate-shimmer"></div>
            <div className="relative z-10 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 font-medium">
                Loading daily rewards...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-white py-6">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Main Grid - Desktop: 2 columns, Mobile: 1 column - Full width */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Daily Claim Component */}
            <div className="relative bg-gradient-to-br from-white via-amber-50/30 to-white rounded-3xl shadow-2xl sm:p-6 border-2 border-amber-200/40 overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

              {/* Header Section */}
              <div className="bg-white/80 backdrop-blur-sm border-2 border-amber-200/40 rounded-2xl p-4 md:p-6 shadow-lg relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-200/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-200/20 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full blur-md opacity-40 animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-amber-500 to-yellow-500 p-2.5 rounded-xl shadow-lg">
                          <Gift className="text-white" size={20} />
                        </div>
                      </div>
                      <div>
                        <h3
                          className="text-lg md:text-xl font-black tracking-tight"
                          style={goldenTextStyle}
                        >
                          Daily Loyalty Reward
                        </h3>
                        <p className="text-gray-500 text-xs font-medium flex items-center gap-1">
                          <Sparkles size={12} className="text-yellow-500" />
                          Claim daily for 7 days
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRefresh}
                      disabled={loading || claimLoading}
                      className="p-2 hover:bg-amber-50/80 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-180 border-2 border-amber-200/50"
                      title="Refresh Status"
                    >
                      <RefreshCw
                        size={18}
                        className={`${loading ? "animate-spin" : ""} text-amber-600`}
                      />
                    </button>
                  </div>

                  {/* Stats Cards - Grid responsive */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                    {totalCredit && Number(totalCredit) > 0 && (
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border-2 border-amber-200/50 shadow-sm">
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <Wallet size={12} className="text-amber-500" />
                          Total Credits
                        </p>
                        <p className="text-xl font-bold text-amber-600">
                          ₹{totalCredit}
                        </p>
                      </div>
                    )}
                    {currentDay && (
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border-2 border-amber-200/50 shadow-sm">
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <Calendar size={12} className="text-amber-500" />
                          Current Day
                        </p>
                        <p className="text-xl font-bold text-gray-800">
                          Day {currentDay}/7
                        </p>
                      </div>
                    )}
                    {claimedDay && (
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border-2 border-green-200/50 shadow-sm">
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <CheckCircle size={12} className="text-green-500" />
                          Last Claimed
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          Day {claimedDay}
                        </p>
                      </div>
                    )}
                    {reward && claimSuccess && (
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border-2 border-amber-200/50 shadow-sm">
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <Zap size={12} className="text-yellow-500" />
                          Reward Earned
                        </p>
                        <p className="text-xl font-bold text-yellow-600">
                          ₹{reward}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Last Claim */}
                  {lastClaimDate && (
                    <div className="mt-3 text-center">
                      <span className="text-xs text-gray-400 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200/50 flex items-center gap-1 justify-center">
                        <Clock size={12} />
                        Last Claimed:{" "}
                        {lastClaimDateIST
                          ? lastClaimDateIST
                          : new Date(lastClaimDate).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                      </span>
                    </div>
                  )}

                  {/* Success Banner */}
                  {claimSuccess && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-green-400/20 border-2 border-green-400/30 rounded-2xl backdrop-blur-sm animate-slideDown">
                      <div className="flex items-center justify-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-bounce">
                          <Zap size={20} className="text-white" />
                        </div>
                        <p className="font-bold text-green-700">
                          Success! You claimed ₹{reward} for Day {claimedDay}!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error Banner */}
                  {showError && error && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-red-400/20 via-red-500/20 to-red-400/20 border-2 border-red-400/30 rounded-2xl backdrop-blur-sm animate-shake">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <AlertCircle
                            size={20}
                            className="text-red-500 flex-shrink-0"
                          />
                          <p className="text-red-700 font-medium">{error}</p>
                        </div>
                        <button
                          onClick={() => {
                            setShowError(false);
                            dispatch(clearDailyClaimError());
                          }}
                          className="text-red-700 font-bold hover:bg-red-100/50 p-1 px-3 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Days Grid */}
                  <div className="mt-5">
                    <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                      {rewardList.map((item) => {
                        const isCompleted = item.day < currentDay;
                        const isCurrent = item.day === currentDay && canClaim;
                        const isLocked =
                          item.day > currentDay ||
                          (item.day === currentDay && !canClaim);

                        return (
                          <div
                            key={item.day}
                            className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
                              isCompleted
                                ? "bg-gradient-to-b from-green-400 to-green-500 border-2 border-green-600 shadow-lg"
                                : isCurrent
                                  ? "bg-gradient-to-b from-amber-400 to-yellow-500 border-2 border-amber-600 shadow-lg ring-2 ring-amber-300/50 animate-pulse"
                                  : "bg-white/60 backdrop-blur-sm border-2 border-gray-200 opacity-60"
                            }`}
                          >
                            {isCompleted ? (
                              <>
                                <CheckCircle className="text-white" size={16} />
                                <span className="text-[8px] md:text-[10px] font-bold text-white mt-0.5">
                                  DAY {item.day}
                                </span>
                              </>
                            ) : isCurrent ? (
                              <>
                                <span className="text-[8px] md:text-[10px] font-bold text-white">
                                  DAY {item.day}
                                </span>
                                <span className="text-[10px] md:text-xs font-black text-white">
                                  ₹{item.amount}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-[8px] md:text-[10px] font-bold text-gray-400">
                                  DAY {item.day}
                                </span>
                                <Lock className="text-gray-400" size={14} />
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Claim Button */}
                  <button
                    onClick={handleClaim}
                    disabled={!canClaim || claimLoading}
                    className={`mt-4 md:mt-6 w-full font-bold py-2.5 md:py-3 rounded-xl transition-all duration-300 shadow-lg text-sm md:text-base flex items-center justify-center gap-2 ${
                      canClaim && !claimLoading
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {claimLoading ? (
                      <>
                        <span className="animate-spin">
                          <RotateCcw size={18} />
                        </span>
                        Claiming...
                      </>
                    ) : canClaim ? (
                      <>
                        <Gift size={18} />
                        Claim Reward
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        Already Claimed
                      </>
                    )}
                  </button>

                  {/* Footer Info */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> Daily reset at 12:00 AM IST
                    </span>
                    {!canClaim && !loading && (
                      <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                        <Clock size={12} /> {timeUntilReset}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-amber-600">
                      <Gift size={12} /> ₹
                      {rewardList.reduce(
                        (sum, r) => sum + (r.day < currentDay ? r.amount : 0),
                        0,
                      )}{" "}
                      claimed
                    </span>
                  </div>

                  {/* Progress Section */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] font-medium text-gray-500 mb-1">
                      <span>Progress</span>
                      <span className="text-amber-600 font-bold">
                        {Math.min(currentDay - 1, 7)}/7 Days
                      </span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-200/50 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${((currentDay - 1) / 7) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Progress */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border-2 border-amber-200/40 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    Experience Progress
                  </h3>
                  <p className="text-sm font-semibold text-gray-500">
                    3,450 XP until Diamond Tier
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-amber-600 flex items-center gap-1">
                    <Crown className="w-6 h-6 text-amber-500" />
                    LVL 42
                  </span>
                </div>
              </div>
              <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-full"
                  style={{ width: "72%" }}
                ></div>
                <div className="absolute top-0 left-[72%] h-full w-0.5 bg-white shadow-[0_0_10px_white]"></div>
              </div>
              <div className="mt-3 flex justify-between text-xs font-semibold text-gray-500">
                <span>Platinum Tier III</span>
                <span>72% Completed</span>
                <span>Diamond Tier I</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Daily Missions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-500" />
                  Daily Missions
                </h3>
                <button className="text-amber-600 text-sm font-semibold flex items-center gap-1 hover:underline">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mission 1 */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 mb-4 border-2 border-amber-200/40 shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="w-14 h-14 relative flex items-center justify-center shrink-0">
                  <svg className="absolute inset-0 w-14 h-14 -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="6"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="6"
                      strokeDasharray="150.8"
                      strokeDashoffset="37.7"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-1.5 bg-white rounded-full flex items-center justify-center">
                    <Gamepad2
                      className="w-6 h-6 text-amber-600"
                      fill="currentColor"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <h4 className="font-bold text-gray-800 group-hover:text-amber-600 transition-colors">
                    Play 5 Live Casino Games
                  </h4>
                  <p className="text-sm text-gray-500">
                    Wager on any live table to complete this mission.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 ml-auto">
                  <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
                    <Star
                      className="w-4 h-4 text-amber-600"
                      fill="currentColor"
                    />
                    <span className="text-sm font-semibold text-amber-600 whitespace-nowrap">
                      +500 XP
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                    3 / 5
                  </span>
                </div>
              </div>

              {/* Mission 2 */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 mb-4 border-2 border-green-200/40 shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow cursor-pointer group opacity-90">
                <div className="w-14 h-14 relative flex items-center justify-center shrink-0">
                  <svg className="absolute inset-0 w-14 h-14 -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="6"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="6"
                      strokeDasharray="150.8"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-1.5 bg-white rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <h4 className="font-bold text-gray-800">
                    Daily Deposit Bonus
                  </h4>
                  <p className="text-sm text-gray-500">
                    Add funds to your wallet for a 5% bonus today.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 ml-auto">
                  <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle size={14} />
                    Completed
                  </div>
                  <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                    Claimed
                  </span>
                </div>
              </div>

              {/* Mission 3 */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-amber-200/40 shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="w-14 h-14 relative flex items-center justify-center shrink-0">
                  <svg className="absolute inset-0 w-14 h-14 -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="6"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="6"
                      strokeDasharray="150.8"
                      strokeDashoffset="113.1"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-1.5 bg-white rounded-full flex items-center justify-center">
                    <UserPlus
                      className="w-6 h-6 text-amber-600"
                      fill="currentColor"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <h4 className="font-bold text-gray-800 group-hover:text-amber-600 transition-colors">
                    Invite 2 Friends
                  </h4>
                  <p className="text-sm text-gray-500">
                    Get exclusive vouchers for every successful referral.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 ml-auto">
                  <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
                    <Gift className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-600 whitespace-nowrap">
                      2 Vouchers
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                    0 / 2
                  </span>
                </div>
              </div>
            </div>

            {/* Reward Cards with Images */}
            <RewardCard
              title="FIRST RECHARGE BONUS"
              subtitle="Recharge for the first time and get extra bonus!"
              button="Recharge Now"
              image="https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=600"
              icon={CreditCard}
            />

            <RewardCard
              title="REFER & EARN"
              subtitle="Invite your friends and earn unlimited rewards."
              button="Refer Now"
              image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600"
              icon={UserPlus}
            />

            <RewardCard
              title="PLAY & BIG WIN"
              subtitle="Play your favorite games and win exciting prizes."
              button="Play Now"
              image="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600"
              icon={Dice5}
            />
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-4px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(4px);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Activity;
