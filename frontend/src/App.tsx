import Catalog from './components/catalog/Catalog'
import {Container, createTheme, CssBaseline} from '@mui/material'
import Header from './components/appbar/Header';
import { ThemeProvider } from '@emotion/react';
import { useCallback, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import HomePage from './components/home/HomePage';
import AboutPage from './components/about/AboutPage';
import ContactPage from './components/contact/ContactPage';
import ProductDetails from './components/catalog/ProductDetails';
import { ToastContainer } from 'react-toastify';
import BasketPage from './components/baskets/BasketPage';
import LoadComponent from './LoadComponent';
import CheckoutPage from './components/checkout/CheckoutPage';
import { useAppDispatch } from './store/configureStore';
import { fetchBasketAsync } from './components/baskets/basketSlice';
import Login from './components/account/Login';
import Register from './components/account/Register';
import { fetchCurrentUser } from './components/account/accountSlice';
import PrivateRoute from './components/checkout/PrivateRoute';

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch(e) {
      console.log(e);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp])

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
        <PrivateRoute path='/checkout' component={CheckoutPage} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
