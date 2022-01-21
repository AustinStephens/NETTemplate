import { Button } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import LoadComponent from '../../LoadComponent';
import { useAppDispatch, useAppSelector } from '../../store/configureStore';
import { fetchProductsAsync, productSelectors } from './catalogSlice';
import ProductList from './ProductList';



export default function Catalog() {

    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded, status} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!productsLoaded) dispatch(fetchProductsAsync());

    }, [productsLoaded, dispatch])

    if(status.includes('pending')) return <LoadComponent message='Loading Products...' />

    return (
        <Fragment>
            <ProductList products={products} />
            <Button variant='contained' />
        </Fragment>
    )
}