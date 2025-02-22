import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMenu, IUserSchema } from "../../../../types/menu";

interface TreeState {
  selectedTree: IUserSchema | null;
  treeData: IMenu[];
  tipe: "add" | "edit";
  loading: boolean;
  error?: string | null;
}

export const fetchTreeData = createAsyncThunk(
  "tree/fetchTreeData",
  async () => {
    const res = await fetch("/api/fetch-data");
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    return data;
  }
);

const initialState: TreeState = {
  selectedTree: null,
  treeData: [],
  tipe: "add",
  loading: false,
  error: null,
};

const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    setSelectedTree(state, action: PayloadAction<IUserSchema | null>) {
      state.selectedTree = action.payload;
    },
    setTreeData(state, action: PayloadAction<IMenu[]>) {
      state.treeData = action.payload;
    },
    setTipe(state, action: PayloadAction<"add" | "edit">) {
      state.tipe = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTreeData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTreeData.fulfilled, (state, action) => {
        state.loading = false;
        state.treeData = action.payload;
      })
      .addCase(fetchTreeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedTree, setTreeData, setTipe } = treeSlice.actions;
export default treeSlice.reducer;
