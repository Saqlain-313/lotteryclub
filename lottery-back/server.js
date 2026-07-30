require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const dailyClaimRoutes = require("./routes/dailyClaimRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const adminWithdrawalRoutes = require("./routes/admin/withdrawalRoutes");
const depositSettingsRoutes = require("./routes/depositSettingsRoutes");
const deposit = require("./routes/depositRoutes");
const withdrawalSettingsRoutes = require("./routes/withdrawalSettingsRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const ticketTypeRoutes = require("./routes/admin/ticketTypeRoutes");
const gameCountRoutes = require("./routes/admin/gameCountRoutes");
const adminGameEntryRoutes = require("./routes/admin/gameEntryRoutes");
const gameEntryRoute = require("./routes/gameEntryRoute");
const powerballResultRoutes = require("./routes/admin/powerballResultRoutes");

const connectDB = require("./config/connectdb");

const dns = require("dns");
const path = require("path");
// Change DNS
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/daily-claim", dailyClaimRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/admin/withdrawals", adminWithdrawalRoutes);
app.use("/api/withdrawal-settings", withdrawalSettingsRoutes);
app.use("/api", depositSettingsRoutes);
app.use("/api/deposit", deposit);
app.use("/api/banner", bannerRoutes);
app.use("/api/admin/ticket-types", ticketTypeRoutes);
app.use("/api/admin/game-count", gameCountRoutes);
app.use("/api/game-counts", require("./routes/user/gameCountRoutes"));
app.use("/api/user/ticket-types", require("./routes/user/ticketTypeRoutes"));
app.use("/api/game-entry", gameEntryRoute);
app.use("/api/admin/game-entries", adminGameEntryRoutes);
app.use("/api/admin/powerball-results", powerballResultRoutes);
// After your existing routes
app.use("/api/markets", require("./routes/marketRoutes"));
app.use("/api/bids", require("./routes/bidRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));
app.use("/api/currency", require("./routes/currencyRateRoutes"));

app.use(express.static(path.join(__dirname, "../client/dist")));

// ================= ADMIN BUILD =================
app.use("/admin", express.static(path.join(__dirname, "../admin/dist")));

// ================= ADMIN REACT ROUTES =================
app.get("/admin/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin/dist/index.html"));
});

// ================= USER REACT ROUTES =================
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
