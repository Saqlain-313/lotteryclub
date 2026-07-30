import {
  ArrowDownLeft,
  ArrowUpRight,
  Award,
  BadgeCheck,
  BarChart3,
  ChevronRight,
  Circle,
  ClipboardList,
  Clock,
  Coins,
  Gift,
  History,
  Key,
  LogOut,
  MessageCircle,
  Rocket,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 🔶 Warm amber/gold glow shadow — matches reference image exactly
  const glowShadow =
    "shadow-[0_4px_20px_-4px_rgba(251,191,36,0.25),0_2px_8px_-2px_rgba(251,146,60,0.15)]";
  const glowShadowSoft =
    "shadow-[0_2px_12px_-2px_rgba(251,191,36,0.18),0_1px_4px_-1px_rgba(251,146,60,0.10)]";
  const glowShadowHover =
    "hover:shadow-[0_8px_28px_-4px_rgba(251,191,36,0.35),0_4px_12px_-2px_rgba(251,146,60,0.2)]";

  const accountMenuItems = [
    {
      icon: User,
      label: "Profile",
      path: "/profile",
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200/60",
      description: "View and edit your profile",
    },
    {
      icon: Coins,
      label: "Deposit",
      path: "/deposit",
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200/60",
      description: "Add funds to your wallet",
    },
    {
      icon: History,
      label: "Deposit History",
      path: "/deposit-history",
      color: "text-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200/60",
      description: "View your deposit records",
    },
    {
      icon: ArrowUpRight,
      label: "Withdrawal",
      path: "/withdrawal",
      color: "text-orange-700",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200/60",
      description: "Withdraw your winnings instantly",
    },
    {
      icon: ArrowDownLeft,
      label: "Withdrawal History",
      path: "/withdrawal-history",
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200/60",
      description: "Track your withdrawal requests",
    },
    {
      icon: Gift,
      label: "Refer & Earn",
      path: "/promo",
      color: "text-pink-700",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200/60",
      description: "Invite friends & earn rewards",
    },
    {
      icon: ClipboardList,
      label: "Bet History",
      path: "/bet-history",
      color: "text-indigo-700",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200/60",
      description: "Complete betting history",
    },
    {
      icon: Key,
      label: "Change Password",
      path: "/change-password",
      color: "text-yellow-700",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200/60",
      description: "Update your account security",
    },
    {
      icon: MessageCircle,
      label: "Support Chat",
      path: "/support-chat",
      color: "text-cyan-700",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200/60",
      description: "24/7 support assistance",
    },
  ];

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleCancelLogout = () => {
    if (isLoggingOut) return;
    setShowLogoutConfirm(false);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    return user.name || user.username || "User";
  };

  const getUserSubtitle = () => {
    if (!user) return "";
    return user.email || user.mobile || "";
  };

  const getInitial = () => {
    return getUserDisplayName().charAt(0).toUpperCase();
  };

  const getAvatarGradient = () => {
    const gradients = [
      "from-yellow-400 to-orange-500",
      "from-blue-400 to-purple-500",
      "from-green-400 to-teal-500",
      "from-pink-400 to-rose-500",
      "from-indigo-400 to-blue-500",
    ];
    const index = getUserDisplayName().length % gradients.length;
    return gradients[index];
  };

  const stats = [
    {
      icon: Award,
      label: "TOTAL BETS",
      value: "2,847",
      change: "+12%",
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      icon: TrendingUp,
      label: "WINNINGS",
      value: "₹45,230",
      change: "+8%",
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      icon: Star,
      label: "REFERRALS",
      value: "12",
      change: "+3",
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      icon: Shield,
      label: "STATUS",
      value: "Verified",
      change: "Active",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  ];

  const quickActions = [
    {
      icon: Rocket,
      label: "Quick Deposit",
      path: "/deposit",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: Wallet,
      label: "Withdraw",
      path: "/withdrawal",
      gradient: "from-purple-400 to-purple-600",
    },
    {
      icon: History,
      label: "Bet History",
      path: "/bet-history",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      icon: BarChart3,
      label: "Activity",
      path: "/activity",
      gradient: "from-green-400 to-green-600",
    },
  ];

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-orange-50/20 to-amber-50/40 py-4 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Card - warm amber glow like reference image */}
        <div
          className={`bg-white rounded-2xl ${glowShadow} border border-amber-200/50 p-5 mb-4`}
        >
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-shrink-0">
              <div
                className={`w-14 h-14 rounded-full bg-gradient-to-r ${getAvatarGradient()} flex items-center justify-center text-white font-bold text-xl shadow-[0_2px_10px_-2px_rgba(251,191,36,0.4)] ring-2 ring-white`}
              >
                {getInitial()}
                <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full p-0.5 ring-1 ring-white">
                  <BadgeCheck size={10} className="text-white" />
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 truncate">
                  {getUserDisplayName()}
                </h2>
                <span className="text-[8px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full border border-green-200/60">
                  Verified
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate">
                {getUserSubtitle()}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <Wallet size={12} className="text-yellow-500" />
                <span className="text-xs font-medium text-gray-600">
                  Balance:
                </span>
                <span className="text-xs font-bold text-yellow-600">
                  ₹{user?.balance?.local?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet & Logout Buttons */}
          <div className="flex items-center gap-2">
            <Link
              to="/wallet"
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-yellow-50 rounded-xl border border-yellow-200/60 text-yellow-600 font-bold text-sm shadow-[0_2px_8px_-2px_rgba(251,191,36,0.25)] hover:shadow-[0_4px_14px_-2px_rgba(251,191,36,0.4)] hover:bg-yellow-100 transition-all"
            >
              <Wallet size={16} />
              Wallet
            </Link>
            <button
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-red-50 rounded-xl border border-red-200/60 text-red-600 font-semibold text-sm shadow-[0_2px_8px_-2px_rgba(248,113,113,0.25)] hover:shadow-[0_4px_14px_-2px_rgba(248,113,113,0.4)] hover:bg-red-100 transition-all disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Circle className="animate-spin" size={14} />
              ) : (
                <LogOut size={14} />
              )}
              Logout
            </button>
          </div>

          {/* Member since */}
          <div className="flex items-center gap-1.5 mt-3 bg-amber-50/60 px-3 py-1.5 rounded-full border border-amber-200/50 w-fit">
            <Clock size={12} className="text-gray-400" />
            <span className="text-[10px] font-medium text-gray-600">
              Member since Jan 2024
            </span>
          </div>
        </div>

        {/* Quick Actions - 4 columns with warm glow */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.path}
              className={`bg-white rounded-2xl p-3 ${glowShadowSoft} border border-amber-200/40 hover:border-yellow-300/70 ${glowShadowHover} transition-all duration-300 text-center`}
            >
              <div
                className={`bg-gradient-to-br ${action.gradient} w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-1.5`}
              >
                <action.icon
                  size={18}
                  className="text-white"
                  strokeWidth={2.5}
                />
              </div>
              <p className="text-[9px] font-bold text-gray-700">
                {action.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Stats - 2x2 Grid with warm glow */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl p-4 ${glowShadowSoft} border border-amber-200/40`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[9px] text-gray-500 font-medium tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-lg font-bold text-gray-900 mt-0.5">
                    {stat.value}
                  </p>
                  <p className="text-[9px] font-semibold text-green-500">
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`${stat.bg} p-2 rounded-xl border border-gray-200/40`}
                >
                  <stat.icon size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Account Management */}
        <div
          className={`bg-white rounded-2xl ${glowShadow} border border-amber-200/40 p-4 mb-4`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-500" />
              Account Management
            </h3>
            <span className="text-[8px] bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full border border-yellow-200/60 font-bold">
              {accountMenuItems.length} options
            </span>
          </div>

          <div className="space-y-1.5">
            {accountMenuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 hover:border-yellow-300/70 hover:bg-amber-50/50 transition-colors group"
              >
                <div
                  className={`${item.bgColor} p-2 rounded-lg border ${item.borderColor}`}
                >
                  <item.icon
                    size={16}
                    className={item.color}
                    strokeWidth={2.3}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">
                    {item.label}
                  </p>
                  <p className="text-[9px] text-gray-400 truncate">
                    {item.description}
                  </p>
                </div>
                <ChevronRight
                  size={14}
                  className="text-gray-300 group-hover:text-yellow-500 group-hover:translate-x-0.5 transition-all"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div
          className={`bg-white rounded-2xl ${glowShadow} border border-amber-200/40 p-4`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/60">
              <MessageCircle size={18} className="text-yellow-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900">
                Need Assistance?
              </h4>
              <p className="text-xs text-gray-500">
                Our support team is available 24/7
              </p>
            </div>
            <Link
              to="/support-chat"
              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl text-xs shadow-[0_4px_14px_-2px_rgba(251,146,60,0.5)] hover:shadow-[0_6px_20px_-2px_rgba(251,146,60,0.65)] transition-all"
            >
              Chat Now
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-[8px] text-gray-400 flex items-center justify-center gap-1">
            <Shield size={10} className="text-gray-300" />
            Your account is secure and protected
          </p>
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={handleCancelLogout}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative bg-white rounded-2xl ${glowShadow} border border-amber-200/50 w-full max-w-xs p-6 text-center animate-[popIn_0.2s_ease]`}
          >
            <button
              onClick={handleCancelLogout}
              disabled={isLoggingOut}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-40"
            >
              <X size={14} className="text-gray-400" />
            </button>

            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200/60 flex items-center justify-center mx-auto mb-3">
              <LogOut size={22} className="text-red-500" />
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-1">
              Log out of WINZOX?
            </h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to logout? You'll need to sign in again to
              access your wallet and bets.
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white font-bold text-sm shadow-[0_4px_14px_-2px_rgba(239,68,68,0.5)] hover:shadow-[0_6px_20px_-2px_rgba(239,68,68,0.65)] transition-all disabled:opacity-60"
              >
                {isLoggingOut ? (
                  <>
                    <Circle className="animate-spin" size={14} />
                    Logging out...
                  </>
                ) : (
                  "Yes, Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Account;
