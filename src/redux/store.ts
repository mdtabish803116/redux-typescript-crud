import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./slices/taskSlice";


const store = configureStore({
    reducer: {
      tasks : taskReducer
    }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>

export default store