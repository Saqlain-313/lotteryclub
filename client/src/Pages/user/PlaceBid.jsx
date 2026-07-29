import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  getMarketById,
  clearCurrentMarket,
} from "../../redux/slices/marketSlice";
import { placeBid, clearBidError } from "../../redux/slices/bidSlice";
import {
  ArrowLeft,
  Info,
  TrendingUp,
  Wallet,
  Shield,
  Clock,
  Sparkles,
  Award,
  Zap,
  Coins,
  ChevronRight,
  Crown,
} from "lucide-react";

const PlaceBid = () => {
  const { marketId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentMarket, loading: marketLoading } = useSelector(
    (state) => state.market
  );
  const { user } = useSelector((state) => state.auth);
  const { loading: bidLoading, error, message } = useSelector(
    (state) => state.bid
  );

  const { gameType: autoGameType } = location.state || {};

  const [formData, setFormData] = useState({
    number: "",
    bidAmount: "",
    gameType: autoGameType || "",
  });
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  useEffect(() => {
    dispatch(getMarketById(marketId));
    return () => {
      dispatch(clearCurrentMarket());
      dispatch(clearBidError());
    };
  }, [dispatch, marketId]);

  useEffect(() => {
    if (autoGameType) {
      setFormData(prev => ({
        ...prev,
        gameType: autoGameType
      }));
    }
  }, [autoGameType]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      setTimeout(() => {
        setLocalError("");
        dispatch(clearBidError());
      }, 5000);
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccess("");

    if (!formData.gameType) {
      setLocalError("Please select a game type");
      return;
    }
    if (!formData.number.trim()) {
      setLocalError("Please enter a number");
      return;
    }
    if (!formData.bidAmount || parseFloat(formData.bidAmount) <= 0) {
      setLocalError("Please enter a valid bid amount");
      return;
    }

    const numberValidation = validateNumber(formData.number.trim(), formData.gameType);
    if (!numberValidation.isValid) {
      setLocalError(numberValidation.message);
      return;
    }

    const bidAmount = parseFloat(formData.bidAmount);
    if (bidAmount < currentMarket?.minBid) {
      setLocalError(`Minimum bid amount is ₹${currentMarket?.minBid}`);
      return;
    }
    if (bidAmount > currentMarket?.maxBid) {
      setLocalError(`Maximum bid amount is ₹${currentMarket?.maxBid}`);
      return;
    }
    if (bidAmount > user?.balance.local) {
      setLocalError(`Insufficient balance. Available: ₹${user?.balance.local}`);
      return;
    }

    const result = await dispatch(
      placeBid({
        marketId,
        gameType: formData.gameType,
        number: formData.number.trim(),
        bidAmount: bidAmount,
      })
    );

    if (result.payload?.success) {
      setSuccess(result.payload.message);
      setShowSuccessAnimation(true);
      setFormData({
        number: "",
        bidAmount: "",
        gameType: "",
      });
      setTimeout(() => {
        navigate("/matka/bids-history");
      }, 2500);
    }
  };

  const gameTypes = [
    "single",
    "jodi",
    "panna",
    "half-sangam",
    "full-sangam",
    "last-digit",
    "first-digit"
  ];

  const validateNumber = (number, gameType) => {
    const str = String(number).trim();
    const num = parseInt(str);

    switch (gameType) {
      case "single":
        if (str.length !== 1 || isNaN(num) || num < 0 || num > 9) {
          return { isValid: false, message: "Single must be a single digit (0-9)" };
        }
        break;
      case "jodi":
        if (str.length !== 2 || isNaN(num) || num < 0 || num > 99) {
          return { isValid: false, message: "Jodi must be a 2-digit number (00-99)" };
        }
        break;
      case "panna":
        if (str.length !== 3 || isNaN(num) || num < 0 || num > 999) {
          return { isValid: false, message: "Panna must be a 3-digit number (000-999)" };
        }
        break;
      case "half-sangam":
        if (!/^(\d{1}|\d{3})$/.test(str)) {
          return { isValid: false, message: "Half-Sangam must be 1-digit or 3-digit number" };
        }
        break;
      case "full-sangam":
        if (str.length !== 2 || isNaN(num) || num < 0 || num > 99) {
          return { isValid: false, message: "Full-Sangam must be a 2-digit number (00-99)" };
        }
        break;
      case "last-digit":
        if (str.length !== 2 || isNaN(num) || num < 0 || num > 99) {
          return { isValid: false, message: "Last Digit must be a 2-digit number (00-99)" };
        }
        break;
      case "first-digit":
        if (str.length !== 2 || isNaN(num) || num < 0 || num > 99) {
          return { isValid: false, message: "First Digit must be a 2-digit number (00-99)" };
        }
        break;
      default:
        return { isValid: false, message: "Invalid game type" };
    }
    return { isValid: true, message: "" };
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

  const getNumberPlaceholder = (gameType) => {
    const placeholders = {
      single: "Enter a single digit (0-9)",
      jodi: "Enter a 2-digit number (00-99)",
      panna: "Enter a 3-digit number (000-999)",
      "half-sangam": "Enter 1-digit or 3-digit number",
      "full-sangam": "Enter a 2-digit number (00-99)",
      "last-digit": "Enter a 2-digit number (00-99)",
      "first-digit": "Enter a 2-digit number (00-99)"
    };
    return placeholders[gameType] || "Enter your number";
  };

  const getNumberHint = (gameType) => {
    const hints = {
      single: "Single digit (0-9)",
      jodi: "Two digits (00-99)",
      panna: "Three digits (000-999)",
      "half-sangam": "1-digit or 3-digit",
      "full-sangam": "Two digits (00-99)",
      "last-digit": "Two digits (00-99) - Last digit will be checked",
      "first-digit": "Two digits (00-99) - First digit will be checked"
    };
    return hints[gameType] || "";
  };

  const calculateWinAmount = () => {
    if (!formData.bidAmount || !formData.gameType) return 0;
    const amount = parseFloat(formData.bidAmount);
    const multipliers = {
      single: 9,
      jodi: 90,
      panna: 90,
      "half-sangam": 450,
      "full-sangam": 900,
      "last-digit": 9,
      "first-digit": 9
    };
    return amount * (multipliers[formData.gameType] || 9);
  };

  const getMultiplierDisplay = (gameType) => {
    const multipliers = {
      single: "9x",
      jodi: "90x",
      panna: "90x",
      "half-sangam": "450x",
      "full-sangam": "900x",
      "last-digit": "9x",
      "first-digit": "9x"
    };
    return multipliers[gameType] || "9x";
  };

  const getWinDescription = (gameType) => {
    const descriptions = {
      single: "Match the exact single digit",
      jodi: "Match the exact two-digit number",
      panna: "Match the exact three-digit number",
      "half-sangam": "Match 1-digit or 3-digit combination",
      "full-sangam": "Match the exact two-digit number",
      "last-digit": "Match the last digit of winning number",
      "first-digit": "Match the first digit of winning number"
    };
    return descriptions[gameType] || "Match the winning number";
  };

  if (marketLoading) {
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

  if (!currentMarket) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-12 text-center">
            <div className="text-7xl mb-4 animate-float">🔍</div>
            <p className="text-gray-600 text-xl font-semibold">Market not found</p>
            <button
              onClick={() => navigate("/matka/markets")}
              className="mt-4 inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
            >
              ← Back to Markets
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 px-4 sm:px-6 py-6">
      <div className=" mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/matka/markets")}
          className="group flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:translate-x-[-4px]"
        >
          <ArrowLeft size={18} className="group-hover:scale-110 transition-transform" />
          <span className="font-medium">Back to Markets</span>
        </button>

        {/* Main Card */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 transform group-hover:scale-[1.01] transition duration-300">
            
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                    {currentMarket.name}
                  </h1>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <Sparkles size={14} className="text-amber-400" />
                    ID: {currentMarket.marketId}
                  </p>
                </div>
                {autoGameType && (
                  <div className="animate-pulse bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/30 flex items-center gap-2">
                    <Zap size={14} />
                    Auto-selected
                  </div>
                )}
              </div>
              {autoGameType && (
                <div className="mt-2 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-sm font-medium text-amber-800">
                    {getGameTypeIcon(autoGameType)} {getGameTypeDisplay(autoGameType)}
                  </span>
                </div>
              )}
            </div>

            {/* Market Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-xl p-3 border border-amber-100/50">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Game Type</p>
                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-bold rounded-lg bg-gradient-to-r ${getGameTypeGradient(currentMarket.gameType)} text-white shadow-lg`}>
                  {getGameTypeDisplay(currentMarket.gameType)}
                </span>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl p-3 border border-blue-100/50">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Bid Range</p>
                <p className="font-bold text-gray-800 mt-1">₹{currentMarket.minBid} - ₹{currentMarket.maxBid}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-xl p-3 border border-green-100/50">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Open Time</p>
                <p className="font-bold text-gray-800 mt-1 flex items-center gap-1">
                  <Clock size={14} className="text-green-500" /> {currentMarket.openTime}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-rose-50/50 rounded-xl p-3 border border-red-100/50">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Close Time</p>
                <p className="font-bold text-gray-800 mt-1 flex items-center gap-1">
                  <Clock size={14} className="text-red-500" /> {currentMarket.closeTime}
                </p>
              </div>
            </div>

            {/* Balance */}
            <div className="relative group/balance mb-6">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl blur opacity-20 group-hover/balance:opacity-40 transition duration-300"></div>
              <div className="relative bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 flex justify-between items-center border border-green-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Wallet size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Available Balance</p>
                    <p className="text-2xl font-extrabold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                      ₹{user?.balance.local?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
                <Shield size={28} className="text-green-600/30" />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Game Type Select */}
                <div>
                  <label className="block text-gray-700 font-bold mb-1.5 flex items-center gap-2">
                    <Award size={16} className="text-amber-500" />
                    Game Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="gameType"
                      value={formData.gameType}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white/50 backdrop-blur-sm appearance-none transition duration-200 ${
                        autoGameType && formData.gameType === autoGameType
                          ? 'border-amber-400 bg-amber-50/50 shadow-lg shadow-amber-500/10'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                      required
                    >
                      <option value="">🎮 Select Game Type</option>
                      {gameTypes.map((type) => (
                        <option key={type} value={type}>
                          {getGameTypeIcon(type)} {getGameTypeDisplay(type)}
                          {autoGameType === type && " ★"}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronRight size={18} className={`text-gray-400 transition-transform ${formData.gameType ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  {autoGameType && formData.gameType === autoGameType && (
                    <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1.5">
                      <Sparkles size={12} />
                      Game type automatically selected from market
                    </p>
                  )}
                </div>

                {/* Number Input */}
                <div>
                  <label className="block text-gray-700 font-bold mb-1.5 flex items-center gap-2">
                    <Coins size={16} className="text-amber-500" />
                    Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    placeholder={getNumberPlaceholder(formData.gameType)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white/50 backdrop-blur-sm transition duration-200 hover:border-amber-300 text-lg font-mono"
                    required
                  />
                  {formData.gameType && (
                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                      <Info size={12} />
                      Format: {getNumberHint(formData.gameType)}
                    </p>
                  )}
                </div>

                {/* Bid Amount */}
                <div>
                  <label className="block text-gray-700 font-bold mb-1.5 flex items-center gap-2">
                    <TrendingUp size={16} className="text-amber-500" />
                    Bid Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="bidAmount"
                    value={formData.bidAmount}
                    onChange={handleChange}
                    placeholder={`₹${currentMarket.minBid} - ₹${currentMarket.maxBid}`}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white/50 backdrop-blur-sm transition duration-200 hover:border-amber-300 text-lg font-semibold"
                    min={currentMarket.minBid}
                    max={currentMarket.maxBid}
                    required
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          bidAmount: currentMarket.minBid.toString(),
                        })
                      }
                      className="text-xs px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium"
                    >
                      Min
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          bidAmount: currentMarket.maxBid.toString(),
                        })
                      }
                      className="text-xs px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium"
                    >
                      Max
                    </button>
                  </div>
                </div>

                {/* Win Info */}
                {formData.bidAmount && formData.gameType && (
                  <div className="relative group/win">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-xl blur opacity-20 group-hover/win:opacity-40 transition duration-300"></div>
                    <div className="relative bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200/50">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
                          <Crown size={18} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Potential Win:</span>
                            <span className="text-2xl font-extrabold text-transparent bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text">
                              ₹{calculateWinAmount()}
                            </span>
                            <span className="text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white px-2 py-0.5 rounded-full">
                              {getMultiplierDisplay(formData.gameType)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Info size={12} />
                            {getWinDescription(formData.gameType)}
                          </p>
                          {(formData.gameType === "last-digit" || formData.gameType === "first-digit") && (
                            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                              <Zap size={12} />
                              {formData.gameType === "last-digit" 
                                ? "Your bid wins if the last digit matches the winning number's last digit" 
                                : "Your bid wins if the first digit matches the winning number's first digit"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error/Success Messages */}
                {localError && (
                  <div className="animate-shake relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400 to-rose-400 rounded-xl blur opacity-20"></div>
                    <div className="relative bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      {localError}
                    </div>
                  </div>
                )}

                {success && (
                  <div className={`relative group ${showSuccessAnimation ? 'animate-success-pop' : ''}`}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl blur opacity-20"></div>
                    <div className="relative bg-green-50/80 backdrop-blur-sm border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                      <span className="text-lg">✅</span>
                      {success}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={bidLoading}
                  className="relative group/btn w-full overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-xl blur opacity-30 group-hover/btn:opacity-50 transition duration-500"></div>
                  <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 py-4 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-lg shadow-lg shadow-amber-500/30">
                    {bidLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Placing Bid...
                      </>
                    ) : (
                      <>
                        <Zap size={20} />
                        Place Bid
                        <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes success-pop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-success-pop {
          animation: success-pop 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

// Missing AlertCircle import
import { AlertCircle } from "lucide-react";

export default PlaceBid;