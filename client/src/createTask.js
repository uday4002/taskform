import React, { useState,useEffect } from 'react'
import CreateTaskForm from './createtaskform'
import axios from 'axios'
import Cookie from 'js-cookie'

function CreateTask() {
  const [openForm,setOpenForm]=useState(false)
  const [tasks,setTasks]=useState()

  const handleCreateTask=()=>{
    setOpenForm(true)
  }

  const handleDiscard=()=>{
    setOpenForm(false)
  }

  const fetchTasks=async()=>{
    try{
      const token=Cookie.get("jwt-token")
      const responce=await axios.post("http://localhost:3001/fetchtasks",{token})
      setTasks(responce.data)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    fetchTasks()
  },[])
  return (
    <div>   
        {!openForm?
        (<div className="createtask-home-container">
            <button className='createtask-button' onClick={handleCreateTask}>create task</button><br/>
            <div>
              <button className='showtasks-buttons'>Pending</button>
              <button className='showtasks-buttons'>Completed</button>
              <button className='showtasks-buttons'>All</button>
            </div>
            <div className='tasks-container'>
              {tasks!==undefined?
              (tasks.map(user=>(      
                <li key={user._id} className='list-item'>
                    <div className='task-card'>
                        <h1><sapn className="span-ele">Task Name : </sapn><sapn className="span-com">{user.taskName}</sapn></h1><br/>
                        <h1 className='span-com-desc'><sapn className="span-ele">Description : </sapn><sapn className="span-com">{user.taskDescription}</sapn></h1>
                        <div className='align-task-card-buttons'>
                            <button className='task-edit-button'>Edit</button>
                            <button className='task-delete-button'>Delete</button>
                        </div>
                    </div>
                </li>     
              ))):""}
            </div>
          </div>)
        :
        <CreateTaskForm onDiscard={handleDiscard}/>
        } 
        
    </div>
  )
}

export default CreateTask


