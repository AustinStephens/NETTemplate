import { Box, Grid, Pagination, Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import LoadComponent from '../../LoadComponent';
import { useAppDispatch, useAppSelector } from '../../store/configureStore';
import AppPagination from '../search/AppPagination';
import CheckboxButtons from '../search/CheckboxButtons';
import RadioButtonGroup from '../search/RadioButtonGroup';
import { fetchFiltersAsync, fetchProductsAsync, productSelectors, setPageNumber, setProductParams } from './catalogSlice';
import ProductList from './ProductList';
import ProductSearch from './ProductSearch';

const sortOptions = [
    {value: 'name', label: 'Alphabetical'},
    {value: 'price', label: 'Price - Low to High'},
    {value: 'priceDesc', label: 'Price - High to Low'}
]



export default function Catalog() {

    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded, status, filtersLoaded, brands, types, productParams, metaData } = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!productsLoaded) dispatch(fetchProductsAsync());
    }, [productsLoaded, dispatch])

    useEffect(() => {
        if(!filtersLoaded) dispatch(fetchFiltersAsync());
    }, [filtersLoaded, dispatch])

    if(!filtersLoaded) return <LoadComponent message='Loading Products...' />

    return (
        <Grid container columnSpacing={4}>
            <Grid item xs={3}>
                <Paper sx={{mb: 2}}>
                    <ProductSearch />
                </Paper>
                <Paper sx={{mb: 2, p: 2}}>
                    <RadioButtonGroup
                        selectedValue={productParams.orderBy}
                        options={sortOptions}
                        onChange={(e) => dispatch(setProductParams({orderBy: e.target.value}))}
                    />
                </Paper>
                <Paper sx={{mb: 2, p: 2}}>
                    <CheckboxButtons items={brands} checked={productParams.brands} onChange={(items: string[]) => dispatch(setProductParams({brands: items}))}/>
                </Paper>
                <Paper sx={{mb: 2, p: 2}}>
                <CheckboxButtons items={types} checked={productParams.types} onChange={(items: string[]) => dispatch(setProductParams({types: items}))}/>
                </Paper>
            </Grid>
            <Grid item xs={9}>
                <ProductList products={products} />
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={9}> 
            { 
                metaData &&
                <AppPagination metaData={metaData} onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))} />
            }
            </Grid>
        </Grid>
    )
}