import {createSlice} from "@reduxjs/toolkit"
function localJobStorage()
{
   try {
      const savedJob = localStorage.getItem('job');
      return savedJob ? JSON.parse(savedJob) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
       return []; 
}
}

const JobSlice=createSlice({
    name:"job",
    initialState:localJobStorage(),
    reducers:{
         add:(state,action)=>{
            localStorage.setItem('job',JSON.stringify([...state,action.payload]))
            return [...state,action.payload]
         },
         remove:(state,action)=>{
            const newState = state.filter((item) => item.id !== action.payload);
           localStorage.setItem('job',JSON.stringify(newState));
            return newState;
         }
    }
})

export const {add,remove}=JobSlice.actions;
export default JobSlice.reducer;