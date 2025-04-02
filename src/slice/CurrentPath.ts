import { createSlice } from "@reduxjs/toolkit";

const initialState: string[] = ["/"];


const CurrentPath = createSlice({
    name: "CurrentPath",
    initialState,
    reducers: {
        setRoot: (state) =>
        {
            return ["/"]   
        },
        addDirectory: (state, val) => {
            return [...state, val.payload];
        },
        removeDirectory: (state, val?) =>{
            if(val && typeof val.payload === "number")
            {
                for(let i=state.length-1;i>val.payload;i--)
                {
                    return state.slice(0, val.payload + 1);
                }
                return state
            }
        },

    },

})

export const { setRoot, addDirectory, removeDirectory } = CurrentPath.actions
export default CurrentPath.reducer;