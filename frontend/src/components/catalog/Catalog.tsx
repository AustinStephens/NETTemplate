import { Button } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { Product } from '../../models/product';
import ProductList from './ProductList';



export default function Catalog() {

    const [products, setProducts] = useState<Product []>([])

    useEffect(() => {
        fetch('https://localhost:7210/api/products')
        .then(response => response.json())
        .then(data => setProducts(data))
    }, [])

    return (
        <Fragment>
            <ProductList products={products} />
            <Button variant='contained' />
        </Fragment>
    )
}