import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import CreateTask from './createTask';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" Component={App}/>
      <Route path="/createtask" Component={CreateTask}/>
    </Routes>
  </BrowserRouter>
);

