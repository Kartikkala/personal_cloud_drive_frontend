import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface mydata {
    size: number,
    birthtime: string,
    isDirectory: boolean,
    isFile: boolean,
    symlink: boolean,
    name: string,

}

interface ResponseType {
    permission: boolean,
    exception: boolean,
    pathExists: boolean,
    content: mydata[]
}
interface InitialType {
    files: mydata[],
    status: null | string
}

const initialState: InitialType = {
    files: [],
    status: null
}

// thunk function:
export const fetch_files_fun = createAsyncThunk("fetchFiles", async (targetPath : string | undefined = "/") => {
    const token: string | null = localStorage.getItem('token');
    const response = await fetch("http://localhost:5000/api/fs/ls", {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            "Authorization": token as string
        },
        body: JSON.stringify({ targetPath: targetPath })
    })
    const json = await response.json();
    return json || [];
})

const Fetchfiles_slice = createSlice({
    name: "fetch_files",
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder.addCase(fetch_files_fun.pending, (state) => {
            return {...state, status : "pending"}
        })
        .addCase(fetch_files_fun.fulfilled, (state, action: PayloadAction<ResponseType>) => {
            return {...state, status : "fulfilled", files : action.payload.content}
        })
        .addCase(fetch_files_fun.rejected, (state) => {
            return {...state, status : "rejected"}
        })
    }
})
export default Fetchfiles_slice.reducer;