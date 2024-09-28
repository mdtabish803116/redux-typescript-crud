import React from 'react';
import { useSelector } from "react-redux";
import { RootState } from '../redux/store';

interface Task{
    id : string;
    title : string;
    assignee : string;
    isCompleted : boolean;
}

interface TaskListProps{
    tasks : Array<Task>
}


const TaskList:React.FC<TaskListProps> = ({tasks}) => {

    const {loading , error} = useSelector((state : RootState) => state.tasks);

    if(loading){
        return<p>Loading...</p>
    }

    if (error){
        return<p>Error : {error}</p>
    }

    return(
       <div style = {{display : "grid" , gridTemplateColumns : "repeat(3 , 1fr"}}>
            {
                tasks.map((task) => (
                    <div key = {task.id} style = {{border: "1px solid red"}}>
                        <p>Title - {task.title}</p>
                        <p>Status - <span style = {{color : task.isCompleted ? "green" : "red"}}>{task.isCompleted ? "Completed" : "Incomplete"}</span></p>
                    </div>
                ))
            }
       </div>
    )
}

export default TaskList