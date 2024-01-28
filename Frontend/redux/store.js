import { configureStore } from "@reduxjs/toolkit";
import redux from "./redux";

export default configureStore({
    reducer: {
        redux: redux,
    },
});
