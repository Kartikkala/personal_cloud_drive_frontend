import { PayloadAction, createSlice } from "@reduxjs/toolkit";


type ArrayOfObjects = Array<Record<string, any>>;
const initialState: ArrayOfObjects = [];
const StatusUpdate_slice = createSlice({
    name: "Status_update",
    initialState,
    reducers: {
        changestate: (state, obj) => {
            return [obj.payload];
        },
        reversestate: (state) => initialState
    },

})

export const { changestate, reversestate } = StatusUpdate_slice.actions
export default StatusUpdate_slice.reducer;