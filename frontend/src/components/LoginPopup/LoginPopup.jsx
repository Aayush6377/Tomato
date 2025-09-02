import React, { useContext, useState } from 'react'
import "./LoginPopup.css";
import { assets } from '../../assets/assets';
import { useMutation } from '@tanstack/react-query';
import { authUser } from "../../API/authApi";
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/storeContext';

const LoginPopup = ({setShowLogin}) => {
    const {setToken} = useContext(StoreContext);
    const [currState ,setCurrState] = useState("Sign up");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [formError, setFormError] = useState({});

    const mutation = useMutation({
        mutationFn: authUser,
        onSuccess: (data) => {
            toast.success(data.message);
            localStorage.setItem("token",data.token);
            setToken(data.token);
            setFormData({
                name: "",
                email: "",
                password: ""
            });
            setShowLogin(false);
        },
        onError: (err) => {
            setFormError(err.data);
        }
    });

    const handleChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
        setFormError(prev => ({...prev, [e.target.name]: ""}));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const page = currState === "Sign up" ? "register" : "login";
        mutation.mutate({page, formData});
    }

    return (
        <div className='login-popup'>
            <form onSubmit={handleSubmit} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Login" ? null : 
                        (<>
                        <input type="text" name="name" id="name" placeholder='Your name' value={formData.name} onChange={handleChange} required />
                        {formError.name && <p className="error-text">{formError.name}</p>}
                        </>)
                    } 
                    <input type="email" name="email" id="email" placeholder='Your email' value={formData.email} onChange={handleChange} required />
                    {formError.email && <p className="error-text">{formError.email}</p>}
                    <input type="password" name="password" id="password" placeholder='Password' value={formData.password} onChange={handleChange} required />
                    {formError.password && <p className="error-text">{formError.password}</p>}
                </div>
                <button>{currState === "Sign up" ? "Create Account": "Login"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, i agree to the terms of use & privacy policy</p>
                </div>
                {currState === "Login" ? 
                <p>Create a new account? <span onClick={() => setCurrState("Sign up")}>Click here</span></p> : 
                <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>}
            </form>
        </div>
    )
}

export default LoginPopup
