import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './redux/store'
import { fetchTasks , setFilter , setAssigneeFilter, createTask } from './redux/slices/taskSlice';
import TaskList from './components/TaskList';


const App: React.FC = () => {

  const dispatch : AppDispatch = useDispatch()
  const {tasks , filter , assigneeFilter} = useSelector((state : RootState) => state.tasks)

  const [title , setTitle] = useState<string>("");
  const [assignee , setAssignee] = useState<string>("");
  const [status , setStatus] = useState<boolean>(false);


   const filteredTask =  useMemo(() => {
    return tasks.filter(task => {
      const isAssigneeMatch = assigneeFilter ? (task.assignee === assigneeFilter) : true;
      const isSatatusMatch = filter === "all" || (filter === "completed" ? task.isCompleted : !task.isCompleted )
      return  isAssigneeMatch && isSatatusMatch
    }) 
   } , [tasks , filter , assigneeFilter])

  useEffect(()=> {
      dispatch(fetchTasks())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(createTask({title , assignee , isCompleted: status }))
  } 
 
  return (
    <div>
       <h1>Task List</h1>
      
      <div>
          <select value = {filter} onChange = {(e) => dispatch(setFilter(e.target.value))}>
              <option value = "all">All task</option>
              <option value = "incomplete">Incomplete Task</option>
              <option value = "completed">Completed Task</option>
          </select>

      <input type = "text"
         placeholder = "Filter by assignee" 
         value = {assigneeFilter}
         onChange = {(e) => dispatch(setAssigneeFilter(e.target.value))}
         />
      </div>

      <form onSubmit={handleSubmit}>

        <input type = "text"
        placeholder = "Title"
        value = {title} 
        onChange = {(e) => setTitle(e.target.value)}
        required
        />

      <input type = "text"
        placeholder = "Assignee"
        value = {assignee} 
        onChange = {(e) => setAssignee(e.target.value)}
        required
        />

        <select value = {String(status)} onChange={(e) => setStatus(e.target.value === "true")}>
        <option value = "false">Incomplete</option>
        <option value = "true">completed</option>
        </select>

        <button type = "submit">Add Task</button>
        
      </form>

        <TaskList tasks = {filteredTask}/>

      </div>
  )
}

export default App
