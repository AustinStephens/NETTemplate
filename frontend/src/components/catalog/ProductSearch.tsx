import { TextField } from "@mui/material";
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/configureStore";
import { setProductParams } from "./catalogSlice";

export default function ProductSearch() {
    const {productParams} = useAppSelector(state => state.catalog);
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);
    const dispatch = useAppDispatch();
    
    const debouncedSearch = useMemo(() => debounce((event: any) => {
        dispatch(setProductParams({searchTerm: event.target.value}));
    }, 1000), [dispatch]);

    useEffect(() => {
        return() => {
            debouncedSearch.cancel();
        }
    }, [])

    return (
        <TextField label='Search Products' 
            variant='outlined' 
            fullWidth
            value={searchTerm || ''}
            onChange={(event: any) => {
                setSearchTerm(event.target.value);
                debouncedSearch(event);
            }}
        />
    )
}