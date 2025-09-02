import axios from "axios";

export const url = "https://tomato-backend-6jff.onrender.com";

export const api = axios.create({
    baseURL: url
});

export const addFood = async (foodData) => {
    try {
        const res = await api.post("/api/food/add",foodData,{
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return res.data;
    } catch (err) {
        throw err.response?.data || err;
    }
}

export const fetchList = async () => {
    try {
        const res = await api.get("/api/food/list");
        return res.data.data;
    } catch (err) {
        throw err.response?.data || err;
    }
}

export const removeFood = async (id) => {
    try {
        const res = await api.delete(`/api/food/remove/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const fetchOrderList = async () => {
    try {
        const res = await api.get("/api/order/list");
        return res.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const changeStatus = async ({orderId,status}) => {
    try {
        const res = await api.post("/api/order/status",{
            orderId, status
        });
        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}
