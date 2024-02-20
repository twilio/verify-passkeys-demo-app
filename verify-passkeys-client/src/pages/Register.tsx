import {Button, FormControl, Grid, InputLabel, MenuItem, Select,
    SelectChangeEvent, TextField, Typography} from '@mui/material';
import React, {useContext, useState} from 'react';
import {StyledHeader, StyledPaper} from "../components/StyledComponents";
import RegistrationForm from "../model/RegistrationForm";
import {FactorService} from "../services/FactorService";
import {AppContext} from "../context/AppContext";

let initialValues = {
    userName: '',
    userFriendlyName: '',
    userVerification: '',
    authenticatorAttachment: ''
}
function Register() {
    const context = useContext(AppContext);
    const [formData, setFormData] = useState(initialValues as RegistrationForm);

    const handleUserVerificationChange = (event:  SelectChangeEvent) => {
        setFormData(prev => ({ ...prev, userVerification: event.target.value }));
    };

    const handleAuthenticatorAttachmentChange = (event: SelectChangeEvent) => {
        setFormData(prev => ({ ...prev, authenticatorAttachment: event.target.value }));
    };

    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [ event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        FactorService.createFactor(formData).then(data => {
            console.log(data);
        });
        console.log(formData);
    };

    return (
        <StyledPaper elevation={3}>
            <StyledHeader variant='h4' textAlign={'left'}>Register</StyledHeader>
            <Grid item xs={12}>
                <Typography variant='h6' textAlign={'left'}>Registration Information</Typography>
            </Grid>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField label='Name' name='userName' variant='outlined' onChange={handleTextFieldChange} fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label='Friendly Name' name='userFriendlyName' variant='outlined' onChange={handleTextFieldChange} fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='h6' textAlign={'left'}>Additional Information</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>User Verification</InputLabel>
                            <Select
                                value={formData.userVerification}
                                onChange={handleUserVerificationChange}
                                label="User Verification"
                                style={{textAlign: 'left'}}
                            >
                                <MenuItem value={'preferred'}>Preferred</MenuItem>
                                <MenuItem value={'required'}>Required</MenuItem>
                                <MenuItem value={'discouraged'}>Discouraged</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>Authenticator Attachment</InputLabel>
                            <Select
                                value={formData.authenticatorAttachment}
                                onChange={handleAuthenticatorAttachmentChange}
                                label="Authenticator Attachment"
                                style={{textAlign: 'left'}}
                            >
                                <MenuItem value={'platform'}>Platform</MenuItem>
                                <MenuItem value={'cross-platform'}>Cross-Platform</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <Button type='submit' variant='contained'>Submit</Button>
                    </Grid>
                </Grid>
            </form>
        </StyledPaper>
    );
}

export default Register;
