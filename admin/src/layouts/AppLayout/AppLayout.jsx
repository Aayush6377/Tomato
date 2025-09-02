import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import { ToastContainer } from 'react-toastify';

const AppLayout = () => {
    return (
        <>
        <ToastContainer />
        <Header />
        <hr />
        <div className="app-content">
            <Sidebar />
            <Outlet />
        </div>
        <Footer />
        </>
    )
}

export default AppLayout;
