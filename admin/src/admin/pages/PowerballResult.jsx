import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createPowerballResult,
    getAllPowerballResults,
    clearPowerballResultState,
    deletePowerballResult,
    getAllPendingGames,
    clearPendingGames,
    getPendingGameByPlayerId,
} from "../redux/powerballResultSlice";
import { toast } from "react-toastify";

const PowerballResult = () => {
    const dispatch = useDispatch();

    const { 
        createLoading, 
        loading, 
        success, 
        error, 
        message,
        results,
        deleteLoading,
        pendingGames,
        pendingGamesLoading,
        selectedGame: selectedGameFromRedux,
    } = useSelector(
        (state) => state.powerballResult
    );

    const [formData, setFormData] = useState({
        drawNo: "",
        powerball: "",
        numbers: ["", "", "", "", "", "", ""],
    });

    const [showGameDetails, setShowGameDetails] = useState(false);
    const [showPendingGames, setShowPendingGames] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [groupedGames, setGroupedGames] = useState({});

    useEffect(() => {
        dispatch(getAllPowerballResults());
        dispatch(getAllPendingGames());
    }, [dispatch]);

    useEffect(() => {
        if (pendingGames.length > 0) {
            // Group games by poolId
            const grouped = pendingGames.reduce((acc, game) => {
                if (!acc[game.poolId]) {
                    acc[game.poolId] = {
                        poolId: game.poolId,
                        poolTotalPlayers: game.poolTotalPlayers,
                        poolTotalAmount: game.poolTotalAmount,
                        poolStatus: game.poolStatus,
                        drawNo: game.drawNo,
                        games: []
                    };
                }
                acc[game.poolId].games.push(game);
                return acc;
            }, {});
            setGroupedGames(grouped);
        } else {
            setGroupedGames({});
        }
    }, [pendingGames]);

    useEffect(() => {
        if (success) {
            toast.success(message || "Result Declared Successfully");

            setFormData({
                drawNo: "",
                powerball: "",
                numbers: ["", "", "", "", "", "", ""],
            });

            dispatch(clearPowerballResultState());
            dispatch(getAllPowerballResults());
            dispatch(getAllPendingGames());
        }

        if (error) {
            toast.error(error);
            dispatch(clearPowerballResultState());
        }
    }, [success, error, dispatch, message]);

    // Draw No & Powerball
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Winning Numbers
    const handleNumberChange = (index, value) => {
        const updated = [...formData.numbers];
        updated[index] = value;

        setFormData({
            ...formData,
            numbers: updated,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const numbers = formData.numbers.map(Number);

        if (
            !formData.drawNo ||
            !formData.powerball ||
            numbers.some((n) => isNaN(n))
        ) {
            return toast.error("Please fill all fields.");
        }

        if (new Set(numbers).size !== 7) {
            return toast.error("Winning numbers must be unique.");
        }

        dispatch(
            createPowerballResult({
                drawNo: Number(formData.drawNo),
                numbers,
                powerball: Number(formData.powerball),
            })
        );
    };

    const handleViewPendingGames = () => {
        setShowPendingGames(!showPendingGames);
        if (!showPendingGames) {
            dispatch(getAllPendingGames());
        }
    };

    const handleGameClick = (game) => {
        if (game && game.playerId) {
            const transformedGame = {
                ...game,
                userId: {
                    username: game.userId?.name || "Unknown",
                    email: game.userId?.email || "",
                    _id: game.userId?._id
                },
                ticketType: {
                    title: game.ticketType?.title || "N/A",
                    name: game.ticketType?.title || "N/A",
                    _id: game.ticketType?._id
                },
                games: [{
                    gameNo: game.gameNo,
                    numbers: game.numbers,
                    powerball: game.powerball
                }]
            };
            
            setSelectedGame(transformedGame);
            setShowGameDetails(true);
        } else {
            toast.error("Game details not available");
        }
    };

    const handleCloseDetails = () => {
        setShowGameDetails(false);
        setSelectedGame(null);
        dispatch(clearPendingGames());
    };

    const handleClosePendingGames = () => {
        setShowPendingGames(false);
        dispatch(clearPendingGames());
    };

    // Get unique users in a pool
    const getUniqueUsers = (games) => {
        const uniqueUsers = {};
        games.forEach(game => {
            if (game.userId && game.userId._id) {
                uniqueUsers[game.userId._id] = game.userId;
            }
        });
        return Object.values(uniqueUsers);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Declare Result Form */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h4 className="text-xl font-bold text-white">Declare Powerball Result</h4>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        {/* Draw Number */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Draw Number
                            </label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter Draw Number"
                                name="drawNo"
                                value={formData.drawNo}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Winning Numbers */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Winning Numbers
                            </label>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                {formData.numbers.map((num, index) => (
                                    <input
                                        key={index}
                                        type="number"
                                        min="1"
                                        max="35"
                                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={index + 1}
                                        value={num}
                                        onChange={(e) =>
                                            handleNumberChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Powerball */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Winning Powerball
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter Winning Powerball"
                                name="powerball"
                                value={formData.powerball}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={createLoading}
                        >
                            {createLoading ? "Declaring..." : "Declare Result"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-8">
                <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
                    <h5 className="text-lg font-semibold text-white">Powerball Results</h5>
                    <div className="flex items-center gap-4">
                        <button
                            className={`px-4 py-2 text-sm font-semibold rounded transition duration-200 ${
                                showPendingGames 
                                    ? 'bg-purple-700 hover:bg-purple-800' 
                                    : 'bg-purple-600 hover:bg-purple-700'
                            } text-white`}
                            onClick={handleViewPendingGames}
                        >
                            {showPendingGames ? 'Hide Pending' : 'View Pending Games'}
                            {Object.keys(groupedGames).length > 0 && !showPendingGames && (
                                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    {Object.keys(groupedGames).length}
                                </span>
                            )}
                        </button>
                        {loading && (
                            <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                        )}
                    </div>
                </div>

                <div className="p-6 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    #
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Draw No
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Winning Numbers
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Powerball
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {results?.length > 0 ? (
                                results.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.drawNo}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <div className="flex flex-wrap gap-1.5">
                                                {item.numbers.map((num, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center justify-center w-9 h-9 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm"
                                                    >
                                                        {num}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <span className="inline-flex items-center justify-center w-9 h-9 bg-red-100 text-red-800 font-semibold rounded-full text-sm">
                                                {item.powerball}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <button
                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={deleteLoading}
                                                onClick={() => {
                                                    if (
                                                        window.confirm(
                                                            "Are you sure you want to delete this result?"
                                                        )
                                                    ) {
                                                        dispatch(deletePowerballResult(item._id))
                                                            .unwrap()
                                                            .then(() => {
                                                                toast.success(
                                                                    "Result Deleted Successfully"
                                                                );
                                                                dispatch(getAllPowerballResults());
                                                                dispatch(getAllPendingGames());
                                                            })
                                                            .catch((err) => {
                                                                toast.error(err);
                                                            });
                                                    }
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        No Result Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pending Games Section - Grouped by Pool ID */}
            {showPendingGames && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-8">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center">
                        <h5 className="text-lg font-semibold text-white">
                            Pending Games by Pool
                            <span className="ml-2 text-sm font-normal text-purple-200">
                                ({Object.keys(groupedGames).length} pools)
                            </span>
                        </h5>
                        <button
                            className="px-3 py-1 bg-white text-purple-600 font-semibold rounded hover:bg-gray-100 transition duration-200"
                            onClick={handleClosePendingGames}
                        >
                            Close
                        </button>
                    </div>

                    <div className="p-6">
                        {pendingGamesLoading ? (
                            <div className="text-center py-8">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                                <p className="mt-2 text-gray-500">Loading pending games...</p>
                            </div>
                        ) : Object.keys(groupedGames).length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {Object.values(groupedGames).map((pool) => (
                                    <div key={pool.poolId} className="border-2 border-purple-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                        {/* Pool Header */}
                                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3">
                                            <div className="flex justify-between items-center flex-wrap gap-2">
                                                <div>
                                                    <h6 className="text-white font-bold text-lg">
                                                        Pool #{pool.poolId.slice(-6)}
                                                    </h6>
                                                    <p className="text-purple-100 text-sm">
                                                        Draw #{pool.drawNo} • {pool.games.length} tickets
                                                    </p>
                                                </div>
                                                <div className="flex gap-4 text-white text-sm">
                                                    <span className="bg-white/20 px-3 py-1 rounded-full">
                                                        👥 {pool.poolTotalPlayers} players
                                                    </span>
                                                    <span className="bg-white/20 px-3 py-1 rounded-full">
                                                        💰 ${pool.poolTotalAmount}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full ${
                                                        pool.poolStatus === 'Open' 
                                                            ? 'bg-green-500/30 text-green-100' 
                                                            : 'bg-gray-500/30 text-gray-100'
                                                    }`}>
                                                        {pool.poolStatus}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pool Games */}
                                        <div className="p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {pool.games.map((game, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-purple-400 bg-white"
                                                        onClick={() => handleGameClick(game)}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-sm font-medium text-gray-500">
                                                                Game #{game.gameNo}
                                                            </span>
                                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                                                Pending
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                            {game.numbers.map((num, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-800 font-semibold rounded-full text-xs"
                                                                >
                                                                    {num}
                                                                </span>
                                                            ))}
                                                            <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 text-red-800 font-semibold rounded-full text-xs">
                                                                {game.powerball}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="text-xs text-gray-500 space-y-1">
                                                            <div className="flex justify-between">
                                                                <span>User:</span>
                                                                <span className="font-medium text-gray-700">
                                                                    {game.userId?.name || "Unknown"}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>Bid:</span>
                                                                <span className="font-medium text-gray-700">
                                                                    ${game.bidAmount}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>Ticket:</span>
                                                                <span className="font-medium text-gray-700">
                                                                    {game.ticketType?.title || "N/A"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Unique Users in Pool */}
                                            <div className="mt-4 pt-3 border-t border-gray-200">
                                                <p className="text-xs text-gray-500">
                                                    Players: {getUniqueUsers(pool.games).map(u => u.name).join(', ')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No pending games found.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Game Details Modal */}
            {showGameDetails && selectedGame && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center sticky top-0">
                            <h5 className="text-xl font-bold text-white">
                                Game Details - Draw #{selectedGame.drawNo}
                            </h5>
                            <button
                                className="text-white hover:text-gray-200 text-2xl font-bold"
                                onClick={handleCloseDetails}
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6">
                            {/* User Information */}
                            <div className="mb-6">
                                <h6 className="text-sm font-medium text-gray-500 mb-3">User Information</h6>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400">Username</label>
                                            <p className="text-base font-semibold text-gray-900">
                                                {selectedGame.userId?.username || "Unknown"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400">Email</label>
                                            <p className="text-base font-semibold text-gray-900">
                                                {selectedGame.userId?.email || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400">User ID</label>
                                            <p className="text-base font-semibold text-gray-900 text-sm">
                                                {selectedGame.userId?._id || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Game Information */}
                            <div className="mb-6">
                                <h6 className="text-sm font-medium text-gray-500 mb-3">Game Information</h6>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400">Draw Number</label>
                                            <p className="text-base font-semibold text-gray-900">#{selectedGame.drawNo}</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400">Game Number</label>
                                            <p className="text-base font-semibold text-gray-900">#{selectedGame.gameNo}</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400">Status</label>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                                {selectedGame.playerStatus || "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Information */}
                            <div className="mb-6">
                                <h6 className="text-sm font-medium text-gray-500 mb-3">Ticket Information</h6>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400">Ticket Type</label>
                                            <p className="text-base font-semibold text-gray-900">
                                                {selectedGame.ticketType?.title || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400">Bid Amount</label>
                                            <p className="text-base font-semibold text-gray-900">
                                                ${selectedGame.bidAmount}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400">Ticket ID</label>
                                            <p className="text-base font-semibold text-gray-900 text-sm">
                                                {selectedGame.ticketType?._id || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Currency Details */}
                            {selectedGame.currencyDetails && (
                                <div className="mb-6">
                                    <h6 className="text-sm font-medium text-gray-500 mb-3">Currency Details</h6>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400">USD Amount</label>
                                                <p className="text-base font-semibold text-gray-900">
                                                    ${selectedGame.currencyDetails.usdAmount}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400">Local Amount</label>
                                                <p className="text-base font-semibold text-gray-900">
                                                    {selectedGame.currencyDetails.localCurrency} {selectedGame.currencyDetails.localAmount}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400">Exchange Rate</label>
                                                <p className="text-base font-semibold text-gray-900">
                                                    {selectedGame.currencyDetails.exchangeRate}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400">Country</label>
                                                <p className="text-base font-semibold text-gray-900">
                                                    {selectedGame.currencyDetails.userCountry}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Game Numbers */}
                            <div className="mb-6">
                                <h6 className="text-sm font-medium text-gray-500 mb-3">Game Numbers</h6>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex flex-wrap gap-2">
                                        {selectedGame.numbers?.map((num, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-800 font-bold rounded-full text-lg border-2 border-blue-200"
                                            >
                                                {num}
                                            </span>
                                        ))}
                                        <span className="inline-flex items-center justify-center w-12 h-12 bg-red-100 text-red-800 font-bold rounded-full text-lg border-2 border-red-200">
                                            {selectedGame.powerball}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-center text-xs text-gray-500">
                                        <span className="font-medium">Powerball</span> highlighted in red
                                    </div>
                                </div>
                            </div>

                            {/* Pool Information */}
                            {(selectedGame.poolTotalPlayers || selectedGame.poolTotalAmount) && (
                                <div className="mb-6">
                                    <h6 className="text-sm font-medium text-gray-500 mb-3">Pool Information</h6>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400">Pool ID</label>
                                                <p className="text-base font-semibold text-gray-900 text-sm">
                                                    {selectedGame.poolId || "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400">Total Players</label>
                                                <p className="text-base font-semibold text-gray-900">
                                                    {selectedGame.poolTotalPlayers || 0}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400">Total Amount</label>
                                                <p className="text-base font-semibold text-gray-900">
                                                    ${selectedGame.poolTotalAmount || 0}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400">Pool Status</label>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                    selectedGame.poolStatus === 'Open' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {selectedGame.poolStatus || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Created At */}
                            <div className="mb-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-1">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400">Created At</label>
                                            <p className="text-base font-semibold text-gray-900">
                                                {new Date(selectedGame.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-2 border-t pt-4">
                                <button
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded transition duration-200"
                                    onClick={handleCloseDetails}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PowerballResult;