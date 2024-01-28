import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    student: {},
    
};

export const redux = createSlice({
    name: "Redux States",
    initialState,
    reducers: {
        setStudent: (state, action) => {
            state.student = action.payload;
        },
       
    },
});

// Action creators are generated for each case reducer function
export const {
    setStudent,
    
} = redux.actions;

export default redux.reducer;
