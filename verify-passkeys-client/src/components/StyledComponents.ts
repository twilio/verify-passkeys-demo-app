import {Container, Paper, styled, TextField, Typography} from '@mui/material';


const StyledContainer = styled(Container)(() => ({
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    '& .MuiButton-root': {
        margin: '10px 0',
        //width: '100%',
    },
    '& .MuiTypography-root': {
        margin: '10px 0',
    },
    '& .MuiAlert-root': {
        margin: '10px 0',
    }
}));

const StyledHeader = styled(Typography)(() => ({
    padding: '20px 0',
}));

const StyledBody = styled(Typography)(() => ({
    padding: '0 0 20px 0',
}));

const StyledPaper = styled(Paper)(() => ({
    marginTop: '30px',
    padding: '10px 40px 30px'
}));

const StyledTextField = styled(TextField)(() => ({
    margin: '10px 0',
    width: "50%",

}));





export { StyledContainer, StyledHeader, StyledBody, StyledPaper, StyledTextField };