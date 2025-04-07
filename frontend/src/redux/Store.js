import {configureStore} from "@reduxjs/toolkit"
import JobSlice from "./slices/JobSlice"
import AuthSlice from "./slices/AuthSlice"
import UiSlice from "./slices/UiSlice"
import JobseekerSlice from "./slices/JobseekerSlice"

export const store=configureStore(
    {
        reducer:{
            job:JobSlice,
            auth:AuthSlice,
            ui:UiSlice,
            jobseeker:JobseekerSlice
        }
    }
)