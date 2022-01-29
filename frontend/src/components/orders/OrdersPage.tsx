import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import LoadComponent from "../../LoadComponent";
import { useAppSelector, useAppDispatch } from "../../store/configureStore";
import { currencyFormat, dateFormat } from "../../util/util";
import { fetchOrdersAsync, orderSelectors } from "./orderSlice";

export default function OrdersPage() {
    
    const orders = useAppSelector(orderSelectors.selectAll);
    const { ordersLoaded } = useAppSelector(state => state.orders);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!ordersLoaded) dispatch(fetchOrdersAsync());
    }, [ordersLoaded, dispatch])

    if(!ordersLoaded) return <LoadComponent message="Loading orders.." />

    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Order Number</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Order Date</TableCell>
                <TableCell align="center">Order Status</TableCell>
                <TableCell align="center"></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {orders?.map((order) => (
                <TableRow
                key={order.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell component="th" scope="row">
                    {order.id}
                </TableCell>
                <TableCell align="center">{currencyFormat(order.total)}</TableCell>
                <TableCell align="center">{dateFormat(order.orderDate)}</TableCell>
                <TableCell align="center">{order.orderStatus}</TableCell>
                <TableCell align="right">
                    <Button component={Link} to={`/orders/${order.id}`} size='small'>View</Button>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    )
}