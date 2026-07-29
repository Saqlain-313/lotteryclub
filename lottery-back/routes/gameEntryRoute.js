const express = require("express");

const router = express.Router();

const {
  createGamePool,
  getMyGameEntries,
  getSingleGameEntry,
  deleteGameEntry,
} = require("../controllers/gameEntryController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createGamePool);

router.get("/", protect, getMyGameEntries);

router.get("/:id", protect, getSingleGameEntry);

router.delete("/:id", protect, deleteGameEntry);

module.exports = router;