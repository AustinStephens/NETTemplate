import { Button, Grid, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import BasketSummary from "./BasketSummary";
import BasketTable from "./BasketTable";

export default function BasketPage() {

    const {basket, status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    if(!basket) return <Typography variant='h3'>Your Basket Is Empty</Typography>
    const subtotal = (basket ? basket.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0)
    return (
      <>
        <BasketTable items={basket.items} />
        <Grid container>
          <Grid item xs={6} />
          <Grid item xs={6}>
            <BasketSummary subtotal={subtotal} />
            <Button href='/checkout' variant='contained' size='large' fullWidth>
              Checkout
            </Button>
          </Grid>
        </Grid>
      </>
    
    )
}