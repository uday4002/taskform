import "./createtaskform.css"
import React, {useState,useEffect} from 'react'
import {FileUploader} from "react-drag-drop-files"
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import axios from 'axios'
import Cookie from 'js-cookie'
import {FaTrash} from 'react-icons/fa'
import { ReactMediaRecorder } from 'react-media-recorder';

function CreateTaskForm({onDiscard}) {
    const [files,setFiles]=useState([])
    const [isFilesThree,setIsFilesThree]=useState(false)
    const [date,setDate]=useState(new Date())
    const [calendar,setCalendar]=useState(false)
    const [hotelId,setHotelId]=useState("")
    const [users,setUsers]=useState([])
    const [selectEmployees,setSelectEmployees]=useState([])
    const [taskName,setTaskName]=useState("")
    const [taskDescription,setTaskDescription]=useState("")
    const [mediaBlobUrl, setMediaBlobUrl] = useState("")
    const [audioBlob, setAudioBlob] = useState("")
    const [isRecordingRequired, setIsRecordingRequired] = useState(false)

    const fileTypes=["jpg","png","gif"]

    const handleImage=(newFiles)=>{
        if (files.length+newFiles.length>3){
            setIsFilesThree(true)
        }else{
            setFiles((prevFiles)=>[...prevFiles, ...newFiles])
            if (files.length>=2){
                setIsFilesThree(true)
            }
        }
    }

    const handleImageDelete=(index)=>{
        setFiles((prevFiles)=>prevFiles.filter((_, idx)=>idx!==index))
        if (files.length<=3){
            setIsFilesThree(false)
        }
    }

    const handleDate=(value)=>{
        setDate(value)
    }

    const handleCalendar=()=>{
        setCalendar(true)
    }

    const handleHideCalendar=()=>{
        setCalendar(false)
    }

    useEffect(()=>{
        const fetchHotelId=async ()=>{
            const token=Cookie.get("jwt-token")
            if (token){
                try{
                const response=await axios.post("http://localhost:3001/hotel",{ token })
                setHotelId(response.data)
                }catch(err){
                    console.log(err)
                }
            }
        }
        fetchHotelId()
    }, [])

    useEffect(()=>{
        const fetchHotelUsers=async ()=>{
            const token = Cookie.get("jwt-token")
            if (token && hotelId) {
                try{
                const response = await axios.post("http://localhost:3001/hotelusers",{ token, hotelId })
                setUsers(response.data.hotelUsers)
                }catch(err){
                    console.log(err)
                }
            }
        }
        fetchHotelUsers()
    }, [hotelId])

    const handleSetEmployees=(event)=>{
        const options=event.target.options
        const selectedValues=[]
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected && !selectEmployees.find(user=>user.username===options[i].value)) {
                const selectedUser = users.find(user => user.username === options[i].value)
                selectedValues.push({ username: selectedUser.username, userId: selectedUser.userId })
            }
        }
        setSelectEmployees(prevEmployees => [...prevEmployees, ...selectedValues])
    }

    const handleEmployeeDelete=(index)=>{
        setSelectEmployees((employee)=>employee.filter((_,idx)=>idx!==index))
    }

    const handleFormSubmit=async(e)=>{
        e.preventDefault()
        if(!mediaBlobUrl){
            setIsRecordingRequired(true);
            return;
        }
        let formData=new FormData()
        formData.append('taskName',taskName)
        formData.append('taskDescription',taskDescription)
        formData.append('date',date)
        formData.append('selectEmployees',JSON.stringify(selectEmployees))
        formData.append('hotelId',hotelId)
        formData.append('audio',audioBlob,'recording.wav');
    
        files.forEach(file => {
            formData.append('images',file)
        });
    
        try {
            await axios.post("http://localhost:3001/createtask",formData)
            .then(res=>console.log(res))
        }catch(err){
            console.log(err)
        }
       
        setTaskName("")
        setTaskDescription("")
        setFiles([])
        setIsFilesThree(false)
        setSelectEmployees([])
        setCalendar(false)
        setDate(new Date())
        onDiscard()
    }
    

    return (
        <div>
            <div className='createtaskform-container'>
                <div className='createtaskform-form-container'>
                    <div className='align-discard-button'>
                        <button type="button" className='createtaskform-discard-button' onClick={onDiscard}>Discard</button>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        <div className='createtaskform-fields'>
                            <label className='createtaskform-label' htmlFor='taskName'>Task Name</label><br />
                            <input className='createtaskform-input' id='taskName' placeholder="Enter task name" value={taskName} onChange={(e)=>setTaskName(e.target.value)} required/>
                        </div>
                        <div className='createtaskform-fields'>
                            <label className='createtaskform-label' htmlFor='taskDescription'>Description</label><br />
                            <textarea className='createtaskform-input createtaskform-input-textarea' placeholder='Enter task description' id="taskDescription" rows="8" value={taskDescription} onChange={(e)=>setTaskDescription(e.target.value)}></textarea>
                        </div>
                        <div className='createtaskform-fields'>
                            <label className='createtaskform-label' htmlFor='taskVoiceNote'>Voice Note</label><br />
                            <ReactMediaRecorder
                                audio
                                onStop={(blobUrl,blob) =>{
                                        setMediaBlobUrl(blobUrl)
                                        setAudioBlob(blob)
                                        setIsRecordingRequired(false)
                                    }
                                }
                                render={({ status, startRecording, stopRecording}) => (
                                <div>
                                    <p>Status: <span className="createtaskform-voice-status">{status}</span></p>
                                    <button type="button" onClick={startRecording} className="createtaskform-start-button">Start Recording</button>
                                    <button type="button" onClick={stopRecording} className="createtaskform-stop-button">Stop Recording</button>   
                                </div>
                                )}
                            />
                            {mediaBlobUrl && <audio src={mediaBlobUrl} controls className="createtaskform-audio"/>}
                            {isRecordingRequired && <p style={{color:'red'}}>Please record audio before submitting.</p>}
                        </div>
                        <div className='createtaskform-fields'>
                            <label className='createtaskform-label' htmlFor='file-upload'>Upload your images (max:3)</label>
                            {!isFilesThree?<div className="createtaskform-fileuploader">
                                <FileUploader
                                    handleChange={handleImage}
                                    types={fileTypes}
                                    multiple
                                    hoverTitle="Drop here"
                                    label="Drag & drop your files or click to upload"
                                />
                            </div>:""}
                            {files.length===3?<p className="createtask-image-length-info">You reached the maximum limit</p>:""}
                            {files.length>0?
                                (
                                    <ul>
                                        <div className="createtaskform-images-container">
                                            {files.map((file,index)=>(
                                                <li key={index} className="createtaskform-image-list-item">
                                                    <div className="createtaskform-image-card">
                                                        <img src={URL.createObjectURL(file)} alt={`uploaded-${index}`} className="createtaskform-image" />
                                                        <button type="button" className="createtaskform-image-delete-button" onClick={()=>handleImageDelete(index)}>Delete</button>
                                                    </div>
                                                </li>
                                            ))}
                                        </div>
                                    </ul>
                                )
                                :
                                (<p className="createtask-image-info">No files uploaded yet.</p>)}
                        </div>
                        <div className="createtaskform-fields">
                            <label className="createtaskform-label">Duration</label>
                            {!calendar?
                                <div>
                                    <button type="button" onClick={handleCalendar} className="createtaskform-choose-from-calender">Choose from calendar</button>
                                    <p className="createtaskform-date-format">Work complete before <span className="createtaskform-date-format-span">{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</span></p>
                                </div>
                                :
                                <div>
                                    <button type="button" onClick={handleHideCalendar} className="createtaskform-choose-from-calender">Hide Calendar</button>
                                    <Calendar onChange={handleDate} value={date} className="custom-calendar"/>
                                    <p className="createtaskform-date-format">Work complete before: <span className="createtaskform-date-format-span">{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</span></p>
                                </div>
                            }
                        </div>
                        <div className="createtaskform-fields">
                            <label className="createtaskform-label">Assign To</label><br/>
                                <select multiple={true} id="employeeSelect" value={selectEmployees.map(emp => emp.username)} onChange={handleSetEmployees} className="createtaskform-employees-select-list" required>
                                    {users.map((item,idx)=>(
                                        <option key={idx} value={item.username}>{item.username}</option>
                                    ))}
                                </select>
                                {selectEmployees.length>0 && (
                                    <ul className="parent-list">
                                        {selectEmployees.map((item,idx)=>(
                                            <div key={idx} className="createtaskform-employee-card">
                                                <li className="createtaskform-employee" key={idx}>{item.username}</li>
                                                <FaTrash className="createtaskform-icon" onClick={()=>handleEmployeeDelete(idx)}/>
                                            </div>
                                        ))}
                                    </ul>
                                )}
                        </div>
                        <button className="createtaskform-submit-button" type="submit">Submit</button>  
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateTaskForm;
