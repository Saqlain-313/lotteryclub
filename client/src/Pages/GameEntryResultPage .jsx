import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  CircleX,
  Clock,
  DollarSign,
  Eye,
  Gamepad2,
  Heart,
  Info,
  Loader2,
  Percent,
  Plus,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteGameEntry,
  getMyGameEntries,
  resetGameEntryState,
} from "../redux/slices/gameEntrySlice";

// ================= POPUP COMPONENT =================
const EntryDetailsPopup = ({
  isOpen,
  onClose,
  entry,
  loading,
  error,
  onDelete,
}) => {
  if (!isOpen) return null;

  const checkNumberMatch = (gameNumbers, winningNumbers) => {
    if (!winningNumbers || !winningNumbers.numbers || !gameNumbers) return null;

    const matches = gameNumbers.numbers.filter(
      (num) => winningNumbers.numbers && winningNumbers.numbers.includes(num),
    );

    const powerballMatch = gameNumbers.powerball === winningNumbers.powerball;

    return {
      matches: matches.length,
      powerballMatch,
      isWinner: matches.length >= 3 || (matches.length >= 2 && powerballMatch),
    };
  };

  const getGameStatistics = (games, winningNumbers, resultDeclared) => {
    if (!resultDeclared || !games || !winningNumbers) {
      return { total: 0, won: 0, lost: 0, pending: games?.length || 0 };
    }

    let won = 0;
    let lost = 0;

    games.forEach((game) => {
      const result = checkNumberMatch(game, winningNumbers);
      if (result?.isWinner) {
        won++;
      } else {
        lost++;
      }
    });

    return {
      total: games.length,
      won,
      lost,
      pending: 0,
    };
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-amber-500",
      Active: "bg-yellow-500",
      Completed: "bg-green-500",
      Cancelled: "bg-red-500",
      Won: "bg-gradient-to-r from-amber-500 to-yellow-500",
      Lost: "bg-red-600",
      Open: "bg-yellow-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: Clock,
      Active: Loader2,
      Completed: CheckCircle,
      Cancelled: CircleX,
      Won: Trophy,
      Lost: Heart,
      Open: Loader2,
    };
    return icons[status] || Info;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full border-2 border-amber-200 shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 text-amber-600" />
              </div>
            </div>
            <p className="text-gray-600 mt-4 font-medium">
              Loading entry details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full border-2 border-red-200 shadow-2xl">
          <div className="text-center">
            <div className="text-red-500 flex justify-center mb-4">
              <AlertCircle className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">
              {typeof error === "string" ? error : "Something went wrong"}
            </p>
            <button
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-yellow-600 transition shadow-lg"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full border-2 border-amber-200 shadow-2xl">
          <div className="text-center">
            <div className="text-gray-300 flex justify-center mb-4">
              <Info className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Entry Found
            </h3>
            <p className="text-gray-600 mb-4">
              The requested entry could not be found.
            </p>
            <button
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-yellow-600 transition shadow-lg"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = entry.poolStatus || entry.playerStatus || "Pending";
  const drawNo = entry.drawNo || "N/A";
  const totalAmount = entry.totalAmount || 0;
  const totalPlayers = entry.totalPlayers || 0;
  const games = entry.games || [];
  const winningNumbers = entry.winningNumbers || {
    numbers: [],
    powerball: null,
  };
  const resultDeclared = entry.resultDeclared || false;
  const StatusIcon = getStatusIcon(status);

  const stats = getGameStatistics(games, winningNumbers, resultDeclared);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto relative border-2 border-amber-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="sticky top-0 float-right m-3 w-12 h-12 bg-white rounded-full shadow-lg hover:bg-amber-50 transition flex items-center justify-center text-gray-600 hover:text-amber-600 z-10 border-2 border-amber-200"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-5 pt-0 pb-20">
          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-white rounded-2xl p-5 mb-5 border-2 border-amber-200 shadow-inner">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 pb-4 border-b-2 border-amber-200">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Target className="w-7 h-7 text-amber-600" />
                Entry #{drawNo}
              </h2>
              <div
                className={`px-4 py-2 rounded-full text-white font-bold text-sm mt-2 sm:mt-0 shadow-lg flex items-center gap-2 ${getStatusColor(status)}`}
              >
                <StatusIcon className="w-4 h-4" />
                {status}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="bg-white rounded-xl p-3 shadow-md border border-amber-100">
                <div className="text-xs text-amber-600 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Total Amount
                </div>
                <div className="font-bold text-amber-600 text-lg">
                  ${totalAmount.toFixed(2)}
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-md border border-amber-100">
                <div className="text-xs text-amber-600 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3 h-3" /> Total Players
                </div>
                <div className="font-bold text-gray-800 text-lg">
                  {totalPlayers}
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-md border border-amber-100">
                <div className="text-xs text-amber-600 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Gamepad2 className="w-3 h-3" /> Total Games
                </div>
                <div className="font-bold text-gray-800 text-lg">
                  {stats.total}
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-md border border-amber-100">
                <div className="text-xs text-amber-600 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Created
                </div>
                <div className="font-bold text-gray-800 text-sm">
                  {entry.createdAt
                    ? new Date(entry.createdAt).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
            </div>

            {resultDeclared && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-4 text-center border-2 border-amber-400 shadow-lg">
                  <Trophy className="w-8 h-8 text-amber-600 mx-auto mb-1" />
                  <div className="text-3xl font-bold text-amber-600">
                    {stats.won}
                  </div>
                  <div className="text-sm text-amber-700 font-bold">Won</div>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 text-center border-2 border-red-300 shadow-lg">
                  <Heart className="w-8 h-8 text-red-600 mx-auto mb-1" />
                  <div className="text-3xl font-bold text-red-600">
                    {stats.lost}
                  </div>
                  <div className="text-sm text-red-700 font-bold">Lost</div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 text-center border-2 border-blue-300 shadow-lg">
                  <Percent className="w-8 h-8 text-blue-600 mx-auto mb-1" />
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.total > 0
                      ? Math.round((stats.won / stats.total) * 100)
                      : 0}
                    %
                  </div>
                  <div className="text-sm text-blue-700 font-bold">
                    Win Rate
                  </div>
                </div>
              </div>
            )}

            {!resultDeclared && (
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-400 rounded-xl p-4 mb-4 text-center shadow-lg">
                <div className="text-amber-700 font-bold text-lg flex items-center justify-center gap-2">
                  <Clock className="w-6 h-6 animate-pulse" />
                  Results pending - Check back later!
                </div>
              </div>
            )}

            {entry.currencyDetails && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 mb-4 border border-blue-200">
                <div className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">
                  Currency Details
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span>
                    <strong>USD:</strong> ${entry.currencyDetails.usdAmount}
                  </span>
                  <span>
                    <strong>Local:</strong>{" "}
                    {entry.currencyDetails.localCurrency}{" "}
                    {entry.currencyDetails.localAmount}
                  </span>
                  <span>
                    <strong>Rate:</strong> 1 USD ={" "}
                    {entry.currencyDetails.exchangeRate}{" "}
                    {entry.currencyDetails.localCurrency}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition shadow-md flex items-center gap-2 justify-center"
                onClick={onClose}
              >
                <X className="w-4 h-4" /> Close
              </button>
              <button
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition shadow-lg flex items-center gap-2 justify-center"
                onClick={() => onDelete(entry.poolId)}
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>

          {resultDeclared &&
            winningNumbers &&
            winningNumbers.numbers &&
            winningNumbers.numbers.length > 0 && (
              <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 rounded-2xl p-6 mb-5 text-white shadow-2xl border-2 border-amber-400">
                <h3 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
                  <Target className="w-7 h-7" /> Winning Numbers
                </h3>
                <div className="flex justify-center items-center gap-3 flex-wrap">
                  {winningNumbers.numbers.map((num) => (
                    <div
                      key={num}
                      className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold shadow-lg border-2 border-white/30 backdrop-blur-sm"
                    >
                      {num}
                    </div>
                  ))}
                  <div className="px-6 py-3 bg-white/30 rounded-full text-lg font-bold backdrop-blur-sm border-2 border-white/30 shadow-lg flex items-center gap-2">
                    <Zap className="w-5 h-5" /> PB: {winningNumbers.powerball}
                  </div>
                </div>
                {entry.updatedAt && (
                  <div className="text-center mt-3 opacity-90 text-sm">
                    Results declared:{" "}
                    {new Date(entry.updatedAt).toLocaleString()}
                  </div>
                )}
              </div>
            )}

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-amber-600" />
              Game Results
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({stats.total} games • {stats.won} won • {stats.lost} lost)
              </span>
            </h3>

            {!games || games.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <Info className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                No games found for this entry
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {games.map((game, index) => {
                  const matchResult = resultDeclared
                    ? checkNumberMatch(game, winningNumbers)
                    : null;
                  const isWinner = matchResult?.isWinner || false;
                  const matchedCount = matchResult?.matches || 0;
                  const powerballMatch = matchResult?.powerballMatch || false;

                  return (
                    <div
                      key={index}
                      className={`rounded-2xl p-5 border-2 transition-all shadow-lg ${
                        !resultDeclared
                          ? "bg-gray-50 border-gray-300"
                          : isWinner
                            ? "bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-amber-500 shadow-amber-200"
                            : "bg-gradient-to-br from-red-50 to-red-100 border-red-300"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-gray-800">
                          Game #{game.gameNo || index + 1}
                        </span>
                        {resultDeclared && (
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-bold text-white shadow-lg flex items-center gap-1 ${
                                isWinner
                                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 animate-pulse"
                                  : "bg-red-500"
                              }`}
                            >
                              {isWinner ? (
                                <Trophy className="w-3 h-3" />
                              ) : (
                                <Heart className="w-3 h-3" />
                              )}
                              {isWinner ? "Winner" : "Lost"}
                            </span>
                          </div>
                        )}
                        {!resultDeclared && (
                          <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {game.numbers?.map((num) => {
                          const isMatched =
                            resultDeclared &&
                            winningNumbers?.numbers?.includes(num);
                          return (
                            <div
                              key={num}
                              className={`w-11 h-11 rounded-full flex items-center justify-center font-bold shadow-md ${
                                isMatched
                                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white transform scale-110 shadow-lg border-2 border-amber-300"
                                  : "bg-white text-gray-700 border-2 border-gray-200"
                              }`}
                            >
                              {num}
                            </div>
                          );
                        })}
                        <div
                          className={`px-4 py-2 rounded-full font-bold shadow-md flex items-center gap-1 ${
                            resultDeclared &&
                            winningNumbers?.powerball === game.powerball
                              ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg border-2 border-amber-300"
                              : "bg-white text-gray-700 border-2 border-gray-200"
                          }`}
                        >
                          <Zap className="w-3 h-3" /> PB: {game.powerball}
                        </div>
                      </div>

                      {resultDeclared && matchResult && (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-3 text-sm">
                            <span className="bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-200 flex items-center gap-1">
                              <Target className="w-3 h-3" /> Matches:{" "}
                              <strong
                                className={
                                  matchedCount > 0
                                    ? "text-amber-600"
                                    : "text-gray-600"
                                }
                              >
                                {matchedCount}/7
                              </strong>
                            </span>
                            <span className="bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-200 flex items-center gap-1">
                              <Zap className="w-3 h-3" /> Powerball:{" "}
                              <strong
                                className={
                                  powerballMatch
                                    ? "text-amber-600"
                                    : "text-red-600"
                                }
                              >
                                {powerballMatch ? "Hit!" : "Miss"}
                              </strong>
                            </span>
                          </div>

                          {isWinner && (
                            <div className="mt-2 p-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl text-center font-bold text-amber-800 animate-pulse border-2 border-amber-400 shadow-lg">
                              <Trophy className="w-6 h-6 inline-block mr-2" />
                              Congratulations! You won!
                              <div className="text-sm font-normal text-amber-700">
                                Estimated Prize: $
                                {(
                                  (totalAmount * 0.7) /
                                    games.filter((g) => {
                                      const r = checkNumberMatch(
                                        g,
                                        winningNumbers,
                                      );
                                      return r?.isWinner;
                                    }).length || 1
                                ).toFixed(2)}
                              </div>
                            </div>
                          )}

                          {!isWinner && matchedCount > 0 && (
                            <div className="mt-2 p-2 bg-white/70 rounded-xl text-center text-sm text-gray-600 border border-gray-200">
                              You matched {matchedCount} number
                              {matchedCount !== 1 ? "s" : ""}
                              {powerballMatch && " and the Powerball"}
                              {matchedCount === 1 &&
                                !powerballMatch &&
                                " - Need at least 2 matches or 1 + Powerball to win"}
                            </div>
                          )}

                          {!isWinner && matchedCount === 0 && (
                            <div className="mt-2 p-2 bg-white/70 rounded-xl text-center text-sm text-gray-500 border border-gray-200">
                              No matches this time. Better luck next time!
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {resultDeclared && stats.total > 0 && (
            <div className="mt-5 p-5 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-xl border-2 border-amber-300 shadow-lg">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-amber-600" /> Overall Summary
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="bg-white rounded-lg p-2 shadow-md text-center">
                  <span className="text-gray-500 block">Total Games</span>
                  <span className="font-bold text-amber-600 text-lg">
                    {stats.total}
                  </span>
                </div>
                <div className="bg-white rounded-lg p-2 shadow-md text-center">
                  <span className="text-gray-500 block">Won</span>
                  <span className="font-bold text-green-600 text-lg">
                    {stats.won}
                  </span>
                </div>
                <div className="bg-white rounded-lg p-2 shadow-md text-center">
                  <span className="text-gray-500 block">Lost</span>
                  <span className="font-bold text-red-600 text-lg">
                    {stats.lost}
                  </span>
                </div>
                <div className="bg-white rounded-lg p-2 shadow-md text-center">
                  <span className="text-gray-500 block">Win Rate</span>
                  <span className="font-bold text-amber-600 text-lg">
                    {Math.round((stats.won / stats.total) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ================= DELETE CONFIRMATION POPUP =================
const DeleteConfirmationPopup = ({ isOpen, onClose, onConfirm, entryId }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-amber-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-red-500 flex justify-center mb-4">
            <Trash2 className="w-16 h-16" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Confirm Delete
          </h3>
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete this entry?
          </p>
          <p className="text-red-500 font-bold mb-6">
            This action cannot be undone.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition shadow-md flex items-center gap-2"
              onClick={onClose}
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition shadow-lg flex items-center gap-2"
              onClick={() => onConfirm(entryId)}
            >
              <Trash2 className="w-4 h-4" /> Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= MAIN PAGE COMPONENT =================
const GameEntryResultPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { entries, loading, error } = useSelector((state) => state.gameEntry);
  const { user } = useSelector((state) => state.auth);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showEntryModal, setShowEntryModal] = useState(false);

  useEffect(() => {
    dispatch(getMyGameEntries());

    return () => {
      dispatch(resetGameEntryState());
    };
  }, [dispatch]);

  const handleDelete = async (entryId) => {
    setDeleteId(entryId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await dispatch(deleteGameEntry(deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
      setShowEntryModal(false);
      setSelectedEntry(null);
      dispatch(getMyGameEntries());
    }
  };

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
    setShowEntryModal(true);
  };

  const handleCloseModal = () => {
    setShowEntryModal(false);
    setSelectedEntry(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-amber-500",
      Active: "bg-yellow-500",
      Completed: "bg-green-500",
      Cancelled: "bg-red-500",
      Won: "bg-gradient-to-r from-amber-500 to-yellow-500",
      Lost: "bg-red-600",
      Open: "bg-yellow-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: Clock,
      Active: Loader2,
      Completed: CheckCircle,
      Cancelled: CircleX,
      Won: Trophy,
      Lost: Heart,
      Open: Loader2,
    };
    return icons[status] || Info;
  };

  const renderEntriesList = () => {
    if (!entries || entries.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-amber-200 shadow-xl">
          <div className="text-gray-300 flex justify-center mb-4">
            <Gamepad2 className="w-20 h-20" />
          </div>
          <p className="text-gray-500 text-lg font-medium">
            No game entries found
          </p>
          <button
            className="mt-6 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-2xl font-bold hover:from-amber-600 hover:to-yellow-600 transition shadow-xl text-lg flex items-center gap-2 mx-auto"
            onClick={() => navigate("/create-game-entry")}
          >
            <Plus className="w-5 h-5" /> Create New Entry
          </button>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Target className="w-7 h-7 text-amber-600" /> My Game Entries
          </h2>
          <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full font-bold text-sm shadow-md flex items-center gap-1">
            <Gamepad2 className="w-4 h-4" /> {entries.length} entries
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => {
            const status = entry.poolStatus || entry.playerStatus || "Pending";
            const entryId = entry.poolId;
            const isResultDeclared = entry.resultDeclared || false;
            const games = entry.games || [];
            const winningNumbers = entry.winningNumbers || {
              numbers: [],
              powerball: null,
            };
            const StatusIcon = getStatusIcon(status);

            let wonCount = 0;
            let lostCount = 0;
            if (isResultDeclared && games.length > 0) {
              games.forEach((game) => {
                const matches = game.numbers.filter(
                  (num) =>
                    winningNumbers.numbers &&
                    winningNumbers.numbers.includes(num),
                );
                const powerballMatch =
                  game.powerball === winningNumbers.powerball;
                if (
                  matches.length >= 3 ||
                  (matches.length >= 2 && powerballMatch)
                ) {
                  wonCount++;
                } else {
                  lostCount++;
                }
              });
            }

            return (
              <div
                key={entryId}
                className={`bg-white rounded-2xl shadow-xl border-2 hover:shadow-2xl transition-all cursor-pointer p-5 hover:scale-[1.02] ${
                  isResultDeclared
                    ? wonCount > 0
                      ? "border-amber-400"
                      : "border-red-400"
                    : "border-amber-400"
                }`}
                onClick={() => handleEntryClick(entry)}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-gray-800 text-lg flex items-center gap-1">
                    <Target className="w-4 h-4 text-amber-600" /> Draw #
                    {entry.drawNo || "N/A"}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1 ${getStatusColor(status)}`}
                  >
                    <StatusIcon className="w-3 h-3" /> {status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-amber-50 rounded-xl p-2 text-center border border-amber-100">
                    <div className="text-xs text-amber-600 font-semibold flex items-center justify-center gap-1">
                      <DollarSign className="w-3 h-3" /> Amount
                    </div>
                    <div className="font-bold text-amber-600">
                      ${(entry.totalAmount || 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-2 text-center border border-amber-100">
                    <div className="text-xs text-amber-600 font-semibold flex items-center justify-center gap-1">
                      <Users className="w-3 h-3" /> Players
                    </div>
                    <div className="font-bold text-gray-800">
                      {entry.totalPlayers || 0}
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-2 text-center border border-amber-100">
                    <div className="text-xs text-amber-600 font-semibold flex items-center justify-center gap-1">
                      <Gamepad2 className="w-3 h-3" /> Games
                    </div>
                    <div className="font-bold text-gray-800">
                      {entry.games?.length || 0}
                    </div>
                  </div>
                </div>

                {isResultDeclared && (
                  <div className="mb-3 flex gap-2 text-xs justify-center">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 rounded-full font-bold flex items-center gap-1 shadow-sm">
                      <Trophy className="w-3 h-3" /> {wonCount}
                    </span>
                    <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full font-bold flex items-center gap-1 shadow-sm">
                      <Heart className="w-3 h-3" /> {lostCount}
                    </span>
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-bold flex items-center gap-1 shadow-sm">
                      <Percent className="w-3 h-3" />{" "}
                      {Math.round(
                        (wonCount / (wonCount + lostCount || 1)) * 100,
                      )}
                      %
                    </span>
                  </div>
                )}

                {!entry.resultDeclared && (
                  <div className="mb-3 p-2 bg-amber-100 rounded-xl text-xs text-amber-700 text-center font-bold border border-amber-300 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 animate-pulse" /> Results
                    pending...
                  </div>
                )}

                <button
                  className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-yellow-600 transition shadow-lg text-sm flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEntryClick(entry);
                  }}
                >
                  <Eye className="w-4 h-4" /> View Results{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-white py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <Gamepad2 className="w-10 h-10 text-amber-600" />
            Game Entry Results
          </h1>
          <p className="text-amber-600 mt-1 font-medium flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" /> View and manage all your game
            entries
          </p>
        </div>

        {error && !showEntryModal && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 shadow-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {typeof error === "string" ? error : "Something went wrong"}
          </div>
        )}

        {renderEntriesList()}

        <EntryDetailsPopup
          isOpen={showEntryModal}
          onClose={handleCloseModal}
          entry={selectedEntry}
          loading={loading}
          error={error}
          onDelete={handleDelete}
        />

        <DeleteConfirmationPopup
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          entryId={deleteId}
        />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default GameEntryResultPage;
