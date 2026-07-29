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
  entry: null,
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
      state.entry = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= CREATE =================

      .addCase(createGameEntry.pending, (state) => {
        state.loading = true;
        state.success = false;
      })

      .addCase(createGameEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.entry = action.payload.data;
        state.message = action.payload.message;
      })

      .addCase(createGameEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= GET =================

      .addCase(getMyGameEntries.pending, (state) => {
        state.loading = true;
      })

      .addCase(getMyGameEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })

      .addCase(getMyGameEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= DELETE =================

      .addCase(deleteGameEntry.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteGameEntry.fulfilled, (state, action) => {
        state.loading = false;

        state.entries = state.entries.filter(
          (item) => item._id !== action.payload
        );
      })

      .addCase(deleteGameEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetGameEntryState } = gameEntrySlice.actions;

export default gameEntrySlice.reducer;