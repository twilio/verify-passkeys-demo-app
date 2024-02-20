import {Alert, Button, Grid } from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {StyledBody, StyledHeader, StyledPaper, StyledTextField} from "../components/StyledComponents";
import Config from "../model/Config";
import {ApiService} from "../services/ApiService";
import {AppContext} from "../context/AppContext";


let initialValues = {
    accountSid: '',
    authToken: '',
    serviceSid: ''
}
function Home() {
    const context = useContext(AppContext);
    const [config, setConfig] = useState(initialValues as Config);
    const [submitStatus, setSubmitStatus] = useState<string | null>(null);


    useEffect(() => {
        ApiService.getConfig().then(data => {
            if (data !== null) {
                setConfig(data);
                context.setCredentials(data.accountSid, data.authToken, data.serviceSid);
            }
        });
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfig({
            ...config,
            [event.target.name]: event.target.value,
        });
    };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        let updatedConf = await ApiService.postConfig(config);
        if (updatedConf !== null) {
            setSubmitStatus('success');
        } else {
            setSubmitStatus('error');
        }
    };

    return (
        <StyledPaper elevation={3}>
            <StyledHeader variant='h4'>Verify Passkeys Demo Application</StyledHeader>
            <StyledBody variant='body1'>
                The verify passkeys customer client side where you are able to register new or sign-in existing user.
            </StyledBody>

            <form onSubmit={handleSubmit}>
                <Grid container direction='column' spacing={2}>
                    <Grid item xs={6}>
                        <StyledTextField
                            label='Account SID'
                            name='accountSid'
                            variant='outlined'
                            value={config.accountSid}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <StyledTextField
                            label='Auth Token'
                            name='authToken'
                            variant='outlined'
                            type='password'
                            value={config.authToken}
                            onChange={handleChange}
                            autoComplete='current-password'
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <StyledTextField
                            label='Service SID'
                            name='serviceSid'
                            variant='outlined'
                            value={config.serviceSid}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button type='submit' variant='contained'>Submit</Button>
                    </Grid>
                    <Grid item>
                        {submitStatus === 'success' && (
                            <Alert severity='success'>Configuration submitted successfully!</Alert>
                        )}
                        {submitStatus === 'error' && (
                            <Alert severity='error'>Error submitting configuration.</Alert>
                        )}
                    </Grid>
                </Grid>
            </form>
        </StyledPaper>
    );
}

export default Home;
