import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";
import { useContext , useEffect, useState } from "react";
import { StoreContext } from "../../context/storeContext";
import { placeOrderCall } from "../../API/authApi";

const PlaceOrder = () => {
    const {getTotalCartAmount, cartItems, food_list, token} = useContext(StoreContext);
    const [formData,setForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: ""
    });

    const navigate = useNavigate();

    const handleFormData = (e) => {
        setForm(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    useEffect(() => {
        if (!token){
            navigate("/");
        }
        else if (getTotalCartAmount() === 0){
            navigate("/cart");
        }
    }, [token]);

    const placeOrder = async (e) => {
        e.preventDefault();
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0){
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });
        
        let orderData = {
            address: formData,
            items: orderItems,
            amount: getTotalCartAmount() + 2
        }

        const res = await placeOrderCall(token,orderData);
        
        if (res.success){
            const {session_url} = res;
            window.location.replace(session_url);
        }
        else{
            console.log(res);
            alert("Error");
        }
    }

    return (
        <form onSubmit={placeOrder} className="place-order">
            <div className="place-order-left">
                <p className="title">Delivery Information</p>
                <div className="multi-fields">
                    <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleFormData} required/>
                    <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleFormData} required/>
                </div>
                <input type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleFormData} required/>
                <input type="text" name="street" placeholder="Street" value={formData.street} onChange={handleFormData} required/>
                <div className="multi-fields">
                    <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleFormData} required/>
                    <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleFormData} required/>
                </div>
                <div className="multi-fields">
                    <input type="text" name="zipCode" placeholder="Zip code" value={formData.zipCode} onChange={handleFormData} required/>
                    <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleFormData} required/>
                </div>
                <input type="text" name="phone" id="phone" placeholder="Phone" value={formData.phone} onChange={handleFormData} required/>
            </div>
            
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>${getTotalCartAmount() > 0 ? 2 : 0}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <strong>Total</strong>
                            <strong>${getTotalCartAmount() > 0 ? getTotalCartAmount() + 2 : 0}</strong>
                        </div>
                    </div>
                    <button onClick={() => navigate("/order")}>PROCEED TO CHECKOUT</button>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
