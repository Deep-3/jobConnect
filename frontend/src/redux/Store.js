import {configureStore} from "@reduxjs/toolkit"
import JobSlice from "./slices/JobSlice"

export const store=configureStore(
    {
        reducer:{
            job:JobSlice
        }
    }
)