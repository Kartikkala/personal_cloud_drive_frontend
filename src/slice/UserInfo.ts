import { createSlice } from "@reduxjs/toolkit";

interface User{
    name : string,
    email : string,
    admin : boolean
}

const initialState: { user: User | null} = {
    user : null
}

const userSlice = createSlice(
    {
        name: "user",
        initialState,
        reducers : {
            setUser : (state, action)=>{
                state.user = action.payload
            },
            clearUser : (state)=>{
                state.user = null;
            }
        }
    }
)

export const {setUser, clearUser} = userSlice.actions
export default userSlice.reducer;