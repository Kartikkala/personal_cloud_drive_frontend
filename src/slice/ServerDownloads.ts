import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type of download objects received from the server
interface DownloadStatus {
    gid: string; // Unique ID of the download
    status: "active" | "waiting" | "paused" | "complete" | "error";
    totalLength: string;
    completedLength: string;
    downloadSpeed: string;
    errorCode : string;
    errorMessage : string;
    file : string | undefined;
}

interface DownloadState {
    downloads: DownloadStatus[];
}

const initialState: DownloadState = {
    downloads: [],
};

const downloadSlice = createSlice({
    name: "serverDownload",
    initialState,
    reducers: {
        updateDownloads: (state, action: PayloadAction<DownloadStatus[]>) => {
            state.downloads = action.payload; // Update all downloads at once
        },
    },
});

export const { updateDownloads } = downloadSlice.actions;
export default downloadSlice.reducer;
