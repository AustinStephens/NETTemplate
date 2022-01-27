import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { useAppDispatch, useAppSelector } from '../../store/configureStore';
import { signOut } from '../account/accountSlice';
import { clearBasket } from '../baskets/basketSlice';

export default function SignedInMenu() {

    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state.account);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
    setAnchorEl(null);
    };

    return (
    <>
        <Button color='inherit' onClick={handleClick} sx={{typography: 'h6'}}>
            {user?.emailAddress}
        </Button>
        <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My Orders</MenuItem>
            <MenuItem onClick={() => {
                dispatch(signOut());
                dispatch(clearBasket());
            }}>
                Logout
            </MenuItem>
        </Menu>
    </>
    );
}