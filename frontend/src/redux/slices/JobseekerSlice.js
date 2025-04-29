import { createSlice } from "@reduxjs/toolkit";


const JobseekerSlice= createSlice({
    name:'Jobseeker',
    initialState:{
        JobApplication:[]
    },reducers:{
        addJobApplication:(state,action)=>{
            state.JobApplication=action.payload
            },
        
    }
})

export const {addJobApplication}=JobseekerSlice.actions;

export default JobseekerSlice.reducer;