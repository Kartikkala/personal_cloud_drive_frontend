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
            state.push(val.payload)
            return state
        },
        removeDirectory: (state, val?) =>{
            if(val && typeof val.payload === "number")
            {
                for(let i=0;i<val.payload;i++)
                {
                    state.pop()
                }
            }
        },

    },

})

export const { setRoot, addDirectory, removeDirectory } = CurrentPath.actions
export default CurrentPath.reducer;