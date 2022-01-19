import { Button } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import agent from '../../api/agent';
import LoadComponent from '../../LoadComponent';
import { Product } from '../../models/product';
import ProductList from './ProductList';



export default function Catalog() {

    const [products, setProducts] = useState<Product []>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Catalog.list()
        .then(products => setProducts(products))
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
    }, [])

    if(loading) return <LoadComponent message='Loading Products...' />

    return (
        <Fragment>
            <ProductList products={products} />
            <Button variant='contained' />
        </Fragment>
    )
}