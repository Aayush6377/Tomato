import "./Orders.css";
import { fetchOrderList, changeStatus } from "../../API/foodApi";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Loader from "../../components/Loader/Loader";
import {assets} from "../../assets/assets.js";

const Orders = () => {
    const queryClient = useQueryClient();
    const { data: orderList, isLoading, isError, error } = useQuery({
        queryKey: ["orderList"],
        queryFn: fetchOrderList,
    });

    const mutation = useMutation({
        mutationFn: changeStatus,
        onError: (err) => {
            toast.error(err.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["orderList"]);
        }
    });

    if (isLoading){
        return <Loader />
    }

    if (isError){
        toast.error(error.message);
    }

    return (
        <div className="order add">
            <h3>Order Page</h3>
            <div className="oreder-list">
                {orderList.map((order,index) => {
                    return <div key={index} className="order-item">
                        <img src={assets.parcel_icon} alt="" />
                        <div>
                            <p className="order-item-food">
                                {order.items.map(item => `${item.name} x ${item.quantity}`).join(", ")}
                            </p>
                            <p className="order-item-name">
                                {order.address.firstname+" "+order.address.lastname}
                            </p>
                            <div className="order-item-address">
                                <p>{order.address.street+","}</p>
                                <p>{order.address.city+", "+order.address.state+", "+order.address.country+", "+order.address.zipCode}</p>
                            </div>
                            <p>{order.address.phone}</p>
                        </div>
                        <p>Items: {order.items.length}</p>
                        <p>${order.amount}</p>
                        <select onChange={(e) => mutation.mutate({orderId: order._id, status: e.target.value})} value={order.status}>
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                })}
            </div>
        </div>
    )
}

export default Orders;
