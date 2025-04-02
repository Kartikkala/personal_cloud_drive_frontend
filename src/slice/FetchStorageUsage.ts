import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface StorageUsage {
    usedSpace: number,
    totalSpace: number,
    status?: string
}

const initialState: StorageUsage = {
    usedSpace: 0,
    totalSpace: 0,
    status: 'idle'
}

export const fetchStorageUsage = createAsyncThunk("fetchStorageUsage", async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get("http://localhost:5000/api/fs/diskStats", {
        headers: {
            'Content-Type': "application/json",
            "Authorization": token as string
        }
    })
    return response.data;
})

const FetchStorageUsageSlice = createSlice({
    name: "fetchStorageUsage",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchStorageUsage.pending, (state) => {
            state.status = "pending";
        })
        .addCase(fetchStorageUsage.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.usedSpace = action.payload.usedSpace;
            state.totalSpace = action.payload.totalSpace;
        })
        .addCase(fetchStorageUsage.rejected, (state) => {
            state.status = "rejected";
        })
    }
})
export default FetchStorageUsageSlice.reducer;