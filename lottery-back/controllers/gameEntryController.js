const GamePool = require("../models/GameEntry");
const TicketType = require("../models/TicketType");
const mongoose = require("mongoose");
const User = require("../models/authmodel");
const Transaction = require("../models/Transaction");
const GameCount = require("../models/GameCount");
const { convertUSDtoLocal, formatCurrency } = require("../utils/currencyConverter");

// =========================
// CREATE GAME POOL
// =========================
exports.createGamePool = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      ticketType,
      gameType,
      gameCount,
      games,
      autoPlay = false,
      drawCount = 1,
      totalPrice = 0
    } = req.body;

    console.log(req.body);
  

    // =========================
    // Required Validation
    // =========================
    if (!ticketType) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Ticket Type is required."
      });
    }

    if (!gameCount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Game Count is required."
      });
    }

    if (!games || !Array.isArray(games) || games.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Please select at least one game."
      });
    }

    // =========================
    // ObjectId Validation
    // =========================
    if (!mongoose.Types.ObjectId.isValid(ticketType)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Invalid Ticket Type ID."
      });
    }

    if (!mongoose.Types.ObjectId.isValid(gameCount)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Invalid Game Count ID."
      });
    }

    // =========================
    // Find Ticket Type
    // =========================
    const ticket = await TicketType.findById(ticketType).session(session);

    if (!ticket) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Ticket Type not found."
      });
    }

    // =========================
    // Game Count
    // =========================
    const gameCountData = await GameCount.findById(gameCount).session(session);

    if (!gameCountData) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Game Count not found."
      });
    }

    const actualGameCount = gameCountData.totalGames;

    if (actualGameCount !== games.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Game count (${actualGameCount}) does not match selected games (${games.length})`
      });
    }

    // =========================
    // Calculate Price
    // =========================
    let calculatedTotalPriceUSD = totalPrice;

    if (calculatedTotalPriceUSD === 0) {
      calculatedTotalPriceUSD = gameCountData.price;

      if (autoPlay) {
        calculatedTotalPriceUSD = calculatedTotalPriceUSD * drawCount;
      }
    }

    // =========================
    // User
    // =========================
    const user = await User.findById(req.user.id).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    // =========================
    // Currency Conversion
    // =========================
    let localCurrencyAmount;

    try {
      if (!user.country) {
        localCurrencyAmount = {
          convertedAmount: calculatedTotalPriceUSD,
          convertedCurrency: "USD",
          exchangeRate: 1
        };
      } else {
        localCurrencyAmount = convertUSDtoLocal(
          calculatedTotalPriceUSD,
          user.country
        );
      }
    } catch (error) {
      localCurrencyAmount = {
        convertedAmount: calculatedTotalPriceUSD,
        convertedCurrency: "USD",
        exchangeRate: 1
      };
    }

    // =========================
    // Balance Check
    // =========================
    if (user.balance < localCurrencyAmount.convertedAmount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Insufficient balance.",
        balance: {
          amount: user.balance,
          currency: localCurrencyAmount.convertedCurrency
        },
        required: {
          amount: localCurrencyAmount.convertedAmount,
          currency: localCurrencyAmount.convertedCurrency
        }
      });
    }

    // =========================
    // Game Type Validation
    // =========================
    let selectedGameType = null;

    if (ticket.gameTypes && ticket.gameTypes.length > 0) {
      if (!gameType) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "Game Type is required."
        });
      }

      selectedGameType = ticket.gameTypes.id(gameType);

      if (!selectedGameType) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Game Type not found."
        });
      }
    }

    // =========================
    // Validate Games
    // =========================
    const formattedGames = [];
    const numberSets = new Set();

    for (let i = 0; i < games.length; i++) {
      const game = games[i];

      if (!Array.isArray(game.numbers)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Game ${i + 1}: Numbers must be array.`
        });
      }

      if (game.numbers.length !== 7) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Game ${i + 1}: Exactly 7 numbers required.`
        });
      }

      const invalidNumbers = game.numbers.filter(num => num < 1 || num > 69);

      if (invalidNumbers.length > 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Game ${i + 1}: Numbers must be between 1-69.`
        });
      }

      const uniqueNumbers = new Set(game.numbers);

      if (uniqueNumbers.size !== game.numbers.length) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Game ${i + 1}: Duplicate numbers not allowed.`
        });
      }

      if (game.powerball === undefined || game.powerball === null || game.powerball === "") {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Game ${i + 1}: Powerball required.`
        });
      }

      if (game.powerball < 1 || game.powerball > 20) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Game ${i + 1}: Powerball must be 1-20.`
        });
      }

      const gameKey = [...game.numbers].sort().join(",") + "|" + game.powerball;

      if (numberSets.has(gameKey)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Game ${i + 1}: Duplicate combination found.`
        });
      }

      numberSets.add(gameKey);

      formattedGames.push({
        gameNo: i + 1,
        numbers: game.numbers,
        powerball: game.powerball
      });
    }

    // =========================
    // Find Existing Pool
    // =========================
    const poolQuery = {
      ticketType,
      gameCount,
      status: "Open"
    };

    if (gameType) {
      poolQuery.gameType = gameType;
    }

    let pool = await GamePool.findOne(poolQuery).session(session);

    const playerData = {
      user: req.user.id,
      games: formattedGames,
      bidAmount: calculatedTotalPriceUSD,
      currencyDetails: {
        usdAmount: calculatedTotalPriceUSD,
        localAmount: localCurrencyAmount.convertedAmount,
        localCurrency: localCurrencyAmount.convertedCurrency,
        exchangeRate: localCurrencyAmount.exchangeRate,
        userCountry: user.country || "US"
      },
      status: "Pending"
    };

    // =========================
    // Add Player In Pool
    // =========================
    if (pool) {
      // Check if user already in this pool
      const existingPlayer = pool.players.find(
        p => p.user.toString() === req.user.id.toString()
      );

      if (existingPlayer) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "You already joined this pool."
        });
      }

      pool.players.push(playerData);
      pool.totalPlayers = pool.players.length;
      pool.totalAmount += calculatedTotalPriceUSD;
      await pool.save({ session });
    } else {
      if (!gameType) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "Game Type is required to create a new pool."
        });
      }

      const newPool = await GamePool.create([{
        ticketType,
        gameType: gameType,
        gameCount,
        drawNo: 1,
        players: [playerData],
        totalPlayers: 1,
        totalAmount: calculatedTotalPriceUSD,
        status: "Open"
      }], { session });

      pool = newPool[0];
    }

    // =========================
    // Deduct Balance
    // =========================
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: {
          balance: -localCurrencyAmount.convertedAmount
        }
      },
      {
        new: true,
        session
      }
    );

    // =========================
    // Create Transaction
    // =========================
    await Transaction.create([{
      user: req.user.id,
      amount: localCurrencyAmount.convertedAmount,
      currency: localCurrencyAmount.convertedCurrency,
      usdAmount: calculatedTotalPriceUSD,
      type: "DEBIT",
      category: "GAME_ENTRY",
      description: `Game Pool Entry - ${actualGameCount} Games`,
      reference: pool._id,
      referenceModel: "GamePool",
      status: "completed",
      balanceAfter: updatedUser.balance,
      exchangeRate: localCurrencyAmount.exchangeRate
    }], { session });

    // =========================
    // Commit
    // =========================
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Game Pool joined successfully.",
      data: pool,
      balance: {
        amount: updatedUser.balance,
        currency: localCurrencyAmount.convertedCurrency,
        formatted: formatCurrency(
          updatedUser.balance,
          user.country || "US"
        )
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Create Game Pool Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};

