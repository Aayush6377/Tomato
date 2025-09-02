import "./MyOrders.css";
import { fetchOrders } from "../../API/authApi";
import { useContext } from "react";
import { StoreContext } from "../../context/storeContext";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader/Loader";
import { assets } from "../../assets/assets";

const MyOrders = () => {
    const { token } = useContext(StoreContext);
    const { data: orders, isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: () => fetchOrders(token),
        enabled: !!token,
        gcTime: 1000*60*60
    });

    if (isLoading){
        return <Loader />
    }

    return (
        <div className="my-orders">
            <h2>My Orders</h2>
            <div className="container">
                {orders?.map((order,index) => {
                    return (
                        <div key={index} className="my-orders-order">
                            <img src={assets.parcel_icon} alt="" />
                            <p>{order.items.map((item,index)=>{
                                if (index === order.items.length - 1){
                                    return item.name+" x "+item.quantity;
                                }
                                else{
                                    return item.name+" x "+item.quantity+", ";
                                }
                            })}</p>
                            <p>${order.amount}</p>
                            <p>Items: {order.items.length}</p>
                            <p><span>&#x25cf;</span><b>{order.status}</b></p>
                            <button>Track Order</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MyOrders;
