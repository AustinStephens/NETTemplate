import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '../../store/configureStore';
import BasketSummary from '../baskets/BasketSummary';
import BasketTable from '../baskets/BasketTable';


export default function Review() {

  const {basket} = useAppSelector(state => state.basket);
  const subtotal = (basket ? basket.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0)
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      {basket && 
      <BasketTable items={basket.items} isBasket={false} />}
      <Grid container>
          <Grid item xs={6} />
          <Grid item xs={6}>
            <BasketSummary subtotal={subtotal} />
          </Grid>
        </Grid>
    </>
  );
}