// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dailyClaimReducer from "./slices/dailyClaimSlice";
import withdrawalReducer from "./slices/withdrawalSlice";
import depositReducer from "./slices/depositSlice";
import bannerReducer from "./slices/bannerSlice";
import gameCountReducer from "./slices/gameCountSlice";
import ticketTypeReducer from "./slices/ticketTypeSlice";
import gameEntryReducer from "./slices/gameEntrySlice";

// 👇 Matka Slices
import marketReducer from "./slices/marketSlice";
import bidReducer from "./slices/bidSlice";
import resultReducer from "./slices/resultSlice";
import publicBidReducer from "./slices/publicBidSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dailyClaim: dailyClaimReducer,
    withdrawal: withdrawalReducer,
    deposit: depositReducer,
    banner: bannerReducer,
    gameCount: gameCountReducer,
    ticketType: ticketTypeReducer,
    gameEntry: gameEntryReducer,

    // 👇 Matka Reducers
    market: marketReducer,
    bid: bidReducer,
    result: resultReducer,
    publicBid: publicBidReducer,

  },
});

export default store;