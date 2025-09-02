import axios from "axios";

export const url = "http://localhost:3000";

export const api = axios.create({
    baseURL: url
});

export const authUser = async ({page, formData}) => {
    try {
        const res = await api.post(`/api/user/${page}`,formData);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const fetchFoodList = async () => {
    try {
        const res = await api.get("/api/food/list");
        return res.data.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const fetchCartItem = async (token) => {
    try {
        const res = await api.get("/api/cart/get",{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return res.data.cart;
    } catch (error) {
        throw error.response?.data;
    }
}

export const addToCartCall = async (token, itemId) => {
    try {
        const res = await api.post("/api/cart/add",{itemId},{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        return error.response?.data;
    }
}

export const reomveFromCartCall = async (token, itemId) => {
    try {
        const res = await api.delete("/api/cart/remove",{
            headers: {
                "Authorization": `Bearer ${token}`
            },
            data: { itemId }
        });
        return res.data;
    } catch (error) {
        return error.response?.data;
    }
}

export const placeOrderCall = async (token, orderData) => {
    try {
        const res = await api.post("/api/order/place",orderData,{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return res.data;
    } catch (error) {
        return error.response?.data;
    }
}

export const verifyPaymentCall = async (success, orderId, token) => {
    try {
        const res = await api.post("/api/order/verify",{
            success: Number(success), orderId
        },{
            headers: {
                "Authorization": `Bearer ${token}` 
            }
        });
        return res.data;
    } catch (error) {
        return error.response?.data;
    }
}

export const fetchOrders = async (token) => {
    try {
        const res = await api.get("/api/order/userorders",{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return res.data.data;
    } catch (error) {
        return error.response?.data;
    }
}