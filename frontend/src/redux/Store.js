import {configureStore} from "@reduxjs/toolkit"
import JobSlice from "./slices/JobSlice"
import AuthSlice from "./slices/AuthSlice"
import UiSlice from "./slices/UiSlice"

export const store=configureStore(
    {
        reducer:{
            job:JobSlice,
            auth:AuthSlice,
            ui:UiSlice
        }
    }
)