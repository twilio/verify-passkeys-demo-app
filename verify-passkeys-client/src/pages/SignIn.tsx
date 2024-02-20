import {StyledHeader} from '../components/StyledComponents';
import React from 'react';
import { Typography } from '@mui/material';


function SignIn() {
    return (
        <div>
            <StyledHeader variant='h4'>Sign In</StyledHeader>
            <Typography variant='body1'>Sign in form here</Typography>
        </div>
    );
}

export default SignIn;