import React, { useState } from 'react';
import './App.css'; 
import About from './Components/About';
import Navbar from    './Components/Navbar';
import TextForm from  './Components/TextForm';
import Alert from './Components/Alert';
import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';

function App() {

    const [mode, setMode] = useState('light');
    const [alert, setAlert] = useState(null);

    const showAlert = (message, type)=>{
        setAlert({
            msg: message,
            type: type
        })
        setTimeout(() => {
            setAlert(null)
        }, 3000);
    }

    const toggleMode =(cls)=>{
        console.log(cls)
        // document.body.classList.add('bg-'+cls)
        if(mode === 'light'){
            setMode('dark');
            document.body.style.backgroundColor = '#061c4f';
            // document.body.style.color = 'white';
            showAlert(" Dark mode is enabled","success")
            document.title = "TextUtils - Dark Mode"
            setInterval(() => {
                document.title = "TextUtils is amazing"
            }, 2000);
            setInterval(() => {
                document.title = "Install TextUtils now!"
            }, 1500);
        }
        else{
            setMode('light');
            document.body.style.backgroundColor = 'white';
            showAlert(" Light mode is enabled","success")
            document.title = "TextUtils - Light Mode"
        }
    }
    return (
        <>
        <BrowserRouter>
        <Navbar title='TextUtils' mode = {mode} toggleMode={toggleMode}/>
        <Alert alert={alert} />
        <div className="container my-3">
        
        <Routes>
            <Route path="/about" element={<About mode={mode}/>} />
            <Route path="/" element = {<TextForm showAlert ={showAlert} heading = 'Try: TextUtils - Word counter, Character counter, Remove extra spaces' mode={mode}/>} />
        </Routes>
        </div>
        </BrowserRouter>
        </>
    );
}

export default App;
