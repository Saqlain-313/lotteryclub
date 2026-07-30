// pages/WalletDashboard.jsx
import {
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  Gift,
  Rocket,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DepositHistory from "../components/DepositHistory.jsx";
import WithdrawalHistory from "../components/WithdrawalHistory.jsx";
import { getMyDeposits } from "../redux/slices/depositSlice";
import { fetchWithdrawalHistory } from "../redux/slices/withdrawalSlice";

export default function WalletDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showBalance, setShowBalance] = useState(true);

  // Get currency symbol based on user's country
  const getCurrencySymbol = (countryCode) => {
    const countryCurrencyMap = {
      AU: "AUD",
      IN: "INR",
      PK: "PKR",
      BD: "BDT",
      NP: "NPR",
      AE: "AED",
    };
    const currencySymbolMap = {
      AUD: "A$",
      INR: "₹",
      PKR: "₨",
      BDT: "৳",
      NPR: "₨",
      AED: "د.إ",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    if (!countryCode) return "₹";
    const currencyCode = countryCurrencyMap[countryCode];
    return currencySymbolMap[currencyCode] || "₹";
  };

  const currencySymbol = getCurrencySymbol(user?.country);
  const walletBalance = user?.balance?.local || 0;

  // Get state from Redux with proper selectors
  const depositState = useSelector((state) => state.deposit);
  const withdrawalState = useSelector((state) => state.withdrawal);

  const deposits = depositState?.deposits || [];
  const depositsLoading = depositState?.loading || false;
  const depositsError = depositState?.error || null;

  const withdrawals = withdrawalState?.history || [];
  const withdrawalsLoading = withdrawalState?.loading || false;
  const withdrawalsError = withdrawalState?.error || null;

  // Fetch data on mount
  useEffect(() => {
    dispatch(getMyDeposits());
    dispatch(fetchWithdrawalHistory());
  }, [dispatch]);

  // Calculate totals from real data
  const totalDeposits =
    deposits?.reduce((sum, deposit) => sum + (deposit.amount || 0), 0) || 0;
  const totalWithdrawals =
    withdrawals?.reduce((sum, w) => sum + (w.amount || 0), 0) || 0;

  // Calculate winnings (you can adjust this logic based on your actual data structure)
  const totalWinnings = 124000; // This could come from a separate API/state

  // Calculate bonuses (you can adjust this logic)
  const totalBonuses = 24900; // This could come from a separate API/state

  // Prepare weekly chart data (last 7 days)
  const getWeeklyData = () => {
    const today = new Date();
    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayDeposits =
        deposits
          ?.filter(
            (d) =>
              d.createdAt &&
              new Date(d.createdAt).toISOString().split("T")[0] === dateStr,
          )
          .reduce((sum, d) => sum + (d.amount || 0), 0) || 0;

      const dayWithdrawals =
        withdrawals
          ?.filter(
            (w) =>
              (w.requestedAt || w.createdAt) &&
              new Date(w.requestedAt || w.createdAt)
                .toISOString()
                .split("T")[0] === dateStr,
          )
          .reduce((sum, w) => sum + (w.amount || 0), 0) || 0;

      const netChange = dayDeposits - dayWithdrawals;

      weeklyData.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: dateStr,
        amount: netChange,
        deposits: dayDeposits,
        withdrawals: dayWithdrawals,
        totalTransactions: dayDeposits + dayWithdrawals,
      });
    }

    return weeklyData;
  };

  const weeklyData = getWeeklyData();

  // Find max amount for chart scaling
  const maxDeposit = Math.max(...weeklyData.map((d) => d.deposits), 0);
  const maxWithdrawal = Math.max(...weeklyData.map((d) => d.withdrawals), 0);
  const overallMax = Math.max(maxDeposit, maxWithdrawal, 1);

  // Calculate chart heights (percentage of max)
  const getHeightPercent = (amount) => {
    if (amount === 0) return 5;
    const percentage = (amount / overallMax) * 100;
    return Math.max(percentage, 5);
  };

  // Format currency with dynamic symbol
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Check if there's any data
  const hasData = weeklyData.some((d) => d.totalTransactions > 0);

  // Loading state - only show if both are loading initially
  if (
    depositsLoading &&
    withdrawalsLoading &&
    deposits.length === 0 &&
    withdrawals.length === 0
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wallet data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        {/* <WalletHeader /> */}

        {/* Balance + 3D Card in one row */}
        <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-6">
          {/* <div className="lg:col-span-7">
            <WalletBalanceCard />
          </div> */}

          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 shadow-xl p-5 sm:p-6 md:p-8 min-h-[200px] sm:min-h-[240px] md:min-h-[280px] lg:min-h-[320px] flex flex-col justify-between text-white">
              <div className="absolute -right-4 -bottom-4 opacity-20">
                <span className="text-[80px] sm:text-[100px] md:text-[120px]">
                  💎
                </span>
              </div>

              <div className="relative z-10 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
                    Winzox Elite Card
                  </h3>
                </div>
                <button
                  onClick={() => setShowBalance((prev) => !prev)}
                  aria-label={showBalance ? "Hide balance" : "Show balance"}
                  className="flex-shrink-0 p-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 transition-colors"
                >
                  {showBalance ? (
                    <Eye size={16} className="text-white" />
                  ) : (
                    <EyeOff size={16} className="text-white" />
                  )}
                </button>
              </div>

              {/* Chip mockup - positioned like a real debit card, top-left below the title */}
              <div className="relative z-10 mt-4 flex items-center gap-3">
                <div className="w-9 h-7 sm:w-10 sm:h-8 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
                    <div className="border border-yellow-600/40"></div>
                    <div className="border border-yellow-600/40"></div>
                    <div className="border border-yellow-600/40"></div>
                    <div className="border border-yellow-600/40"></div>
                    <div className="border border-yellow-600/40"></div>
                    <div className="border border-yellow-600/40"></div>
                  </div>
                </div>
                <span className="text-white/50 text-[10px] sm:text-xs tracking-[0.2em] font-mono">
                  •••• •••• •••• 4471
                </span>
              </div>

              {/* Current wallet balance on the card */}
              <div className="relative z-10 mt-4">
                <p className="text-white/60 text-[10px] sm:text-xs uppercase tracking-widest font-semibold">
                  Available Balance
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mt-1 tracking-tight">
                  {showBalance
                    ? `${currencySymbol}${walletBalance.toLocaleString("en-IN")}`
                    : "₹••••••"}
                </h2>
              </div>

              <div className="relative z-10 mt-auto pt-4">
                <div className="flex items-center gap-2 text-white/60 text-[10px] sm:text-xs mb-3">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span>Card Active</span>
                </div>

                {/* Deposit / Withdraw actions for this card */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    to="/deposit"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-bold transition-colors"
                  >
                    <ArrowDownLeft size={14} className="sm:w-4 sm:h-4" />
                    Deposit
                  </Link>
                  <Link
                    to="/withdrawal"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white text-purple-700 text-xs sm:text-sm font-bold shadow-[0_2px_10px_-2px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_14px_-2px_rgba(0,0,0,0.3)] transition-all"
                  >
                    <ArrowUpRight size={14} className="sm:w-4 sm:h-4" />
                    Withdraw
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats - 4 cards with real data */}
        <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all duration-300">
            <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
              <ArrowDownLeft
                size={20}
                className="sm:w-5 sm:h-5 md:w-6 md:h-6"
              />
            </div>
            <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider font-bold">
              Deposits
            </p>
            <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-1 text-gray-900">
              {currencySymbol}
              {totalDeposits.toLocaleString("en-IN")}
            </h4>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
              {deposits?.length || 0} transactions
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all duration-300">
            <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
              <ArrowUpRight size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider font-bold">
              Withdrawals
            </p>
            <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-1 text-gray-900">
              {currencySymbol}
              {totalWithdrawals.toLocaleString("en-IN")}
            </h4>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
              {withdrawals?.length || 0} transactions
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all duration-300">
            <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
              <Gift size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider font-bold">
              Winnings
            </p>
            <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-1 text-gray-900">
              {currencySymbol}
              {totalWinnings.toLocaleString("en-IN")}
            </h4>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
              +12.5% this month
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-yellow-200 transition-all duration-300">
            <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
              <Rocket size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider font-bold">
              Bonuses
            </p>
            <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-1 text-gray-900">
              {currencySymbol}
              {totalBonuses.toLocaleString("en-IN")}
            </h4>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
              3 active bonuses
            </p>
          </div>
        </div>

        {/* Analytics Chart - FULLY RESPONSIVE FIXED VERSION */}
        <div className="mt-4 sm:mt-6 md:mt-8 bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8">
            <div>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                Weekly Balance Analytics
              </h3>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-0.5 sm:mt-1">
                Net balance change (Deposits - Withdrawals)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-0">
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full"></span>
                <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">
                  Deposits
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full"></span>
                <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">
                  Withdrawals
                </span>
              </div>
              <select className="bg-gray-50 border border-gray-200 rounded-lg text-[10px] sm:text-xs md:text-sm px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 md:py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
          </div>

          {hasData ? (
            <>
              <div className="h-40 sm:h-48 md:h-56 lg:h-64 flex items-end justify-between space-x-0.5 xs:space-x-1 sm:space-x-1.5 md:space-x-2 lg:space-x-3">
                {weeklyData.map((data, index) => {
                  const depositHeight = getHeightPercent(data.deposits);
                  const withdrawalHeight = getHeightPercent(data.withdrawals);

                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center group h-full min-w-[20px] sm:min-w-[28px] md:min-w-[32px]"
                    >
                      {/* Bar container */}
                      <div className="w-full flex items-end justify-center space-x-0.5 xs:space-x-1 sm:space-x-1 md:space-x-1.5 lg:space-x-2 h-[calc(100%-28px)] sm:h-[calc(100%-30px)] md:h-[calc(100%-32px)]">
                        {/* Deposit Bar */}
                        <div className="flex flex-col items-center justify-end w-3 sm:w-4 md:w-5 lg:w-6 xl:w-7 h-full">
                          <div
                            className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg hover:shadow-lg transition-all cursor-pointer relative"
                            style={{
                              height: `${depositHeight}%`,
                              minHeight: "4px",
                            }}
                          >
                            {/* Tooltip */}
                            <div className="absolute -top-8 sm:-top-9 md:-top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[8px] sm:text-[10px] md:text-xs rounded-lg px-1.5 sm:px-2 md:px-2.5 py-1 sm:py-1.5 md:py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                              Deposit: {currencySymbol}
                              {data.deposits.toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>

                        {/* Withdrawal Bar */}
                        <div className="flex flex-col items-center justify-end w-3 sm:w-4 md:w-5 lg:w-6 xl:w-7 h-full">
                          <div
                            className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg hover:shadow-lg transition-all cursor-pointer relative"
                            style={{
                              height: `${withdrawalHeight}%`,
                              minHeight: "4px",
                            }}
                          >
                            {/* Tooltip */}
                            <div className="absolute -top-8 sm:-top-9 md:-top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[8px] sm:text-[10px] md:text-xs rounded-lg px-1.5 sm:px-2 md:px-2.5 py-1 sm:py-1.5 md:py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                              Withdrawal: {currencySymbol}
                              {data.withdrawals.toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Day label and net amount */}
                      <div className="flex flex-col items-center mt-0.5 sm:mt-1 md:mt-1.5">
                        <span className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs text-gray-500 font-medium">
                          {data.day}
                        </span>
                        <div
                          className={`text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-bold ${data.amount >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {data.amount >= 0 ? "+" : ""}
                          {currencySymbol}
                          {Math.abs(data.amount).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap justify-center sm:justify-between gap-1.5 sm:gap-2 md:gap-3 mt-3 sm:mt-4 md:mt-5 lg:mt-6 text-[9px] sm:text-[10px] md:text-xs text-gray-500 border-t pt-2.5 sm:pt-3 md:pt-4">
                <span className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-green-400 rounded-full"></span>
                  Deposits
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-red-400 rounded-full"></span>
                  Withdrawals
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5 md:gap-2 font-medium text-gray-700">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-blue-400 rounded-full"></span>
                  Net: {currencySymbol}
                  {weeklyData
                    .reduce((sum, d) => sum + d.amount, 0)
                    .toLocaleString("en-IN")}
                </span>
              </div>
            </>
          ) : (
            <div className="h-40 sm:h-48 md:h-56 lg:h-64 flex items-center justify-center text-gray-400">
              <div className="text-center px-4">
                <p className="text-sm sm:text-base md:text-lg">
                  No transaction data available
                </p>
                <p className="text-[10px] sm:text-xs md:text-sm mt-1">
                  Make your first deposit or withdrawal to see analytics
                </p>
              </div>
            </div>
          )}
        </div>

        {/* History in two columns */}
        <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <DepositHistory />
          <WithdrawalHistory />
        </div>

        {/* Footer */}
        <footer className="mt-6 sm:mt-8 bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-[10px] sm:text-xs md:text-sm">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-6 mb-2 md:mb-0">
              <span className="font-bold text-purple-600">WINZOX v4.2.0</span>
              <a className="hover:text-purple-600 transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="hover:text-purple-600 transition-colors" href="#">
                Terms of Service
              </a>
              <a className="hover:text-purple-600 transition-colors" href="#">
                Responsible Gaming
              </a>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>System Status: All Systems Operational</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
