import "./Verify.css";
import {useNavigate, useSearchParams} from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { verifyPaymentCall } from "../../API/authApi";
import { useMutation } from '@tanstack/react-query';
import { useContext, useEffect } from "react";
import { StoreContext } from "../../context/storeContext";

const Verify = () => {
    const {token} = useContext(StoreContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const mutation = useMutation({
        mutationFn: () => verifyPaymentCall(success,orderId,token),
        onSuccess: () => {
            navigate("/myorders");
        },
        onError: () => {
            navigate("/");
        }
    });

    useEffect(() => {
        mutation.mutate();
    }, []);

    return (
        <div className="verify">
            <Loader />
        </div>
    )
}

export default Verify;
