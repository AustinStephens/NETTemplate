import Catalog from './components/catalog/Catalog'
import {Container, createTheme, CssBaseline, Typography} from '@mui/material'
import Header from './components/appbar/Header';
import { ThemeProvider } from '@emotion/react';
import { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import HomePage from './components/home/HomePage';
import AboutPage from './components/about/AboutPage';
import ContactPage from './components/contact/ContactPage';
import ProductDetails from './components/catalog/ProductDetails';
import { ToastContainer } from 'react-toastify';
import BasketPage from './components/baskets/BasketPage';
import { useStoreContext } from './context/StoreContext';
import { getCookie } from './util/util';
import agent from './api/agent';
import LoadComponent from './LoadComponent';
import CheckoutPage from './components/checkout/CheckoutPage';

function App() {
  const {setBasket} = useStoreContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buyerId = getCookie('buyerId');
    if(buyerId) {
      agent.Basket.get()
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
    } else {
      setLoading(false);
    }
  }, [setBasket])

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  })
  
  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  if(loading) return <LoadComponent message='Initialising app...' />

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/catalog' component={Catalog} />
        <Route path='/catalog/:id' component={ProductDetails} />
        <Route path='/about' component={AboutPage} />
        <Route path='/contact' component={ContactPage} />
        <Route path='/basket' component={BasketPage} />
        <Route path='/checkout' component={CheckoutPage} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
