// src/App.jsx
import { useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";

import Activity from "./components/Activity.jsx";
import AppInitializer from "./components/AppInitializer.jsx";
import ChangePassword from "./components/ChangePassword.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import WithdrawalHistory from "./components/WithdrawalHistory.jsx";
import Deposit from "./Pages/Deposit.jsx";
import DepositHistory from "./pages/DepositHistory.jsx";
import GameCounts from "./Pages/GameCounts.jsx";
import Homme from "./pages/Homme.jsx";
import Login from "./Pages/Login.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import PromoPage from "./pages/Promo/PromoPage.jsx";
import Register from "./Pages/Register.jsx";
import WalletDashboard from "./Pages/WalletDashboard.jsx";
import Withdrawal from "./Pages/Withdrawal.jsx";

// 👇 Matka Game Imports
import { useLayoutEffect } from "react";
import Account from "./Pages/Account.jsx";
import Maintenance from "./Pages/Maintenance.jsx";
import BidsHistory from "./Pages/user/BidsHistory.jsx";
import MatkaDashboard from "./Pages/user/Dashboard.jsx";
import MatkaMarkets from "./Pages/user/Markets.jsx";
import PlaceBid from "./Pages/user/PlaceBid.jsx";
import MatkaResults from "./Pages/user/Results.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <AppInitializer>
      <Navbar>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homme />} />
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
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
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
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
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
          <Route path="*" element={<Maintenance />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Navbar>
    </AppInitializer>
  );
}

export default App;
