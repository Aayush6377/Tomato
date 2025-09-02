import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import LoginPopup from "../../components/LoginPopup/LoginPopup";
import { ToastContainer } from "react-toastify";

const AppLayout = () => {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
        {showLogin ? <LoginPopup setShowLogin={setShowLogin}/> : <></>}
        <div className="app">
            <Header setShowLogin={setShowLogin}/>
            <ToastContainer />
            <Outlet />
        </div>
         <Footer />
        </>
    )
}

export default AppLayout;