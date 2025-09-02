import { useState } from "react";
import "./Home.css";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";

const Home = () => {
    const [category,setCategory] = useState("All");

    return (
        <div>
            <div className="header">
                <div className="header-contents">
                    <h2>Order your favorate food here</h2>
                    <p>Choose from a diverse menu featuring a delectable array of dishers crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meat at a time</p>
                    <button>View Menu</button>
                </div>
            </div>
            <ExploreMenu category={category} setCategory={setCategory}/>
            <FoodDisplay category={category} />
            <AppDownload />
        </div>
    )
}

export default Home
