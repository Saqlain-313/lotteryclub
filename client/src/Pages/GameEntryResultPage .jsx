import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getMyGameEntries,
  deleteGameEntry,
  resetGameEntryState
} from '../redux/slices/gameEntrySlice';

// ================= POPUP COMPONENT =================
const EntryDetailsPopup = ({ 
  isOpen, 
  onClose, 
  entry, 
  loading, 
  error,
  onDelete
}) => {
  if (!isOpen) return null;

  // Check number matches
  const checkNumberMatch = (gameNumbers, winningNumbers) => {
    if (!winningNumbers || !winningNumbers.numbers || !gameNumbers) return null;
    
    const matches = gameNumbers.numbers.filter(num => 
      winningNumbers.numbers && winningNumbers.numbers.includes(num)
    );
    
    const powerballMatch = gameNumbers.powerball === winningNumbers.powerball;
    
    return {
      matches: matches.length,
      powerballMatch,
      isWinner: matches.length >= 3 || (matches.length >= 2 && powerballMatch)
    };
  };

  // Get game statistics
  const getGameStatistics = (games, winningNumbers, resultDeclared) => {
    if (!resultDeclared || !games || !winningNumbers) {
      return { total: 0, won: 0, lost: 0, pending: games?.length || 0 };
    }

    let won = 0;
    let lost = 0;

    games.forEach(game => {
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
      pending: 0
    };
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-500',
      'Active': 'bg-blue-500',
      'Completed': 'bg-green-500',
      'Cancelled': 'bg-red-500',
      'Won': 'bg-green-600',
      'Lost': 'bg-red-600',
      'Open': 'bg-blue-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      'Pending': '⏳',
      'Active': '🔄',
      'Completed': '✅',
      'Cancelled': '❌',
      'Won': '🏆',
      'Lost': '💔',
      'Open': '🔄'
    };
    return icons[status] || '📌';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading entry details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{typeof error === 'string' ? error : 'Something went wrong'}</p>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-gray-400 text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Entry Found</h3>
            <p className="text-gray-600 mb-4">The requested entry could not be found.</p>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = entry.poolStatus || entry.playerStatus || 'Pending';
  const drawNo = entry.drawNo || 'N/A';
  const totalAmount = entry.totalAmount || 0;
  const totalPlayers = entry.totalPlayers || 0;
  const games = entry.games || [];
  const winningNumbers = entry.winningNumbers || { numbers: [], powerball: null };
  const resultDeclared = entry.resultDeclared || false;

  // Get statistics
  const stats = getGameStatistics(games, winningNumbers, resultDeclared);

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          className="sticky top-0 float-right m-4 w-10 h-10 bg-white rounded-full shadow-lg hover:bg-gray-100 transition flex items-center justify-center text-2xl text-gray-600 hover:text-gray-900 z-10"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="p-6 pt-0">
          {/* Entry Details */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                Entry #{drawNo}
              </h2>
              <div className={`px-4 py-2 rounded-full text-white font-semibold text-sm mt-2 sm:mt-0 ${getStatusColor(status)}`}>
                {getStatusIcon(status)} {status}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Total Amount</div>
                <div className="font-semibold text-green-600">${totalAmount.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Total Players</div>
                <div className="font-semibold text-gray-800">{totalPlayers}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Total Games</div>
                <div className="font-semibold text-gray-800">{stats.total}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Created</div>
                <div className="font-semibold text-gray-800">
                  {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>

            {/* Win/Loss Statistics */}
            {resultDeclared && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 text-center border-2 border-green-300">
                  <div className="text-3xl font-bold text-green-600">🏆</div>
                  <div className="text-2xl font-bold text-green-600">{stats.won}</div>
                  <div className="text-sm text-green-700 font-semibold">Won</div>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 text-center border-2 border-red-300">
                  <div className="text-3xl font-bold text-red-600">💔</div>
                  <div className="text-2xl font-bold text-red-600">{stats.lost}</div>
                  <div className="text-sm text-red-700 font-semibold">Lost</div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center border-2 border-blue-300">
                  <div className="text-3xl font-bold text-blue-600">📊</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0}%
                  </div>
                  <div className="text-sm text-blue-700 font-semibold">Win Rate</div>
                </div>
              </div>
            )}

            {!resultDeclared && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4 text-center">
                <div className="text-yellow-600 font-semibold">⏳ Results pending - Check back later!</div>
              </div>
            )}

            {/* Currency Details */}
            {entry.currencyDetails && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <div className="text-xs text-gray-500 mb-1">Currency Details</div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span><strong>USD:</strong> ${entry.currencyDetails.usdAmount}</span>
                  <span><strong>Local:</strong> {entry.currencyDetails.localCurrency} {entry.currencyDetails.localAmount}</span>
                  <span><strong>Rate:</strong> 1 USD = {entry.currencyDetails.exchangeRate} {entry.currencyDetails.localCurrency}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                onClick={onClose}
              >
                ← Close
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                onClick={() => onDelete(entry.poolId)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          {/* Winning Numbers */}
          {resultDeclared && winningNumbers && winningNumbers.numbers && winningNumbers.numbers.length > 0 && (
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 mb-6 text-white">
              <h3 className="text-xl font-bold text-center mb-4">🎯 Winning Numbers</h3>
              <div className="flex justify-center items-center gap-3 flex-wrap">
                {winningNumbers.numbers.map((num) => (
                  <div 
                    key={num} 
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold"
                  >
                    {num}
                  </div>
                ))}
                <div className="px-6 py-2 bg-white/30 rounded-full text-lg font-bold">
                  PB: {winningNumbers.powerball}
                </div>
              </div>
              {entry.updatedAt && (
                <div className="text-center mt-3 opacity-80 text-sm">
                  Results declared: {new Date(entry.updatedAt).toLocaleString()}
                </div>
              )}
            </div>
          )}

          {/* Game Results */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Game Results
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({stats.total} games • {stats.won} won • {stats.lost} lost)
              </span>
            </h3>
            
            {!games || games.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No games found for this entry
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {games.map((game, index) => {
                  const matchResult = resultDeclared ? checkNumberMatch(game, winningNumbers) : null;
                  const isWinner = matchResult?.isWinner || false;
                  const matchedCount = matchResult?.matches || 0;
                  const powerballMatch = matchResult?.powerballMatch || false;

                  return (
                    <div 
                      key={index} 
                      className={`rounded-lg p-4 border-2 transition-all ${
                        !resultDeclared ? 'bg-gray-50 border-gray-300' :
                        isWinner ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-500 shadow-lg' : 
                        'bg-gradient-to-r from-red-50 to-red-100 border-red-300'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-800">Game #{game.gameNo || index + 1}</span>
                        {resultDeclared && (
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                              isWinner ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                            }`}>
                              {isWinner ? '🏆 Winner' : '❌ Lost'}
                            </span>
                          </div>
                        )}
                        {!resultDeclared && (
                          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500 text-white">
                            ⏳ Pending
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {game.numbers?.map((num) => {
                          const isMatched = resultDeclared && winningNumbers?.numbers?.includes(num);
                          return (
                            <div 
                              key={num} 
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                                isMatched
                                  ? 'bg-green-500 text-white shadow-lg transform scale-110'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {num}
                            </div>
                          );
                        })}
                        <div className={`px-4 py-2 rounded-full font-semibold ${
                          resultDeclared && winningNumbers?.powerball === game.powerball
                            ? 'bg-green-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          PB: {game.powerball}
                        </div>
                      </div>

                      {resultDeclared && matchResult && (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="bg-white px-3 py-1 rounded-full shadow-sm">
                              🎯 Matches: <strong className={matchedCount > 0 ? 'text-green-600' : 'text-gray-600'}>
                                {matchedCount}/7
                              </strong>
                            </span>
                            <span className="bg-white px-3 py-1 rounded-full shadow-sm">
                              ⚡ Powerball: <strong className={powerballMatch ? 'text-green-600' : 'text-red-600'}>
                                {powerballMatch ? '✓ Hit!' : '✗ Miss'}
                              </strong>
                            </span>
                          </div>

                          {isWinner && (
                            <div className="mt-2 p-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg text-center font-semibold text-yellow-800 animate-pulse">
                              🎉 Congratulations! You won!
                              <div className="text-sm font-normal">
                                Estimated Prize: ${(totalAmount * 0.7 / games.filter(g => {
                                  const r = checkNumberMatch(g, winningNumbers);
                                  return r?.isWinner;
                                }).length || 1).toFixed(2)}
                              </div>
                            </div>
                          )}

                          {!isWinner && matchedCount > 0 && (
                            <div className="mt-2 p-2 bg-white/50 rounded-lg text-center text-sm text-gray-600">
                              You matched {matchedCount} number{matchedCount !== 1 ? 's' : ''}
                              {powerballMatch && ' and the Powerball'}
                              {matchedCount === 1 && !powerballMatch && ' - Need at least 2 matches or 1 + Powerball to win'}
                            </div>
                          )}

                          {!isWinner && matchedCount === 0 && (
                            <div className="mt-2 p-2 bg-white/50 rounded-lg text-center text-sm text-gray-500">
                              No matches this time. Better luck next time! 🍀
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

          {/* Overall Summary */}
          {resultDeclared && stats.total > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-2">📊 Overall Summary</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Total Games:</span>
                  <span className="font-bold ml-2">{stats.total}</span>
                </div>
                <div>
                  <span className="text-gray-500">Won:</span>
                  <span className="font-bold text-green-600 ml-2">{stats.won}</span>
                </div>
                <div>
                  <span className="text-gray-500">Lost:</span>
                  <span className="font-bold text-red-600 ml-2">{stats.lost}</span>
                </div>
                <div>
                  <span className="text-gray-500">Win Rate:</span>
                  <span className="font-bold text-blue-600 ml-2">
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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl max-w-md w-full p-6 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🗑️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Delete</h3>
          <p className="text-gray-600 mb-2">Are you sure you want to delete this entry?</p>
          <p className="text-red-500 font-semibold mb-6">This action cannot be undone.</p>
          
          <div className="flex gap-3 justify-center">
            <button 
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              onClick={() => onConfirm(entryId)}
            >
              Yes, Delete
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

  // Local state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showEntryModal, setShowEntryModal] = useState(false);

  // Fetch entries on load
  useEffect(() => {
    dispatch(getMyGameEntries());
    
    return () => {
      dispatch(resetGameEntryState());
    };
  }, [dispatch]);

  // Handle delete
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

  // Handle entry click - open modal
  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
    setShowEntryModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowEntryModal(false);
    setSelectedEntry(null);
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-500',
      'Active': 'bg-blue-500',
      'Completed': 'bg-green-500',
      'Cancelled': 'bg-red-500',
      'Won': 'bg-green-600',
      'Lost': 'bg-red-600',
      'Open': 'bg-blue-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      'Pending': '⏳',
      'Active': '🔄',
      'Completed': '✅',
      'Cancelled': '❌',
      'Won': '🏆',
      'Lost': '💔',
      'Open': '🔄'
    };
    return icons[status] || '📌';
  };

  // ================= RENDER ENTRIES LIST =================
  const renderEntriesList = () => {
    if (!entries || entries.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎮</div>
          <p className="text-gray-500 text-lg">No game entries found</p>
          <button 
            className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-md"
            onClick={() => navigate('/create-game-entry')}
          >
            + Create New Entry
          </button>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Game Entries</h2>
          <span className="text-sm text-gray-500">{entries.length} entries</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => {
            const status = entry.poolStatus || entry.playerStatus || 'Pending';
            const entryId = entry.poolId;
            const isResultDeclared = entry.resultDeclared || false;
            const games = entry.games || [];
            const winningNumbers = entry.winningNumbers || { numbers: [], powerball: null };
            
            // Calculate win/loss for card preview
            let wonCount = 0;
            let lostCount = 0;
            if (isResultDeclared && games.length > 0) {
              games.forEach(game => {
                const matches = game.numbers.filter(num => 
                  winningNumbers.numbers && winningNumbers.numbers.includes(num)
                );
                const powerballMatch = game.powerball === winningNumbers.powerball;
                if (matches.length >= 3 || (matches.length >= 2 && powerballMatch)) {
                  wonCount++;
                } else {
                  lostCount++;
                }
              });
            }

            return (
              <div 
                key={entryId} 
                className={`bg-white rounded-xl shadow-sm border-2 hover:shadow-lg transition-all cursor-pointer p-4 hover:scale-[1.02] ${
                  isResultDeclared ? 
                    wonCount > 0 ? 'border-green-400' : 'border-red-400' 
                    : 'border-yellow-400'
                }`}
                onClick={() => handleEntryClick(entry)}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-gray-800">Draw #{entry.drawNo || 'N/A'}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(status)}`}>
                    {getStatusIcon(status)} {status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div>
                    <div className="text-xs text-gray-500">Amount</div>
                    <div className="font-semibold">${(entry.totalAmount || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Players</div>
                    <div className="font-semibold">{entry.totalPlayers || 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Games</div>
                    <div className="font-semibold">{entry.games?.length || 0}</div>
                  </div>
                </div>

                {/* Win/Loss preview on card */}
                {isResultDeclared && (
                  <div className="mb-2 flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                      🏆 {wonCount}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full flex items-center gap-1">
                      💔 {lostCount}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {Math.round((wonCount / (wonCount + lostCount || 1)) * 100)}% Win
                    </span>
                  </div>
                )}

                {!entry.resultDeclared && (
                  <div className="mb-2 p-1 bg-yellow-100 rounded text-xs text-yellow-700 text-center">
                    ⏳ Results pending...
                  </div>
                )}

                <button 
                  className="w-full mt-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded hover:from-blue-600 hover:to-blue-700 transition shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEntryClick(entry);
                  }}
                >
                  View Results →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ================= MAIN RENDER =================
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            🎮 Game Entry Results
          </h1>
          <p className="text-gray-500 mt-1">
            View and manage all your game entries
          </p>
        </div>

        {/* Error */}
        {error && !showEntryModal && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {typeof error === 'string' ? error : 'Something went wrong'}
          </div>
        )}

        {/* Entries List */}
        {renderEntriesList()}

        {/* Entry Details Popup */}
        <EntryDetailsPopup
          isOpen={showEntryModal}
          onClose={handleCloseModal}
          entry={selectedEntry}
          loading={loading}
          error={error}
          onDelete={handleDelete}
        />

        {/* Delete Confirmation Popup */}
        <DeleteConfirmationPopup
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          entryId={deleteId}
        />
      </div>

      {/* Add CSS animations */}
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
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default GameEntryResultPage;