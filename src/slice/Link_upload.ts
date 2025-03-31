import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ResponseType {
    guid: string | undefined,
    valid : boolean,
    sizeLimitExceeded : boolean,
    error : boolean
}
interface InitialType {
    data: ResponseType | null,
    status: null | string
}

const initialState: InitialType = {
    data: {
        guid: undefined,
        valid: true,
        sizeLimitExceeded: false,
        error : false
    },
    status: null
}

// thunk function:
export const upload_link = createAsyncThunk("aria/downloadFileServer", async (uri: string) => {
    const token: string | null = localStorage.getItem('token');
    const response = await fetch("http://localhost:5000/api/aria/downloadFileServer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : token as string
        },
        body: JSON.stringify({uri})
    })
    const json = await response.json();
    return json;
})

const Linkupload_slice = createSlice({
    name: "link_upload",
    initialState,
    reducers: {
        guiddelete:(state)=> initialState
    },
    extraReducers: (builder) => {
        builder.addCase(upload_link.pending, (state) => {
            return {...state, status : "pending" }
        })
       .addCase(upload_link.fulfilled, (state, action: PayloadAction<ResponseType>) => {
            return {...state, status : "fulfilled", data : action.payload}
        })
        .addCase(upload_link.rejected,(state)=>{
            return {...state, status : "rejected"}
        })
    }
})
export const { guiddelete } = Linkupload_slice.actions
export default Linkupload_slice.reducer;