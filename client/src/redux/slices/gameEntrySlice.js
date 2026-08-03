import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

// ================= CREATE GAME ENTRY =================
export const createGameEntry = createAsyncThunk(
  "gameEntry/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/game-entry", formData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong."
      );
    }
  }
);

// ================= GET MY GAME ENTRIES =================
export const getMyGameEntries = createAsyncThunk(
  "gameEntry/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/game-entry");
      return data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong."
      );
    }
  }
);

// ================= GET ENTRY RESULTS =================
export const getEntryResults = createAsyncThunk(
  "gameEntry/getResults",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/game-entry/${id}/results`);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong."
      );
    }
  }
);

// ================= DELETE ENTRY =================
export const deleteGameEntry = createAsyncThunk(
  "gameEntry/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/game-entry/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong."
      );
    }
  }
);

const initialState = {
  entries: [],
  selectedEntry: null,
  results: null,
  winningNumbers: null,
  loading: false,
  success: false,
  error: null,
  message: "",
};

const gameEntrySlice = createSlice({
  name: "gameEntry",
  initialState,
  reducers: {
    resetGameEntryState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
      state.results = null;
      state.winningNumbers = null;
    },
    clearSelectedEntry: (state) => {
      state.selectedEntry = null;
      state.results = null;
      state.winningNumbers = null;
    },
    clearGameEntryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= CREATE GAME ENTRY =================
      .addCase(createGameEntry.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createGameEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.entry = action.payload?.data || null;
        state.message = action.payload?.message || "Entry created successfully";
        // Add new entry to the list
        if (action.payload?.data) {
          state.entries.unshift(action.payload.data);
        }
      })
      .addCase(createGameEntry.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // ================= GET ALL ENTRIES =================
      .addCase(getMyGameEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyGameEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getMyGameEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.entries = [];
      })

      // ================= GET RESULTS =================
      .addCase(getEntryResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEntryResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.winningNumbers = action.payload?.winningNumbers || null;
        state.selectedEntry = action.payload?.entry || null;
      })
      .addCase(getEntryResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.results = null;
        state.winningNumbers = null;
      })

      // ================= DELETE =================
      .addCase(deleteGameEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGameEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = state.entries.filter(
          (item) => item._id !== action.payload && item.poolId !== action.payload
        );
        if (state.selectedEntry?._id === action.payload || 
            state.selectedEntry?.poolId === action.payload) {
          state.selectedEntry = null;
          state.results = null;
          state.winningNumbers = null;
        }
        state.message = "Entry deleted successfully";
      })
      .addCase(deleteGameEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  resetGameEntryState, 
  clearSelectedEntry,
  clearGameEntryError 
} = gameEntrySlice.actions;

export default gameEntrySlice.reducer;