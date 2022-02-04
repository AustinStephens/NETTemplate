import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import agent from "../../api/agent";
import LoadComponent from "../../LoadComponent";
import { useAppDispatch } from "../../store/configureStore";
import { setBasket } from "../baskets/basketSlice";
import CheckoutPage from "./CheckoutPage";

const stripePromise = loadStripe('pk_test_51KNA1rGFXeJk76g8fDA6ZdNRZjd4vGoZb2ejem7JymFmRi9axZwIv3VZazUpbwjA5b2jcI7y06DlWCPo56pom8OA00PpI5DE5J');

export default function CheckoutWrapper() {

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Payments.createPaymentIntent()
            .then(basket => dispatch(setBasket(basket)))
            .catch(e => console.log(e))
            .finally(() => setLoading(false))
    }, [dispatch])

    if(loading) return <LoadComponent message='Loading checkout...' />
    
    return (
            <Elements stripe={stripePromise}>
                <CheckoutPage />
            </Elements>
    )
}