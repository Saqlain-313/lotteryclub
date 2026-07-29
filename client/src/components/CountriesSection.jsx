import React, { useEffect, useState, useCallback } from "react";
import {
  Globe, Gift, RefreshCw, AlertCircle, Calendar, Sparkles,
  Clock, Shield, Award, Zap, CheckCircle, Lock, MapPin
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDailyClaimStatus,
  claimDailyBonus,
  clearDailyClaimError,
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

const countries = [
  {
    name: "India",
    flag: "https://flagcdn.com/w80/in.png",
    code: "IN",
  },
  {
    name: "Australia",
    flag: "https://flagcdn.com/w80/au.png",
    code: "AU",
  },
  {
    name: "Pakistan",
    flag: "https://flagcdn.com/w80/pk.png",
    code: "PK",
  },
  {
    name: "Bangladesh",
    flag: "https://flagcdn.com/w80/bd.png",
    code: "BD",
  },
  {
    name: "Nepal",
    flag: "https://flagcdn.com/w80/np.png",
    code: "NP",
  },
  {
    name: "Dubai (UAE)",
    flag: "https://flagcdn.com/w80/ae.png",
    code: "AE",
  },
];

// =======================
// IST Helpers
// =======================
const getISTDateString = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(date);

const getNextISTMidnight = () => {
  const nowIST = getISTDateString();
  const [y, m, d] = nowIST.split("-").map(Number);
  return new Date(`${y}-${String(m).padStart(2, "0")}-${String(d + 1).padStart(2, "0")}T00:00:00+05:30`);
};

const CountriesAndDailyClaim = () => {
  const dispatch = useDispatch();
  const [showError, setShowError] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState("");
  const [istCurrentDate, setIstCurrentDate] = useState(getISTDateString);

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

  const goldenTextStyle = {
    background: "linear-gradient(135deg, #7b5800 0%, #fdba12 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

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
      console.error("❌ Claim failed:", err);
    }
  };

  const handleRefresh = () => {
    fetchStatus();
    setIstCurrentDate(getISTDateString());
    updateTimeRemaining();
  };

  const rewardData = rewards && Object.keys(rewards).length > 0 ? rewards : defaultRewards;
  const rewardList = Object.entries(rewardData)
    .map(([day, amount]) => ({ day: Number(day), amount }))
    .sort((a, b) => a.day - b.day);

  return (
    <section className="bg-surface px-3 md:px-6 py-6 md:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Participating Countries - WINZOX Style */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-4 md:p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-yellow-400 rounded-full blur-md opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-xl shadow-lg">
                <Globe className="text-white" size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black tracking-tight" style={goldenTextStyle}>
                Participating Countries
              </h3>
              <p className="text-gray-500 text-xs font-medium">Global lottery access</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6 justify-center items-center">
            {countries.map((country) => (
              <div
                key={country.name}
                className="group flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 hover:scale-110"
              >
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 blur-md"></div>
                  <img
                    src={country.flag}
                    alt={country.name}
                    className="relative w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-gray-200 group-hover:border-yellow-400 object-cover shadow-md group-hover:shadow-lg transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-sm">
                    {country.code}
                  </div>
                </div>
                <span className="text-[10px] md:text-xs font-medium text-gray-600 group-hover:text-yellow-600 transition-colors duration-300">
                  {country.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="text-yellow-500" size={14} />
              <span className="text-xs text-gray-500 font-medium">
                {countries.length} Countries Supported
              </span>
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-200">
              <CheckCircle className="text-green-500" size={12} />
              <span className="text-[10px] font-bold text-green-600">Active</span>
            </div>
          </div>
        </div>

        {/* Daily Loyalty Reward - WINZOX Style with Reducer */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-4 md:p-6 shadow-lg relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-yellow-400 rounded-full blur-md opacity-30 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-xl shadow-lg">
                    <Gift className="text-white" size={20} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black tracking-tight" style={goldenTextStyle}>
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
                className="p-2 hover:bg-yellow-50/80 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-180 border border-yellow-200/50"
                title="Refresh Status"
              >
                <RefreshCw size={18} className={`${loading ? "animate-spin" : ""} text-yellow-600`} />
              </button>
            </div>

            {/* Stats Cards */}


            {/* Last Claim */}

            {/* Success Banner */}
            {claimSuccess && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-green-400/20 border border-green-400/30 rounded-2xl backdrop-blur-sm animate-slideDown">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 bg-green-500 rounded-full animate-bounce">
                    <Zap size={20} className="text-white" />
                  </div>
                  <p className="font-bold text-green-700">
                    🎉 Success! You claimed ₹{reward} for Day {claimedDay}!
                  </p>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {showError && error && (
              <div className="mt-4 p-4 bg-gradient-to-r from-red-400/20 via-red-500/20 to-red-400/20 border border-red-400/30 rounded-2xl backdrop-blur-sm animate-shake">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowError(false);
                      dispatch(clearDailyClaimError());
                    }}
                    className="text-red-700 font-bold hover:bg-red-100/50 p-1 px-3 rounded-lg transition-colors"
                  >
                    ×
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
                  const isLocked = item.day > currentDay || (item.day === currentDay && !canClaim);

                  return (
                    <div
                      key={item.day}
                      className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${isCompleted
                          ? "bg-gradient-to-b from-green-400 to-green-500 border-2 border-green-600 shadow-lg"
                          : isCurrent
                            ? "bg-gradient-to-b from-yellow-400 to-yellow-500 border-2 border-yellow-600 shadow-lg ring-2 ring-yellow-300/50 animate-pulse"
                            : "bg-white/60 backdrop-blur-sm border-2 border-gray-200 opacity-60"
                        }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="text-white" size={16} />
                          <span className="text-[8px] md:text-[10px] font-bold text-white mt-0.5">DAY {item.day}</span>
                        </>
                      ) : isCurrent ? (
                        <>
                          <span className="text-[8px] md:text-[10px] font-bold text-white">DAY {item.day}</span>
                          <span className="text-[10px] md:text-xs font-black text-white">₹{item.amount}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[8px] md:text-[10px] font-bold text-gray-400">DAY {item.day}</span>
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
              className={`mt-4 md:mt-6 w-full font-bold py-2.5 md:py-3 rounded-xl transition-all duration-300 shadow-lg text-sm md:text-base ${canClaim && !claimLoading
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {claimLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚡</span>
                  Claiming...
                </span>
              ) : canClaim ? (
                "Claim Reward"
              ) : (
                "Already Claimed"
              )}
            </button>



          </div>
        </div>
      </div>

      <style>{`
        .bg-surface {
          background-color: #f7f9fb;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default CountriesAndDailyClaim;