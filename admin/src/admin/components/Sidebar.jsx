// src/components/admin/Sidebar.jsx

import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Wallet,
  CreditCard,
  ArrowLeftRight,
  FileText,
  Bell,
  Settings,
  Image,
  ChevronDown,
  ChevronRight,
  Sparkles,
  LogOut,
  UserCog,
  Shield,
  Globe,
  DollarSign,
  TrendingUp,
  Zap,
  Award,
  Gift,
  HelpCircle,
  BarChart3,
  ListOrdered,
  ZapIcon,
  Gamepad2,        // ✅ ADDED
  Target,          // ✅ ADDED
  Trophy,          // ✅ ADDED
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    settings: true,
    matka: true,   // ✅ ADDED - for Matka menu
  });

  // Auto-expand settings if any settings submenu is active
  useEffect(() => {
    const settingsPaths = [
      "/admin/settings",
      "/admin/deposit-settings",
      "/admin/withdrawal-settings",
      "/admin/security-settings",
      "/admin/ticketsetiings",
      "/admin/gamecounts"
    ];
    if (settingsPaths.includes(location.pathname)) {
      setExpandedMenus(prev => ({ ...prev, settings: true }));
    }

    // ✅ Auto-expand Matka menu if any Matka page is active
    const matkaPaths = [
      "/admin/markets",
      "/admin/bids",
      "/admin/results"
    ];
    if (matkaPaths.includes(location.pathname)) {
      setExpandedMenus(prev => ({ ...prev, matka: true }));
    }
  }, [location.pathname]);

  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const menus = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
      color: "blue",
    },

    {
      name: "Users",
      path: "/admin/users",
      icon: <Users size={20} />,
      color: "green",
    },
    {
      name: "Banners",
      path: "/admin/banners",
      icon: <Image size={20} />,
      color: "purple",
    },
    {
      name: "Deposits",
      path: "/admin/deposits",
      icon: <Wallet size={20} />,
      color: "emerald",
    },
    {
      name: "Withdrawals",
      path: "/admin/withdrawals",
      icon: <CreditCard size={20} />,
      color: "orange",
    },
    {
      name:"Entry-ticket",
      path:"/admin/gameEntries",
      icon:<ZapIcon size={20}/>,
      color:"pink",
    },
    {
      name: "Transactions",
      path: "/admin/transactions",
      icon: <ArrowLeftRight size={20} />,
      color: "cyan",
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <FileText size={20} />,
      color: "red",
    },
    {
      name: "Notifications",
      path: "/admin/notifications",
      icon: <Bell size={20} />,
      color: "pink",
    },

    // ✅ ============ MATKA MENU (NEW) ============
    {
      name: "Matka Game",
      icon: <Gamepad2 size={20} />,
      color: "amber",
      subMenus: [
        {
          name: "Markets",
          path: "/admin/markets",
          icon: <Target size={16} />,
        },
        {
          name: "Bids",
          path: "/admin/bids",
          icon: <Target size={16} />,
        },
        {
          name: "Results",
          path: "/admin/results",
          icon: <Trophy size={16} />,
        },
      ],
    },

    {
      name: "Settings",
      icon: <Settings size={20} />,
      color: "gray",
      subMenus: [
        {
          name: "General Settings",
          path: "/admin/settings",
          icon: <UserCog size={16} />,
        },
        {
          name: "Deposit Settings",
          path: "/admin/deposit-settings",
          icon: <DollarSign size={16} />,
        },
        {
          name: "Withdrawal Settings",
          path: "/admin/withdrawal-settings",
          icon: <CreditCard size={16} />,
        },
        {
          name: "Security Settings",
          path: "/admin/security-settings",
          icon: <Shield size={16} />,
        },
        {
          name: "Ticket Settings",
          path: "/admin/ticketsetiings",
          icon: <Award size={16} />,
        },
        {
          name: "Game Count",
          path: "/admin/gamecounts",
          icon: <ListOrdered size={16} />,
        },
      ],
    },
  ];

  // Get color classes
  const getActiveColor = (color) => {
    const colors = {
      blue: "bg-blue-600",
      green: "bg-green-600",
      purple: "bg-purple-600",
      emerald: "bg-emerald-600",
      orange: "bg-orange-600",
      cyan: "bg-cyan-600",
      red: "bg-red-600",
      pink: "bg-pink-600",
      gray: "bg-gray-600",
      amber: "bg-amber-600",    // ✅ ADDED
    };
    return colors[color] || "bg-blue-600";
  };

  const getHoverColor = (color) => {
    const colors = {
      blue: "hover:bg-blue-600/20",
      green: "hover:bg-green-600/20",
      purple: "hover:bg-purple-600/20",
      emerald: "hover:bg-emerald-600/20",
      orange: "hover:bg-orange-600/20",
      cyan: "hover:bg-cyan-600/20",
      red: "hover:bg-red-600/20",
      pink: "hover:bg-pink-600/20",
      gray: "hover:bg-gray-600/20",
      amber: "hover:bg-amber-600/20",  // ✅ ADDED
    };
    return colors[color] || "hover:bg-gray-600/20";
  };

  const getTextColor = (color) => {
    const colors = {
      blue: "text-blue-400",
      green: "text-green-400",
      purple: "text-purple-400",
      emerald: "text-emerald-400",
      orange: "text-orange-400",
      cyan: "text-cyan-400",
      red: "text-red-400",
      pink: "text-pink-400",
      gray: "text-gray-400",
      amber: "text-amber-400",   // ✅ ADDED
    };
    return colors[color] || "text-gray-400";
  };

  const getBorderColor = (color) => {
    const colors = {
      blue: "border-blue-500",
      green: "border-green-500",
      purple: "border-purple-500",
      emerald: "border-emerald-500",
      orange: "border-orange-500",
      cyan: "border-cyan-500",
      red: "border-red-500",
      pink: "border-pink-500",
      gray: "border-gray-500",
      amber: "border-amber-500",  // ✅ ADDED
    };
    return colors[color] || "border-blue-500";
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50 
          w-64 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 
          text-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Decorative gradient line at top */}
        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>

        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                Control Dashboard
              </p>
            </div>
          </div>

          <button
            className="lg:hidden hover:bg-gray-700/50 p-2 rounded-xl transition-all duration-200"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Menus */}
        <div className="py-4 overflow-y-auto h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {menus.map((menu) => {
            if (menu.subMenus) {
              const isExpanded = expandedMenus[menu.name.toLowerCase().replace(" ", "")];
              const isMatkaActive = menu.name === "Matka Game" && location.pathname.startsWith("/admin/markets") ||
                                    location.pathname.startsWith("/admin/bids") ||
                                    location.pathname.startsWith("/admin/results");
              
              return (
                <div key={menu.name} className="mb-1">
                  <button
                    onClick={() => toggleMenu(menu.name.toLowerCase().replace(" ", ""))}
                    className={`
                      flex items-center justify-between w-full px-6 py-3 
                      text-gray-300 transition-all duration-200
                      hover:bg-gray-800/50 hover:text-white
                      ${isExpanded || isMatkaActive ? 'bg-gray-800/30 text-white' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isExpanded || isMatkaActive ? 'text-amber-400' : 'text-gray-400'}>
                        {menu.icon}
                      </span>
                      <span className="text-sm font-medium">{menu.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-400">
                        {menu.subMenus.length}
                      </span>
                      {isExpanded ? (
                        <ChevronDown size={16} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                    </div>
                  </button>

                  {(isExpanded || isMatkaActive) && (
                    <div className="ml-4 border-l-2 border-gray-700/30 ml-6">
                      {menu.subMenus.map((subMenu) => {
                        const isActive = location.pathname === subMenu.path;
                        return (
                          <NavLink
                            key={subMenu.path}
                            to={subMenu.path}
                            onClick={onClose}
                            className={`
                              flex items-center gap-3 px-6 py-2.5 transition-all duration-200 text-sm
                              ${isActive
                                ? `text-white bg-gradient-to-r from-amber-600/20 to-amber-600/10 border-r-2 border-amber-500`
                                : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                              }
                            `}
                          >
                            <span className={isActive ? "text-amber-400" : "text-gray-500"}>
                              {subMenu.icon}
                            </span>
                            <span>{subMenu.name}</span>
                            {isActive && (
                              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={menu.path}
                to={menu.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 transition-all duration-200 mx-2 rounded-xl
                  ${isActive
                    ? `bg-gradient-to-r from-${menu.color}-600/20 to-${menu.color}-600/10 text-white border-r-2 border-${menu.color}-500`
                    : "text-gray-300 hover:bg-gray-800/30 hover:text-white"
                  }`
                }
              >
                <span className={`
                  ${location.pathname === menu.path ? getTextColor(menu.color) : 'text-gray-400'}
                `}>
                  {menu.icon}
                </span>
                <span className="text-sm font-medium">{menu.name}</span>
                {location.pathname === menu.path && (
                  <span className={`ml-auto w-1.5 h-1.5 rounded-full ${menu.color === 'amber' ? 'bg-amber-500' : `bg-${menu.color}-500`}`}></span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50 bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span>Online</span>
            </div>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors">
                <HelpCircle size={16} className="text-gray-400" />
              </button>
              <button className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors">
                <Bell size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-gray-500 text-center">
            v2.1.0 • Last updated: Today
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;