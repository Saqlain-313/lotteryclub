// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Homme from "./pages/Homme.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Navbar from "./components/Navbar.jsx";
import WalletDashboard from "./Pages/WalletDashboard.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Activity from "./components/Activity.jsx";
import PromoPage from "./pages/Promo/PromoPage.jsx";
import Withdrawal from "./Pages/Withdrawal.jsx";
import AppInitializer from "./components/AppInitializer.jsx";
import AllWithdrawal from "./pages/All_Withdrawal.jsx";
import Deposit from "./Pages/Deposit.jsx";
import DepositHistory from "./pages/DepositHistory.jsx";
import WithdrawalHistory from "./components/WithdrawalHistory.jsx";
import GameCounts from "./Pages/GameCounts.jsx";

// 👇 Matka Game Imports
import MatkaDashboard from "./Pages/user/Dashboard.jsx";
import MatkaMarkets from "./Pages/user/Markets.jsx";
import PlaceBid from "./Pages/user/PlaceBid.jsx";
import BidsHistory from "./Pages/user/BidsHistory.jsx";
import MatkaResults from "./Pages/user/Results.jsx";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <AppInitializer>
      <Navbar>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homme />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/powerhit" element={<GameCounts />} />

          {/* Promo */}
          <Route
            path="/promo"
            element={
              <ProtectedRoute>
                <PromoPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <WalletDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <Activity />
              </ProtectedRoute>
            }
          />

          <Route
            path="/withdrawal"
            element={
              <ProtectedRoute>
                <Withdrawal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/withdrawal-history/:page?"
            element={
              <ProtectedRoute>
                <WithdrawalHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/deposit"
            element={
              <ProtectedRoute>
                <Deposit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/deposit-history"
            element={
              <ProtectedRoute>
                <DepositHistory />
              </ProtectedRoute>
            }
          />

          {/* 👇 Matka Game Routes */}
          <Route
            path="/matka"
            element={
              <ProtectedRoute>
                <MatkaDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matka/markets"
            element={
              <ProtectedRoute>
                <MatkaMarkets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matka/place-bid/:marketId"
            element={
              <ProtectedRoute>
                <PlaceBid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matka/bids-history"
            element={
              <ProtectedRoute>
                <BidsHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matka/results"
            element={
              <ProtectedRoute>
                <MatkaResults />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Navbar>
    </AppInitializer>
  );
}

export default App;