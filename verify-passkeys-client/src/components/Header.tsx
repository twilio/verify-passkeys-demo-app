import React from 'react';
import {AppBar, Box, Button, Toolbar } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import {StyledContainer} from "./StyledComponents";

function Header() {
    const navigate = useNavigate();

    const navigateTo = (destination: string) => {
        navigate(destination);
    }
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position='static' style={{ background: '#121C2D', alignItems: 'center' }}>
                    <Toolbar>
                        <Button color='inherit' onClick={() => navigateTo('/')}>Home</Button>
                        <Button color='inherit' onClick={() => navigateTo('/register')}>Register</Button>
                        <Button color='inherit' onClick={() => navigateTo('/sign-in')}>Sign-In</Button>
                        <Button color='inherit' onClick={() => navigateTo('/factors')}>View Factors</Button>
                        <Button color='inherit' onClick={() => navigateTo('/challenges')}>View Challenges</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <StyledContainer>
                <Outlet />
            </StyledContainer>
        </>
    );
}

export default Header;