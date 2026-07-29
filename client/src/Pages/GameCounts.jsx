// GameSelection.jsx - Amber/Orange/Yellow Theme

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserTicketTypes,
} from "../redux/slices/ticketTypeSlice";
import { getGameCounts } from "../redux/slices/gameCountSlice";
import { createGameEntry, resetGameEntryState } from "../redux/slices/gameEntrySlice";
import { ChevronDown, RefreshCw, Play, Calendar, Plus, Shuffle, X, ChevronUp, Stars, Diamond, Crown, Sparkles, Ticket, ShoppingCart, ArrowRight, ShieldCheck, Loader2, Zap, Gift, Award, Users } from "lucide-react";

const GameSelection = () => {
  const dispatch = useDispatch();

  const { ticketTypes = [], loading: ticketLoading } = useSelector(
    (state) => state.ticketType
  );

  const { gameCounts = [], loading: gameCountLoading } = useSelector(
    (state) => state.gameCount
  );

  const { loading: entryLoading, success: entrySuccess, error: entryError, message: entryMessage } = useSelector(
    (state) => state.gameEntry
  );

  // State declarations
  const [activeTicket, setActiveTicket] = useState(null);
  const [selectedGameType, setSelectedGameType] = useState(null);
  const [selectedGameCount, setSelectedGameCount] = useState(null);
  const [games, setGames] = useState([]);
  const [selectionMode, setSelectionMode] = useState(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [drawCount, setDrawCount] = useState(1);
  const [expandedGame, setExpandedGame] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hoveredTicket, setHoveredTicket] = useState(null);
  const [hoveredNumber, setHoveredNumber] = useState(null);
  const [allGamesExpanded, setAllGamesExpanded] = useState(false);

  // ========== EFFECTS ==========

  useEffect(() => {
    dispatch(getUserTicketTypes());
    dispatch(getGameCounts());
  }, [dispatch]);

  useEffect(() => {
    if (ticketTypes.length > 0 && !activeTicket) {
      setActiveTicket(ticketTypes[0]._id);
    }
  }, [ticketTypes, activeTicket]);

  // Reset when ticket changes
  useEffect(() => {
    setSelectedGameType(null);
    setSelectedGameCount(null);
    setGames([]);
    setExpandedGame(null);
    setIsInitialized(false);
    setSelectionMode(null);
    setAllGamesExpanded(false);
  }, [activeTicket]);

  // Show success message when entry is created
  useEffect(() => {
    if (entrySuccess) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        dispatch(resetGameEntryState());
      }, 5000);
    }
  }, [entrySuccess, dispatch]);

  // ========== MEMOIZED VALUES ==========

  const availableGameTypes = useMemo(() => {
    const ticket = ticketTypes.find((t) => t._id === activeTicket);
    if (ticket && ticket.gameTypes && ticket.gameTypes.length > 0) {
      return ticket.gameTypes.map((gt) => ({
        id: gt._id,
        title: gt.title,
        description: gt.description || "",
      }));
    }
    return [{ id: "default", title: "Standard Game", description: "" }];
  }, [ticketTypes, activeTicket]);

  const filteredGameCounts = useMemo(() => {
    const result = gameCounts.filter((item) => {
      const ticketId = item.ticketType?._id || item.ticketType;
      if (ticketId !== activeTicket) return false;
      if (!selectedGameType || selectedGameType === "default") return true;
      const gameTypeId = item.gameType?._id || item.gameType;
      return gameTypeId === selectedGameType;
    });
    
    if (result.length === 0 && gameCounts.length > 0) {
      const anyForTicket = gameCounts.filter(
        (item) => (item.ticketType?._id || item.ticketType) === activeTicket
      );
      if (anyForTicket.length > 0) {
        return anyForTicket;
      }
    }
    return result;
  }, [gameCounts, activeTicket, selectedGameType]);

  const selectedCount = useMemo(() => {
    if (selectedGameCount) {
      return filteredGameCounts.find((x) => x._id === selectedGameCount);
    }
    if (filteredGameCounts.length > 0) {
      return filteredGameCounts[0];
    }
    return null;
  }, [filteredGameCounts, selectedGameCount]);

  const activeTicketTitle = useMemo(() => {
    const ticket = ticketTypes.find((t) => t._id === activeTicket);
    return ticket?.title || "Select Ticket";
  }, [ticketTypes, activeTicket]);

  const selectedGameTypeTitle = useMemo(() => {
    const gameType = availableGameTypes.find((g) => g.id === selectedGameType);
    return gameType?.title || "";
  }, [availableGameTypes, selectedGameType]);

  const totalPrice = useMemo(() => {
    const basePrice = selectedCount?.price || 0;
    return basePrice * (autoPlay ? drawCount : 1);
  }, [selectedCount, autoPlay, drawCount]);

  const allGamesFilled = useMemo(() => {
    if (games.length === 0) return false;
    
    if (selectionMode === "quickpick") {
      return games.every(game => 
        game.numbers && 
        game.numbers.length === 7 && 
        game.powerball !== null &&
        game.powerball !== undefined
      );
    }
    return games.every(game => 
      game.selectedNumbers && 
      game.selectedNumbers.length === 7 && 
      game.selectedPowerball !== null &&
      game.selectedPowerball !== undefined
    );
  }, [games, selectionMode]);

  // ========== UTILITY FUNCTIONS ==========

  const generateRandomGameNumbers = () => {
    const numbers = [];
    while (numbers.length < 7) {
      const num = Math.floor(Math.random() * 35) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    return numbers.sort((a, b) => a - b);
  };

  const generateRandomPowerball = () => {
    return Math.floor(Math.random() * 20) + 1;
  };

  const initializeGames = (mode) => {
    const totalGames = selectedCount?.totalGames || 6;
    const newGames = [];
    
    for (let i = 0; i < totalGames; i++) {
      if (mode === "quickpick") {
        newGames.push({
          id: i + 1,
          numbers: generateRandomGameNumbers(),
          powerball: generateRandomPowerball(),
          selectedNumbers: [],
          selectedPowerball: null
        });
      } else {
        newGames.push({
          id: i + 1,
          numbers: [],
          powerball: null,
          selectedNumbers: [],
          selectedPowerball: null
        });
      }
    }
    
    setGames(newGames);
    setIsInitialized(true);
    
    if (mode === "pick") {
      setAllGamesExpanded(true);
    } else {
      setAllGamesExpanded(false);
    }
  };

  // ========== AUTO-SELECT EFFECTS ==========

  useEffect(() => {
    if (activeTicket && availableGameTypes.length > 0 && !selectedGameType) {
      setSelectedGameType(availableGameTypes[0].id);
    }
  }, [activeTicket, availableGameTypes, selectedGameType]);

  useEffect(() => {
    if (selectedGameType && filteredGameCounts.length > 0 && !selectedGameCount) {
      setSelectedGameCount(filteredGameCounts[0]._id);
    }
  }, [selectedGameType, filteredGameCounts, selectedGameCount]);

  // ========== GAME FUNCTIONS ==========

  const toggleNumber = (gameIndex, num) => {
    if (selectionMode !== "pick") return;
    
    setGames(prev => {
      const newGames = [...prev];
      const game = newGames[gameIndex];
      const currentNumbers = game.selectedNumbers || [];
      
      if (currentNumbers.includes(num)) {
        game.selectedNumbers = currentNumbers.filter(n => n !== num);
      } else {
        if (currentNumbers.length >= 7) {
          alert("You can select maximum 7 numbers per game");
          return prev;
        }
        game.selectedNumbers = [...currentNumbers, num].sort((a, b) => a - b);
        
        if (game.selectedNumbers.length === 7 && !game.selectedPowerball) {
          game.selectedPowerball = generateRandomPowerball();
        }
      }
      
      return newGames;
    });
  };

  const togglePowerball = (gameIndex, num) => {
    if (selectionMode !== "pick") return;
    
    setGames(prev => {
      const newGames = [...prev];
      const game = newGames[gameIndex];
      
      if (game.selectedPowerball === num) {
        game.selectedPowerball = null;
      } else {
        game.selectedPowerball = num;
      }
      
      return newGames;
    });
  };

  const autoFillGame = (gameIndex) => {
    if (selectionMode !== "pick") return;
    
    setGames(prev => {
      const newGames = [...prev];
      const game = newGames[gameIndex];
      
      const numbers = generateRandomGameNumbers();
      game.selectedNumbers = numbers;
      
      if (!game.selectedPowerball) {
        game.selectedPowerball = generateRandomPowerball();
      }
      
      return newGames;
    });
  };

  const quickPickGame = (gameIndex) => {
    setGames(prev => {
      const newGames = [...prev];
      const game = newGames[gameIndex];
      
      if (selectionMode === "pick") {
        const numbers = generateRandomGameNumbers();
        game.selectedNumbers = numbers;
        game.selectedPowerball = generateRandomPowerball();
      } else {
        const numbers = generateRandomGameNumbers();
        game.numbers = numbers;
        game.powerball = generateRandomPowerball();
      }
      
      return newGames;
    });
  };

  const clearGame = (gameIndex) => {
    if (selectionMode !== "pick") return;
    
    setGames(prev => {
      const newGames = [...prev];
      const game = newGames[gameIndex];
      game.selectedNumbers = [];
      game.selectedPowerball = null;
      return newGames;
    });
  };

  const handleReshuffleAll = () => {
    setGames(prev => {
      return prev.map(game => {
        const numbers = generateRandomGameNumbers();
        if (selectionMode === "pick") {
          return {
            ...game,
            selectedNumbers: numbers,
            selectedPowerball: generateRandomPowerball()
          };
        } else {
          return {
            ...game,
            numbers: numbers,
            powerball: generateRandomPowerball()
          };
        }
      });
    });
  };

  const toggleExpand = (gameIndex) => {
    if (expandedGame === gameIndex) {
      setExpandedGame(null);
    } else {
      setExpandedGame(gameIndex);
    }
  };

  const isGameExpanded = (gameIndex) => {
    return allGamesExpanded || expandedGame === gameIndex;
  };

  // ========== HANDLE ADD TO CART ==========

  const handleAddToCart = async () => {
    // Validation
    if (!selectionMode) {
      alert("Please select Pick Your Numbers or QuickPick mode");
      return;
    }

    if (games.length === 0) {
      alert("No games to add. Please select a game mode first.");
      return;
    }

    if (!allGamesFilled) {
      alert("Please fill all games with 7 numbers and a Powerball before adding to cart");
      return;
    }

    if (!selectedCount || !selectedCount._id) {
      alert("Please select a game package");
      return;
    }

    if (!activeTicket) {
      alert("Please select a ticket type");
      return;
    }

    // Prepare game data for API - Format exactly as your backend expects
    const gameData = games.map(game => ({
      numbers: selectionMode === "quickpick" ? game.numbers : game.selectedNumbers,
      powerball: selectionMode === "quickpick" ? game.powerball : game.selectedPowerball
    }));

    // Final validation
    const isValid = gameData.every(g => 
      g.numbers && 
      g.numbers.length === 7 && 
      g.powerball !== null &&
      g.powerball !== undefined
    );

    if (!isValid) {
      alert("All games must have 7 numbers and a Powerball");
      return;
    }

    // Build payload matching your backend API expectations
    const payload = {
      ticketType: activeTicket,
      gameType: selectedGameType === "default" ? null : selectedGameType,
      gameCount: selectedCount._id,
      games: gameData,
      autoPlay: autoPlay,
      drawCount: autoPlay ? drawCount : 1,
      totalPrice: totalPrice,
    };

    console.log("📦 Sending payload to /game-entry:", JSON.stringify(payload, null, 2));

    try {
      const result = await dispatch(createGameEntry(payload)).unwrap();
      console.log("✅ Game Entry Created:", result);
      
      // Reset games after successful submission
      setGames([]);
      setIsInitialized(false);
      setSelectionMode(null);
      setAllGamesExpanded(false);
      
    } catch (error) {
      console.error("❌ Failed to create entry:", error);
      
      // Error is already in the slice state, but show a friendly alert
      if (typeof error === 'string') {
        alert(error);
      } else if (error?.message) {
        alert(error.message);
      } else {
        alert("Failed to create game entry. Please try again.");
      }
    }
  };

  // ========== UI HELPERS ==========

  const getTicketIcon = (title) => {
    const lower = title?.toLowerCase() || '';
    if (lower.includes('platinum') || lower.includes('premium')) return <Crown size={24} className="text-yellow-600" />;
    if (lower.includes('vip')) return <Diamond size={24} className="text-amber-500" />;
    if (lower.includes('powerhit')) return <Zap size={24} className="text-orange-500" />;
    if (lower.includes('system')) return <Gift size={24} className="text-amber-600" />;
    if (lower.includes('syndicate')) return <Users size={24} className="text-yellow-600" />;
    return <Sparkles size={24} className="text-amber-500" />;
  };

  const getTicketGradient = (title) => {
    const lower = title?.toLowerCase() || '';
    if (lower.includes('platinum') || lower.includes('premium')) return 'from-amber-400 to-yellow-400';
    if (lower.includes('vip')) return 'from-orange-400 to-amber-400';
    if (lower.includes('powerhit')) return 'from-orange-500 to-yellow-500';
    if (lower.includes('system')) return 'from-amber-500 to-yellow-400';
    if (lower.includes('syndicate')) return 'from-yellow-400 to-orange-400';
    return 'from-amber-400 to-yellow-400';
  };

  // ========== RENDER ==========

  if (ticketLoading || gameCountLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 p-1 mx-auto mb-4">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <div className="w-14 h-14 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading your tickets...</p>
          <p className="text-gray-400 text-sm mt-1">Please wait while we prepare your lottery experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 perspective-1000">
      {/* ===== HEADER - AMBER/ORANGE/YELLOW THEME ===== */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 transform-gpu shadow-xl" style={{ transform: 'rotateX(2deg) translateZ(0)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="mx-auto px-6 py-12 relative z-10 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="transform-gpu hover:scale-105 transition-transform duration-500">
              <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/40 text-white text-sm font-medium mb-4 shadow-xl shadow-orange-500/20">
                <Stars size={16} className="animate-spin-slow" /> VIP Dashboard
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl">
                Welcome back, <span className="text-yellow-200">Player</span>! 😍
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TOASTS ===== */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 transform-gpu animate-float" style={{ transform: 'rotateX(5deg) rotateY(-5deg) translateZ(50px)' }}>
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-green-200 flex items-center gap-3 border border-white/20 backdrop-blur-sm">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-3xl">✅</span>
            </div>
            <div>
              <p className="font-bold text-lg">Success!</p>
              <p className="text-sm text-green-100">{entryMessage || "Game entry created successfully"}</p>
            </div>
            <button 
              onClick={() => {
                setShowSuccess(false);
                dispatch(resetGameEntryState());
              }}
              className="ml-4 hover:bg-white/20 p-1.5 rounded-full transition-all hover:scale-110"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {entryError && (
        <div className="fixed top-6 right-6 z-50 transform-gpu animate-float" style={{ transform: 'rotateX(5deg) rotateY(-5deg) translateZ(50px)' }}>
          <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-red-200 flex items-center gap-3 border border-white/20 backdrop-blur-sm">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-3xl">❌</span>
            </div>
            <div>
              <p className="font-bold text-lg">Error!</p>
              <p className="text-sm text-red-100">{typeof entryError === 'string' ? entryError : entryError?.message || 'Something went wrong'}</p>
            </div>
            <button 
              onClick={() => dispatch(resetGameEntryState())}
              className="ml-4 hover:bg-white/20 p-1.5 rounded-full transition-all hover:scale-110"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="p-6 md:p-8 mx-auto transform-gpu max-w-7xl">
        {/* ===== STEP 1: SELECT TICKET TYPE ===== */}
        <div className="mb-10 transform-gpu hover:translate-z-10 transition-transform duration-300">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-white flex items-center justify-center font-bold text-xl shadow-2xl shadow-amber-200 transform-gpu rotate-3d hover:rotate-0 transition-transform duration-300" style={{ transform: 'rotateY(10deg) rotateX(5deg)' }}>
              1
            </div>
            <div>
              <h3 className="font-bold text-2xl text-gray-800">
                Best Sellers
              </h3>
              <p className="text-gray-500">
                Play one of our best selling tickets. Login for a more personalised experience.
              </p>
            </div>
          </div>

          {ticketTypes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-2xl border border-gray-100 text-gray-500">
              No ticket types available
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {ticketTypes.map((ticket) => {
                const ticketCount = gameCounts.filter(
                  (item) => (item.ticketType?._id || item.ticketType) === ticket._id
                ).length;
                const isActive = activeTicket === ticket._id;
                const gradient = getTicketGradient(ticket.title || ticket.name);

                return (
                  <button
                    key={ticket._id}
                    onClick={() => {
                      setActiveTicket(ticket._id);
                    }}
                    onMouseEnter={() => setHoveredTicket(ticket._id)}
                    onMouseLeave={() => setHoveredTicket(null)}
                    className={`group relative flex-1 min-w-[140px] max-w-[200px] p-5 rounded-2xl border-2 transition-all duration-500 text-center transform-gpu ${
                      isActive
                        ? `border-amber-400 bg-gradient-to-br from-amber-50 to-white shadow-2xl shadow-amber-200 scale-[1.05] translate-z-20`
                        : "border-gray-200 bg-white hover:border-amber-300 hover:shadow-2xl hover:-translate-y-2 hover:translate-z-10"
                    } ${hoveredTicket === ticket._id ? 'scale-105 translate-z-20' : ''}`}
                    style={{ transform: isActive || hoveredTicket === ticket._id ? 'rotateX(2deg) rotateY(2deg)' : 'rotateX(0) rotateY(0)' }}
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    {isActive && (
                      <>
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xl shadow-amber-300 animate-pulse-slow">
                          Selected
                        </div>
                        <div className="absolute inset-0 rounded-2xl border-2 border-amber-400 animate-pulse-slow opacity-50"></div>
                      </>
                    )}
                    <div className="flex flex-col items-center text-center gap-2 relative z-10">
                      <div className={`p-3 rounded-xl ${isActive ? 'bg-amber-100 shadow-lg shadow-amber-200' : 'bg-gray-100 group-hover:bg-amber-50'} transition-all duration-300 transform-gpu group-hover:scale-110 group-hover:rotate-6`}>
                        {getTicketIcon(ticket.title || ticket.name)}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-sm capitalize transition-colors ${isActive ? 'text-amber-700' : 'text-gray-800 group-hover:text-amber-600'}`}>
                          {ticket.title || ticket.name}
                        </h4>
                        {ticket.subTitle && (
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                            {ticket.subTitle}
                          </p>
                        )}
                      </div>
                    </div>
                    {isActive && (
                      <div className="mt-2 h-0.5 w-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full shadow-lg shadow-amber-200"></div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ===== STEP 2: SELECT GAME TYPE ===== */}
        <div className="mt-10 transform-gpu hover:translate-z-10 transition-transform duration-300">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-white flex items-center justify-center font-bold text-xl shadow-2xl shadow-amber-200 transform-gpu rotate-3d hover:rotate-0 transition-transform duration-300" style={{ transform: 'rotateY(10deg) rotateX(5deg)' }}>
              2
            </div>
            <div>
              <h3 className="font-bold text-2xl text-gray-800">
                Select Game Type
              </h3>
              <p className="text-gray-500">
                Choose your game type for {activeTicketTitle}
              </p>
            </div>
          </div>

          <div className="relative group">
            <select
              value={selectedGameType || ""}
              onChange={(e) => {
                setSelectedGameType(e.target.value || null);
                setSelectedGameCount(null);
                setGames([]);
                setExpandedGame(null);
                setIsInitialized(false);
                setSelectionMode(null);
                setAllGamesExpanded(false);
              }}
              disabled={!activeTicket || availableGameTypes.length === 0}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl h-14 px-5 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 font-medium transition-all duration-300 shadow-lg hover:shadow-2xl group-hover:border-amber-300"
            >
              <option value="">
                {availableGameTypes.length === 0 
                  ? "No game types available for this ticket" 
                  : "Select Game Type"}
              </option>
              {availableGameTypes.map((gameType) => (
                <option key={gameType.id} value={gameType.id}>
                  {gameType.title}
                  {gameType.description && ` - ${gameType.description}`}
                </option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-yellow-400 p-2 rounded-full shadow-lg shadow-amber-200 group-hover:scale-110 transition-transform duration-300">
              <ChevronDown className="text-white" size={20} />
            </div>
          </div>
        </div>

        {/* ===== STEP 3: SELECT GAME PACKAGE ===== */}
        <div className="mt-10 transform-gpu hover:translate-z-10 transition-transform duration-300">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-white flex items-center justify-center font-bold text-xl shadow-2xl shadow-amber-200 transform-gpu rotate-3d hover:rotate-0 transition-transform duration-300" style={{ transform: 'rotateY(10deg) rotateX(5deg)' }}>
              3
            </div>
            <div>
              <h3 className="font-bold text-2xl text-gray-800">
                Select Game Package
              </h3>
              <p className="text-gray-500">
                Choose your game package
              </p>
            </div>
          </div>

          <div className="relative group">
            <select
              value={selectedGameCount || ""}
              onChange={(e) => {
                setSelectedGameCount(e.target.value || null);
                setGames([]);
                setExpandedGame(null);
                setIsInitialized(false);
                setSelectionMode(null);
                setAllGamesExpanded(false);
              }}
              disabled={!selectedGameType || filteredGameCounts.length === 0}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl h-14 px-5 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 font-medium transition-all duration-300 shadow-lg hover:shadow-2xl group-hover:border-amber-300"
            >
              <option value="">
                {filteredGameCounts.length === 0 
                  ? "No game packages available" 
                  : "Select Game Package"}
              </option>
              {filteredGameCounts.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.totalGames} Games - ${item.price}
                  {item.label && ` (${item.label})`}
                </option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-400 to-amber-400 p-2 rounded-full shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-300">
              <ChevronDown className="text-white" size={20} />
            </div>
          </div>
        </div>

        {/* ===== STEP 4: SELECT NUMBERS ===== */}
        {activeTicket && (
          <div className="mt-10 transform-gpu hover:translate-z-10 transition-transform duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-white flex items-center justify-center font-bold text-xl shadow-2xl shadow-amber-200 transform-gpu rotate-3d hover:rotate-0 transition-transform duration-300" style={{ transform: 'rotateY(10deg) rotateX(5deg)' }}>
                4
              </div>
              <div>
                <h3 className="font-bold text-2xl text-gray-800">
                  Select Numbers
                </h3>
                <p className="text-gray-500">
                  Choose 7 numbers + 1 Powerball for {selectedCount?.totalGames || 6} games
                </p>
              </div>
            </div>

            {/* ===== SELECTION MODE TOGGLE BUTTONS ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Pick Your Numbers */}
              <button
                onClick={() => {
                  setSelectionMode("pick");
                  setExpandedGame(null);
                  initializeGames("pick");
                }}
                className={`group p-6 rounded-2xl border-2 transition-all duration-500 text-left transform-gpu ${
                  selectionMode === "pick"
                    ? "border-amber-400 bg-gradient-to-br from-amber-50 to-white shadow-2xl shadow-amber-100 scale-[1.02] translate-z-20"
                    : "border-gray-200 bg-white hover:border-amber-300 hover:shadow-2xl hover:-translate-y-2 hover:translate-z-10"
                }`}
                style={{ transform: selectionMode === "pick" ? 'rotateX(2deg) rotateY(2deg)' : 'rotateX(0) rotateY(0)' }}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${selectionMode === 'pick' ? 'bg-amber-100 shadow-lg shadow-amber-200' : 'bg-gray-100 group-hover:bg-amber-50'} transition-all duration-300 transform-gpu group-hover:scale-110 group-hover:rotate-6`}>
                    <span className="text-3xl">✏️</span>
                  </div>
                  <div>
                    <span className={`font-semibold block text-lg ${selectionMode === 'pick' ? 'text-amber-700' : 'text-gray-700 group-hover:text-amber-600'}`}>
                      Pick Your Numbers
                    </span>
                    <span className="text-sm text-gray-500">Choose your favourite numbers manually</span>
                  </div>
                </div>
                {selectionMode === "pick" && (
                  <div className="mt-3 h-1 w-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full shadow-lg shadow-amber-200"></div>
                )}
              </button>

              {/* QuickPick */}
              <button
                onClick={() => {
                  setSelectionMode("quickpick");
                  setExpandedGame(null);
                  initializeGames("quickpick");
                }}
                className={`group p-6 rounded-2xl border-2 transition-all duration-500 text-left transform-gpu ${
                  selectionMode === "quickpick"
                    ? "border-amber-400 bg-gradient-to-br from-amber-50 to-white shadow-2xl shadow-amber-100 scale-[1.02] translate-z-20"
                    : "border-gray-200 bg-white hover:border-amber-300 hover:shadow-2xl hover:-translate-y-2 hover:translate-z-10"
                }`}
                style={{ transform: selectionMode === "quickpick" ? 'rotateX(2deg) rotateY(2deg)' : 'rotateX(0) rotateY(0)' }}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${selectionMode === 'quickpick' ? 'bg-amber-100 shadow-lg shadow-amber-200' : 'bg-gray-100 group-hover:bg-amber-50'} transition-all duration-300 transform-gpu group-hover:scale-110 group-hover:rotate-6`}>
                    <RefreshCw size={28} className={selectionMode === 'quickpick' ? 'text-amber-600' : 'text-gray-500'} />
                  </div>
                  <div>
                    <span className={`font-semibold block text-lg ${selectionMode === 'quickpick' ? 'text-amber-700' : 'text-gray-700 group-hover:text-amber-600'}`}>
                      🎲 QuickPick
                    </span>
                    <span className="text-sm text-gray-500">Numbers are generated randomly</span>
                  </div>
                </div>
                {selectionMode === "quickpick" && (
                  <div className="mt-3 h-1 w-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full shadow-lg shadow-amber-200"></div>
                )}
              </button>
            </div>

            {/* ===== GAMES GRID ===== */}
            {selectionMode !== null && (
              <>
                <div className="space-y-6">
                  {games.length > 0 ? (
                    games.map((game, gameIndex) => {
                      const isComplete = selectionMode === "quickpick"
                        ? (game.numbers?.length === 7 && game.powerball)
                        : (game.selectedNumbers?.length === 7 && game.selectedPowerball);
                      
                      const currentNumbers = selectionMode === "quickpick" 
                        ? game.numbers || []
                        : game.selectedNumbers || [];
                      const currentPowerball = selectionMode === "quickpick"
                        ? game.powerball
                        : game.selectedPowerball;
                      
                      const isExpanded = isGameExpanded(gameIndex);
                      
                      return (
                        <div 
                          key={game.id} 
                          className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-500 overflow-hidden transform-gpu ${
                            isComplete 
                              ? 'border-green-400 shadow-2xl shadow-green-100 translate-z-10' 
                              : 'border-gray-200 hover:border-amber-200 hover:shadow-2xl hover:-translate-y-1 hover:translate-z-10'
                          }`}
                          style={{ transform: isExpanded ? 'rotateX(1deg)' : 'rotateX(0)' }}
                        >
                          {/* Game Header */}
                          <div 
                            className="p-5 cursor-pointer hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-transparent transition-all duration-300"
                            onClick={() => {
                              if (selectionMode === "pick") {
                                const game = games[gameIndex];
                                if (!game.selectedNumbers || game.selectedNumbers.length === 0) {
                                  autoFillGame(gameIndex);
                                }
                                if (allGamesExpanded) {
                                  if (expandedGame === gameIndex) {
                                    setExpandedGame(null);
                                  } else {
                                    setExpandedGame(gameIndex);
                                  }
                                } else {
                                  toggleExpand(gameIndex);
                                }
                              }
                            }}
                          >
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                              <div className="flex items-center gap-4 flex-wrap">
                                <span className={`font-bold text-lg min-w-[40px] transition-colors duration-300 ${isComplete ? 'text-green-600' : 'text-gray-700'}`}>
                                  #{game.id}
                                </span>
                                
                                {currentNumbers.length > 0 || currentPowerball ? (
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {currentNumbers.map((num, idx) => (
                                      <span 
                                        key={idx}
                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-400 text-white flex items-center justify-center text-sm font-bold shadow-xl shadow-amber-200 transform-gpu hover:scale-110 hover:translate-z-10 transition-all duration-300 cursor-default"
                                        style={{ transform: 'rotateY(5deg)' }}
                                      >
                                        {num}
                                      </span>
                                    ))}
                                    {currentNumbers.length > 0 && currentNumbers.length < 7 && (
                                      <span className="text-xs text-gray-400 font-medium">
                                        ({currentNumbers.length}/7)
                                      </span>
                                    )}
                                    {currentPowerball && (
                                      <>
                                        <span className="text-gray-300 font-bold mx-1">|</span>
                                        <span className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-400 text-white flex items-center justify-center text-sm font-bold shadow-xl shadow-red-200 transform-gpu hover:scale-110 hover:translate-z-10 transition-all duration-300 cursor-default" style={{ transform: 'rotateY(-5deg)' }}>
                                          {currentPowerball}
                                        </span>
                                      </>
                                    )}
                                    {isComplete && (
                                      <span className="ml-2 text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full font-medium shadow-md shadow-green-200 animate-pulse-slow">
                                        ✅ Complete
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-sm flex items-center gap-2">
                                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
                                    Click to auto-fill numbers
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                {selectionMode === "pick" && (
                                  <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        quickPickGame(gameIndex);
                                        if (!allGamesExpanded && expandedGame !== gameIndex) {
                                          setExpandedGame(gameIndex);
                                        }
                                      }}
                                      className="text-xs bg-gradient-to-r from-amber-100 to-yellow-100 hover:from-amber-200 hover:to-yellow-200 text-amber-700 px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 font-medium shadow-md hover:shadow-lg hover:scale-105 transform-gpu"
                                    >
                                      <RefreshCw size={12} />
                                      QuickPick
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        autoFillGame(gameIndex);
                                        if (!allGamesExpanded && expandedGame !== gameIndex) {
                                          setExpandedGame(gameIndex);
                                        }
                                      }}
                                      className="text-xs bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-700 px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 font-medium shadow-md hover:shadow-lg hover:scale-105 transform-gpu"
                                    >
                                      <Plus size={12} />
                                      AutoFill
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        clearGame(gameIndex);
                                      }}
                                      className="text-xs bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-700 px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 font-medium shadow-md hover:shadow-lg hover:scale-105 transform-gpu"
                                    >
                                      <X size={12} />
                                      Clear
                                    </button>
                                  </div>
                                )}
                                {selectionMode === "quickpick" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const numbers = generateRandomGameNumbers();
                                      setGames(prev => {
                                        const newGames = [...prev];
                                        const game = newGames[gameIndex];
                                        game.numbers = numbers;
                                        game.powerball = generateRandomPowerball();
                                        return newGames;
                                      });
                                    }}
                                    className="text-xs bg-gradient-to-r from-amber-100 to-yellow-100 hover:from-amber-200 hover:to-yellow-200 text-amber-700 px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 font-medium shadow-md hover:shadow-lg hover:scale-105 transform-gpu"
                                  >
                                    <RefreshCw size={12} />
                                    Re-Generate
                                  </button>
                                )}
                                
                                {selectionMode === "pick" && !allGamesExpanded && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleExpand(gameIndex);
                                    }}
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110 transform-gpu"
                                  >
                                    {isExpanded ? (
                                      <ChevronUp size={20} className="text-amber-600" />
                                    ) : (
                                      <ChevronDown size={20} className="text-gray-500 hover:text-amber-600" />
                                    )}
                                  </button>
                                )}
                                
                                {selectionMode === "pick" && allGamesExpanded && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (expandedGame === gameIndex) {
                                        setExpandedGame(null);
                                      } else {
                                        setExpandedGame(gameIndex);
                                      }
                                    }}
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110 transform-gpu"
                                  >
                                    {isExpanded ? (
                                      <ChevronUp size={20} className="text-amber-600" />
                                    ) : (
                                      <ChevronDown size={20} className="text-gray-500 hover:text-amber-600" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Expanded Content - Number Selection Grid */}
                          {selectionMode === "pick" && isExpanded && (
                            <div className="p-6 border-t border-gray-100 bg-gradient-to-br from-amber-50/30 to-white transform-gpu" style={{ transform: 'rotateX(1deg)' }}>
                              {/* Numbers 1-35 Grid */}
                              <div className="mb-6">
                                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                  <span className="w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full shadow-md shadow-amber-200 animate-pulse-slow"></span>
                                  Select 7 numbers (1-35)
                                </p>
                                <div className="grid grid-cols-7 sm:grid-cols-10 gap-3">
                                  {Array.from({ length: 35 }, (_, i) => i + 1).map((num) => {
                                    const isSelected = currentNumbers.includes(num);
                                    
                                    return (
                                      <button
                                        key={num}
                                        onClick={() => toggleNumber(gameIndex, num)}
                                        onMouseEnter={() => setHoveredNumber(num)}
                                        onMouseLeave={() => setHoveredNumber(null)}
                                        className={`h-12 rounded-full font-semibold transition-all duration-300 text-sm transform-gpu ${
                                          isSelected
                                            ? "bg-gradient-to-br from-amber-400 to-yellow-400 text-white shadow-2xl shadow-amber-200 scale-110 translate-z-10"
                                            : "bg-white hover:bg-gray-100 text-gray-700 hover:scale-110 hover:translate-z-10 border-2 border-gray-200 hover:border-amber-300"
                                        } ${hoveredNumber === num ? 'scale-110 translate-z-10 shadow-2xl' : ''}`}
                                        style={{ transform: isSelected ? 'rotateY(5deg)' : 'rotateY(0)' }}
                                      >
                                        {num}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Powerball 1-20 Grid */}
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                  <span className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-300 rounded-full shadow-md shadow-red-200 animate-pulse-slow"></span>
                                  Select Powerball (1-20)
                                </p>
                                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
                                    const isSelected = currentPowerball === num;
                                    
                                    return (
                                      <button
                                        key={num}
                                        onClick={() => togglePowerball(gameIndex, num)}
                                        onMouseEnter={() => setHoveredNumber(num)}
                                        onMouseLeave={() => setHoveredNumber(null)}
                                        className={`h-12 rounded-full font-semibold transition-all duration-300 text-sm transform-gpu ${
                                          isSelected
                                            ? "bg-gradient-to-br from-red-600 to-red-400 text-white shadow-2xl shadow-red-200 scale-110 translate-z-10"
                                            : "bg-white hover:bg-red-50 text-red-600 border-2 border-red-200 hover:border-red-400 hover:scale-110 hover:translate-z-10"
                                        } ${hoveredNumber === num ? 'scale-110 translate-z-10 shadow-2xl' : ''}`}
                                        style={{ transform: isSelected ? 'rotateY(-5deg)' : 'rotateY(0)' }}
                                      >
                                        {num}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-lg border-2 border-gray-100">
                      <p className="text-gray-500">No games available. Please select a game package first.</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {games.length > 0 && (
                  <div className="flex flex-wrap justify-between items-center gap-4 mt-6">
                    <button
                      onClick={handleReshuffleAll}
                      className="text-amber-600 hover:text-amber-800 font-medium flex items-center gap-2 px-6 py-3 hover:bg-amber-50 rounded-xl transition-all duration-300 border-2 border-amber-100 hover:border-amber-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 transform-gpu group"
                    >
                      <Shuffle size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                      Reshuffle All
                    </button>
                    <p className="text-sm text-gray-400 bg-white px-5 py-2.5 rounded-full border-2 border-gray-100 shadow-lg flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                      {games.length} games • {selectionMode === "quickpick" ? "QuickPick" : "Pick your numbers"} mode
                      {selectionMode === "pick" && (
                        <span className="ml-2 text-green-600 font-medium">
                          • {games.filter(g => g.selectedNumbers?.length === 7 && g.selectedPowerball).length}/{games.length} complete
                        </span>
                      )}
                      {selectionMode === "quickpick" && (
                        <span className="ml-2 text-green-600 font-medium">
                          • {games.filter(g => g.numbers?.length === 7 && g.powerball).length}/{games.length} complete
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ===== STEP 5: AUTOPLAY ===== */}
        {selectedCount && allGamesFilled && selectionMode !== null && games.length > 0 && (
          <div className="mt-10 transform-gpu hover:translate-z-10 transition-transform duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-white flex items-center justify-center font-bold text-xl shadow-2xl shadow-amber-200 transform-gpu rotate-3d hover:rotate-0 transition-transform duration-300" style={{ transform: 'rotateY(10deg) rotateX(5deg)' }}>
                5
              </div>
              <div>
                <h3 className="font-bold text-2xl text-gray-800">
                  Play more than once?
                </h3>
                <p className="text-gray-500">
                  Optional. Play for multiple draws
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-amber-200 transition-all duration-500 transform-gpu hover:shadow-2xl hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <button
                    onClick={() => setAutoPlay(!autoPlay)}
                    className={`w-full p-5 rounded-xl border-2 transition-all duration-500 flex items-center justify-center gap-3 transform-gpu ${
                      autoPlay
                        ? "border-amber-400 bg-gradient-to-br from-amber-50 to-white shadow-2xl shadow-amber-100 scale-[1.02] translate-z-10"
                        : "border-gray-200 hover:border-amber-300 hover:shadow-2xl hover:-translate-y-1 bg-white"
                    }`}
                  >
                    <Play size={22} className={autoPlay ? "text-amber-600" : "text-gray-500"} />
                    <span className={`font-semibold ${autoPlay ? 'text-amber-700' : 'text-gray-700'}`}>AutoPlay</span>
                    <span className="text-sm text-gray-500">Cancel anytime</span>
                  </button>
                </div>

                {autoPlay && (
                  <div className="flex-1 flex flex-col gap-3">
                    <label className="text-sm font-medium text-gray-700">
                      Play for multiple draws
                    </label>
                    <div className="flex gap-3">
                      {[2, 5, 10].map((num) => (
                        <button
                          key={num}
                          onClick={() => setDrawCount(num)}
                          className={`flex-1 p-4 rounded-xl border-2 transition-all duration-500 transform-gpu ${
                            drawCount === num
                              ? "border-amber-400 bg-gradient-to-br from-amber-50 to-white shadow-2xl shadow-amber-100 scale-[1.02] translate-z-10"
                              : "border-gray-200 hover:border-amber-300 bg-white hover:shadow-2xl hover:-translate-y-1"
                          }`}
                        >
                          <Calendar size={18} className={`mx-auto mb-1.5 ${drawCount === num ? 'text-amber-600' : 'text-gray-500'}`} />
                          <span className={`text-sm font-medium block ${drawCount === num ? 'text-amber-700' : 'text-gray-700'}`}>
                            Next {num} draws
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-1">
                      All jackpots / draws
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== SUMMARY CARD ===== */}
        {selectedCount && allGamesFilled && selectionMode !== null && games.length > 0 && (
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 p-6 md:p-8 text-white shadow-2xl shadow-amber-200 relative overflow-hidden transform-gpu hover:translate-z-20 transition-transform duration-500" style={{ transform: 'rotateX(2deg)' }}>
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-white/90 text-sm font-medium flex items-center gap-2">
                  <Ticket size={16} /> Selected Package
                </p>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-4xl md:text-5xl font-bold drop-shadow-2xl">
                    ₹{totalPrice}
                  </span>
                  <span className="text-white/80 text-sm">/ total</span>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="text-xs bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg shadow-black/10">
                    {selectedCount.totalGames} Games
                  </span>
                  {selectedCount.label && (
                    <span className="text-xs bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg shadow-black/10">
                      {selectedCount.label}
                    </span>
                  )}
                  <span className="text-xs bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg shadow-black/10">
                    {activeTicketTitle}
                  </span>
                  {selectedGameTypeTitle && (
                    <span className="text-xs bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg shadow-black/10">
                      {selectedGameTypeTitle}
                    </span>
                  )}
                  <span className="text-xs bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg shadow-black/10 capitalize">
                    {selectionMode === "quickpick" ? "QuickPick" : "Pick your numbers"}
                  </span>
                  {autoPlay && (
                    <span className="text-xs bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg shadow-black/10">
                      {drawCount} draws
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={entryLoading}
                className="group bg-white text-amber-600 px-10 py-4 rounded-xl font-bold hover:scale-110 transition-all duration-500 w-full md:w-auto shadow-2xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform-gpu hover:translate-z-20 hover:rotate-1"
              >
                {entryLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                    Add to Cart
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== 3D CSS ===== */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        @keyframes float {
          0%, 100% { transform: rotateX(5deg) rotateY(-5deg) translateZ(50px) translateY(0); }
          50% { transform: rotateX(5deg) rotateY(-5deg) translateZ(50px) translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .rotate-3d {
          transition: transform 0.3s ease;
        }
        
        .translate-z-10 {
          transform: translateZ(10px);
        }
        .translate-z-20 {
          transform: translateZ(20px);
        }
        
        .transform-gpu {
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </div>
  );
};

export default GameSelection;