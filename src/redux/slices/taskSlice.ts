import { createAsyncThunk, createSlice , PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";

const firebaseURL = "https://demowebapp-5689a-default-rtdb.firebaseio.com/tasks"

interface Task{
    id : string;
    title : string;
    assignee : string;
    isCompleted : boolean;
}

interface TaskState {
    tasks : Task[];
    loading : boolean;
    error : string | null;
    filter : string;
    assigneeFilter : string;
}

const initialState: TaskState = {
    tasks : [],
    loading: false,
    error: null,
    filter : "all",
    assigneeFilter : "",
}


export const fetchTasks = createAsyncThunk<Task[]>(
    "task/fetchTasks",
    async () => {
        const response = await axios.get(`${firebaseURL}.json`);
        const data = response.data;

        if(!data) return [];

        return Object.keys(data).map((key) => ({
            id : key,
            ...data[key]
        }))
    }
)

export const createTask = createAsyncThunk<Task , Omit<Task, "id">>(
    "task/createTask",
    async (task) => {
        const response = await axios.post(`${firebaseURL}.json`, task);
        const data = response.data;
        return {...task , id : data.name}
    }
)

// Slice
const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {

        setFilter(state , action:PayloadAction<string>){
            state.filter = action.payload
        },

        setAssigneeFilter(state, action: PayloadAction<string>){
            state.assigneeFilter = action.payload
        }
    },
    extraReducers: (builder) => {
        
        const setLoadingTrue = (state:TaskState) => {
            state.loading = true;
            state.error = null;
        }

        const setLoadingfalseWithError = (state:TaskState , action:any) => {
            state.loading = false;
            state.error = action.error.message || "Something went wrong"
        }

        // fetching Tasks

        builder
        .addCase(fetchTasks.pending, setLoadingTrue)
        .addCase(fetchTasks.fulfilled , (state , action: PayloadAction<Task[]>) => {
            state.loading = false;
            state.tasks = action.payload;
        })
        .addCase(fetchTasks.rejected , setLoadingfalseWithError)

        // Createing Task 

        builder
        .addCase(createTask.pending, setLoadingTrue)
        .addCase(createTask.fulfilled , (state , action: PayloadAction<Task>) => {
            state.loading = false;
            state.tasks.push(action.payload);
        })
        .addCase(createTask.rejected , setLoadingfalseWithError)
    }
})


export const {setFilter , setAssigneeFilter} = taskSlice.actions;

export default taskSlice.reducer;
