import "./Navbar.css";
import {assets} from "../../assets/assets";

const Navbar = () => {
    return (
        <div>
            <div className="navbar">
                <img className="logo" src={assets.logo} alt="" />
                <img className="Profile" src={assets.profile_image} alt="" />
            </div>
        </div>
    )
}

export default Navbar
