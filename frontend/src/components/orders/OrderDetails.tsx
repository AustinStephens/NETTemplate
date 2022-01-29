import { Box, Button, Grid, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import LoadComponent from "../../LoadComponent";
import { BasketItem } from "../../models/basket";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import BasketSummary from "../baskets/BasketSummary";
import BasketTable from "../baskets/BasketTable";
import { orderSelectors } from "./orderSlice";

export default function OrderDetails() {
    
    const {id} = useParams<{id: string}>();
    const order = useAppSelector(state => orderSelectors.selectById(state, id));
    const {status: orderStatus} = useAppSelector(state => state.orders);

    if(orderStatus.includes('pending')) return <LoadComponent message='Loading Product...' />
    if(!order) return <h3>Product not found</h3>
    const {shippingAddress} = order;
    const subtotal = order.orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    return (
        <>
            <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ p: 2 }} gutterBottom variant='h3'>Order #{order.id} - {order.orderStatus}</Typography>
                <Button component={Link} to='/orders' sx={{m:2, p:3}} size='large' variant='contained'>Back To Orders</Button>
            </Box>
            <BasketTable items={order.orderItems as BasketItem[]} isBasket={false} />
            <Grid container>
                <Grid item xs={6} />
                <Grid item xs={6}>
                    <BasketSummary subtotal={subtotal} />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    <Typography sx={{ p: 2 }} gutterBottom variant='h3'>Shipping To</Typography>
                </Grid>
                <Grid item xs={12} sx={{ p: 2 }} >
                    <Typography variant='h6'>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
                </Grid>
                <Grid item xs={12} sx={{ p: 2 }} marginBottom={10}>
                    <Typography variant='h6'>{shippingAddress.address1} {shippingAddress.address2}&nbsp;&nbsp;{shippingAddress.city}, {shippingAddress.state}, {shippingAddress.country}&nbsp;&nbsp;{shippingAddress.zip}</Typography>
                </Grid>
            </Grid>
            
        </>
    )
}