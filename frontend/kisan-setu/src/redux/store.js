import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./userSlice"
import farmerSlice from"./farmerSlice"
import mapSlice from "./mapSlice"

export const store = configureStore({
    reducer:{
        user:userSlice,
        farmer:farmerSlice,
        map:mapSlice
    }
})
