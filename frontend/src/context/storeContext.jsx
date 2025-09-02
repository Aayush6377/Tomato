import { createContext, useEffect, useState } from "react";
import { fetchFoodList, fetchCartItem, addToCartCall, reomveFromCartCall } from "../API/authApi";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [token, setToken] = useState("");
    const queryClient = useQueryClient();

    const {data: cartItems = {}} = useQuery({
        queryKey: ["cart",token],
        queryFn: () => fetchCartItem(token),
        enabled: !!token
    });

    const {data: food_list = []} = useQuery({
        queryKey: ["food_list"],
        queryFn: fetchFoodList,
        gcTime: 1000*60*60,
        staleTime: 1000*60
    });

    const addToCartMutation = useMutation({
        mutationFn: (itemId) => addToCartCall(token, itemId),
        onMutate: async (itemId) => {
            await queryClient.cancelQueries(["cart", token]);

            const prevCart = queryClient.getQueryData(["cart", token]);

            queryClient.setQueryData(["cart", token], (old = {}) => ({
                ...old,
                [itemId]: (old[itemId] || 0) + 1
            }));

            return { prevCart };
        },
        onError: (err, itemId, context) => {
            queryClient.setQueryData(["cart", token], context.prevCart);
        },
        onSettled: () => {
            queryClient.invalidateQueries(["cart", token]);
        }
    });

    const removeFromCartMutation = useMutation({
        mutationFn: (itemId) => reomveFromCartCall(token, itemId),
        onMutate: async (itemId) => {
            await queryClient.cancelQueries(["cart", token]);

            const prevCart = queryClient.getQueryData(["cart", token]);

            queryClient.setQueryData(["cart", token], (old = {}) => {
                if (!old[itemId]) return old;
                return {
                ...old,
                [itemId]: old[itemId] - 1 > 0 ? old[itemId] - 1 : 0
                };
            });

            return { prevCart };
        },
        onError: (err, itemId, context) => {
            queryClient.setQueryData(["cart", token], context.prevCart);
        },
        onSettled: () => {
            queryClient.invalidateQueries(["cart", token]);
        }
    });

    useEffect(() => {
        const checkToken = localStorage.getItem("token");
        if (checkToken){
            setToken(checkToken);
        }
    },[]);

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems){
            if (cartItems[item] > 0){
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount+=itemInfo.price*cartItems[item];
            }
        }
        return totalAmount;
    }

    const contextValue = {
        food_list,
        cartItems,
        token,
        addToCart: addToCartMutation.mutate,
        removeFromCart: removeFromCartMutation.mutate,
        getTotalCartAmount,
        setToken
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;