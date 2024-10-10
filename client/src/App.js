import './App.css';
import {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import Cookie from 'js-cookie'


function App() {

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const navigate=useNavigate()
  const handleSubmit=(e)=>{
    e.preventDefault()
    axios.post("http://localhost:3001",{email,password})
    .then((res)=>{
      Cookie.set("jwt-token",res.data.token)
      navigate("/createtask")
    })
    setEmail("")
    setPassword("")
  }

  return (
      <div className="App">
      <div className="container">
        <h1 className="heading">Login</h1>
        <form onSubmit={handleSubmit}>
          <label className="label" for="email">Email</label><br/>
          <input className="input" type="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)}/><br/>

          <label className="label" for="password">Password</label><br/>
          <input className="input" type="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)}/><br/>
          
          <button className="button" type="submit">Login</button><br/>
        </form>
      </div>
    </div>
  );
}

export default App;
