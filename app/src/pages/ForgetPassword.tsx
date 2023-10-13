import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import { ForgetPasswordController } from '../classes/ForgetPasswordController';
import Alert from '@mui/material/Alert';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
const forgetPasswordController = new ForgetPasswordController()

export default function ForgetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
 
  // States for checking the errors
  const [isInvalidEmail, setIsInvalidEmail] = useState(true);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userList, setUserList] = useState([])

  /*useEffect(()=> {  
      axios.get('http://localhost:2000/') 
      .then((res)=> setUserList(res.data));
  }, []);*/

  /*let checkMatchingEmail = userList.map((user)=>{
    if (user.email == email){
      return true;
    }
    return false;
  });*/
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    //let validEmail = checkMatchingEmail 
    let validEmail = false;
    let isSentOTP = false;
    if (validEmail){
      isSentOTP = forgetPasswordController.sendOTP(email)
      if (isSentOTP){
        {navigate('/setnewpassword')}
      }
    }
    setIsInvalidEmail(!validEmail);
    setIsOTPSent(isSentOTP);
  };

  const Message = () => {
    if (isSubmitted){
      if (isInvalidEmail){
        return <Alert severity="info">Email is invalid</Alert>
      }
      if (!isInvalidEmail && !isOTPSent){
        return <Alert severity="info">OTP failed to send. Please retry.</Alert>
      }
    }
    return null;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Forget Password
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">
                Please provide the email address you used to register for an account.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
        <Message />
      </Container>
    </ThemeProvider>
  );
}