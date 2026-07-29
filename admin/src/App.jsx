// App.js
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import Deposits from "./admin/pages/Deposits";
import Withdrawals from "./admin/pages/Withdrawals";
import Transactions from "./admin/pages/Transactions";
import Reports from "./admin/pages/Reports";
import Notifications from "./admin/pages/Notifications";
import Settings from "./admin/pages/Settings";
import DepositSettingsAdmin from "./admin/pages/DepositSettingsAdmin";
import WithdrawalSettings from "./admin/pages/WithdrawalSettings";
import CreateWithdrawalSettings from "./admin/pages/createWithdrawalSettings";
import Banners from "./admin/pages/Banners";

import PrivateRoute from "./admin/routes/PrivateRoute";
import AdminLayout from "./admin/layouts/AdminLayout";
import AdminTicketType from "./admin/pages/AdminTicketType";
import AdminGameCount from "./admin/pages/AdminGameCount";
import AdminGameEntries from "./admin/pages/AdminGameEntries";

// 👇 Matka Admin Pages
import AdminMarkets from "./admin/pages/AdminMarkets";
import AdminBids from "./admin/pages/AdminBids";
import AdminResults from "./admin/pages/AdminResults";
import AdminCurrencyRates from "./admin/pages/AdminCurrencyRates";
import PowerballResult from "./admin/pages/PowerballResult";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" replace />} />

      <Route path="/admin/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/deposits" element={<Deposits />} />
          <Route path="/admin/withdrawals" element={<Withdrawals />} />
          <Route path="/admin/transactions" element={<Transactions />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/notifications" element={<Notifications />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/ticketsetiings" element={<AdminTicketType />} />
          <Route path="/admin/gamecounts" element={<AdminGameCount />} />
          <Route path="/admin/gameEntries" element={<AdminGameEntries />} />

          {/* Deposit Settings */}
          <Route path="/admin/deposit-settings" element={<DepositSettingsAdmin />} />

          {/* Withdrawal Settings */}
          <Route path="/admin/withdrawal-settings" element={<WithdrawalSettings />} />
          <Route path="/admin/withdrawal-settings/create" element={<CreateWithdrawalSettings />} />
          <Route
            path="/admin/currency-rates" element={<AdminCurrencyRates />
            }
          />

          {/* Banner Management */}
          <Route path="/admin/banners" element={<Banners />} />

          {/* ============================================================ */}
          {/* 👇 MATKA ADMIN PAGES */}
          {/* ============================================================ */}

          {/* Manage Markets */}
          <Route path="/admin/markets" element={<AdminMarkets />} />

          {/* View All Bids */}
          <Route path="/admin/bids" element={<AdminBids />} />

          {/* Manage Results */}
          <Route path="/admin/results" element={<AdminResults />} />
          <Route path="/admin/powerball-result" element={<PowerballResult />} />

        </Route>
      </Route>
    </Routes>
  );
}

export default App;