import Navbar from "../../components/Navbar/Navbar";

const Header = ({setShowLogin}) => {
    return (
        <header>
            <Navbar setShowLogin={setShowLogin}/>
        </header>
    )
}

export default Header;