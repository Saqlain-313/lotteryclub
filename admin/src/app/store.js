import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "../admin/redux/adminAuthSlice";
import depositSettingsReducer from "../admin/redux/depositSettingsSlice";
import depositsReducer from "../admin/redux/depositSlice";
import withdrawalReducer from "../admin/redux/withdrawalSlice";
import withdrawalSettingsReducer from "../admin/redux/withdrawalSettingsSlice";
import bannerReducer from "../admin/redux/bannerSlice";
import ticketTypeReducer from "../admin/redux/ticketTypeSlice";
import gameCountReducer from "../admin/redux/gameCountSlice";
import gameEntryReducer from "../admin/redux/gameEntrySlice";
import adminMarketReducer from '../admin/redux/adminMarketSlice';
import adminBidReducer from '../admin/redux/adminBidSlice';
import adminResultReducer from '../admin/redux/adminResultSlice';
import currencyRateReducer from '../admin/redux/currencyRateSlice';
import powerballResultReducer from '../admin/redux/powerballResultSlice';



export const store = configureStore({
    reducer: {
        adminAuth: adminAuthReducer,
        depositSettings: depositSettingsReducer,
        deposits: depositsReducer,
        withdrawals: withdrawalReducer,
        withdrawalSettings: withdrawalSettingsReducer,
        banner: bannerReducer,
        ticketType: ticketTypeReducer,
        gameCount: gameCountReducer,
        gameEntries: gameEntryReducer,
        adminMarket: adminMarketReducer,
        adminBid: adminBidReducer,
        adminResult: adminResultReducer,
        currencyRate: currencyRateReducer,
        powerballResult: powerballResultReducer,







    },
});