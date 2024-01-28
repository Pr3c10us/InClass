import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    student: {},
    lecturer:{},
    
};

export const redux = createSlice({
    name: "Redux States",
    initialState,
    reducers: {
        setStudent: (state, action) => {
            state.student = action.payload;
        },
        setLecturer: (state, action) => {
            state.lecturer = action.payload;
        },
       
    },
});

// Action creators are generated for each case reducer function
export const {
    setStudent,
    setLecturer,
    
} = redux.actions;

export default redux.reducer;