// =========================
// GET MY GAME ENTRIES
// =========================
exports.getMyGameEntries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {
      "players.user": req.user.id
    };

    if (status) {
      query.status = status;
    }

    const entries = await GamePool.find(query)
      .populate("ticketType", "name price")
      .populate("gameCount", "totalGames price")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const formattedEntries = entries.map(pool => {
      const player = pool.players.find(
        p => p.user.toString() === req.user.id.toString()
      );
      return {
        poolId: pool._id,
        ticketType: pool.ticketType,
        gameCount: pool.gameCount,
        gameType: pool.gameType,
        drawNo: pool.drawNo,
        poolStatus: pool.status,
        playerStatus: player ? player.status : null,
        games: player ? player.games : [],
        bidAmount: player ? player.bidAmount : 0,
        currencyDetails: player ? player.currencyDetails : {},
        result: player ? player.result : null,
        createdAt: pool.createdAt,
        updatedAt: pool.updatedAt,
        totalPlayers: pool.totalPlayers,
        totalAmount: pool.totalAmount,
        winningNumbers: pool.winningNumbers,
        resultDeclared: pool.resultDeclared
      };
    });

    const total = await GamePool.countDocuments(query);

    res.status(200).json({
      success: true,
      data: formattedEntries,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get Game Entries Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// GET SINGLE GAME ENTRY
// =========================
exports.getSingleGameEntry = async (req, res) => {
  try {
    const pool = await GamePool.findOne({
      _id: req.params.id,
      "players.user": req.user.id
    })
      .populate("ticketType", "name price description")
      .populate("gameCount", "totalGames price");

    if (!pool) {
      return res.status(404).json({
        success: false,
        message: "Game Entry not found or you don't have access.",
      });
    }

    const player = pool.players.find(
      p => p.user.toString() === req.user.id.toString()
    );

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player data not found.",
      });
    }

    const response = {
      poolId: pool._id,
      ticketType: pool.ticketType,
      gameCount: pool.gameCount,
      gameType: pool.gameType,
      drawNo: pool.drawNo,
      poolStatus: pool.status,
      playerStatus: player.status,
      games: player.games,
      bidAmount: player.bidAmount,
      currencyDetails: player.currencyDetails,
      result: player.result,
      totalPlayers: pool.totalPlayers,
      totalAmount: pool.totalAmount,
      winningNumbers: pool.winningNumbers,
      resultDeclared: pool.resultDeclared,
      createdAt: pool.createdAt,
      updatedAt: pool.updatedAt
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Get Single Game Entry Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// DELETE GAME ENTRY
// =========================
exports.deleteGameEntry = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const pool = await GamePool.findOne({
      _id: req.params.id,
      "players.user": req.user.id
    }).session(session);

    if (!pool) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Game Entry not found.",
      });
    }

    if (pool.status !== 'Open') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Cannot delete entry. Pool is ${pool.status}.`,
      });
    }

    const playerIndex = pool.players.findIndex(
      p => p.user.toString() === req.user.id.toString()
    );

    if (playerIndex === -1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Player not found in this pool.",
      });
    }

    const removedPlayer = pool.players[playerIndex];
    pool.players.splice(playerIndex, 1);
    pool.totalPlayers = pool.players.length;
    pool.totalAmount -= removedPlayer.bidAmount;

    if (pool.players.length === 0) {
      await pool.deleteOne({ session });
    } else {
      await pool.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Game Entry deleted successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Delete Game Entry Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// CANCEL GAME ENTRY (WITH REFUND)
// =========================
exports.cancelGameEntry = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const pool = await GamePool.findOne({
      _id: req.params.id,
      "players.user": req.user.id
    }).session(session);

    if (!pool) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Game Entry not found.",
      });
    }

    if (pool.status !== 'Open') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Cannot cancel entry. Pool is ${pool.status}.`,
      });
    }

    const playerIndex = pool.players.findIndex(
      p => p.user.toString() === req.user.id.toString()
    );

    if (playerIndex === -1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Player not found in this pool.",
      });
    }

    const removedPlayer = pool.players[playerIndex];
    const refundAmount = removedPlayer.currencyDetails.localAmount;

    pool.players.splice(playerIndex, 1);
    pool.totalPlayers = pool.players.length;
    pool.totalAmount -= removedPlayer.bidAmount;

    if (pool.players.length === 0) {
      await pool.deleteOne({ session });
    } else {
      await pool.save({ session });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { balance: refundAmount } },
      { new: true, session }
    );

    await Transaction.create([{
      user: req.user.id,
      amount: refundAmount,
      currency: removedPlayer.currencyDetails.localCurrency,
      usdAmount: removedPlayer.bidAmount,
      type: "CREDIT",
      category: "GAME_ENTRY_REFUND",
      description: "Game Entry Cancellation Refund",
      reference: pool._id || req.params.id,
      referenceModel: "GamePool",
      status: "completed",
      balanceAfter: updatedUser.balance,
      exchangeRate: removedPlayer.currencyDetails.exchangeRate
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Game Entry cancelled successfully. Amount refunded.",
      balance: {
        amount: updatedUser.balance,
        currency: removedPlayer.currencyDetails.localCurrency,
        formatted: formatCurrency(
          updatedUser.balance,
          removedPlayer.currencyDetails.userCountry || "US"
        )
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Cancel Game Entry Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =========================
// GET USER BALANCE
// =========================
exports.getUserBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('balance');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    res.status(200).json({
      success: true,
      balance: user.balance
    });
  } catch (error) {
    console.error("Get Balance Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};