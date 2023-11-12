import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useContext } from 'react'
import axios from 'axios';
import { RecoveryContext } from "../../pages/ForgetPassword";
import {createTheme, ThemeProvider, CssBaseline, Box, Typography, Button, Alert, Grid, Paper, TextField, Link, Photo} from '../ComponentsIndex'

const defaultTheme = createTheme();

export default function OTPResetEmail() {

  const navigate = useNavigate();

  const [enteredEmail, setEnteredEmail] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState({} as boolean);
  const { setEmail, setOTP, setPage } = useContext(RecoveryContext);

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredEmail(event.target.value);
  };

  const handleEmailSubmission = async (event: React.FormEvent) => {
    setIsEmailSubmitted(true);
    setEmail(enteredEmail);
    event.preventDefault();

    try {
        setEmail(enteredEmail);
        const otpPromise = sendForgetPassword(enteredEmail);
        const otp = await otpPromise; 
        setOTP(otp?.data.otp.token);
        setIsEmailValid(true);
        setPage("otpinput"); 
    } catch (error : any) {
        setIsEmailValid(false);
    }
    return;
  };


  function sendForgetPassword(toEmail: string) {
      console.log("Email is " + toEmail);
      const response = axios.post(`${process.env.REACT_APP_SERVER_URL}/users/forget-password`, { email : toEmail });
      // Return OTP 
      return response;
  };
    

  const EmailErrorMessage = () => {
    if (isEmailSubmitted){
      if (!isEmailValid){
        return <Alert severity="error">Email is invalid</Alert>
      } else{
        return <Alert severity="success">OTP has been sent to your email. Please enter the OTP and new password below.</Alert>
      }
    }
    return null;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${Photo})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
          <Typography component="h1" variant="h5">
            Forget Password
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
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
                  name="email"
                  label="Email Address"
                  type="email"
                  id="email"
                  autoComplete='email'
                  placeholder={"Enter Email"}
                  onChange={handleEmail}
                  />
            </Grid>
            <Grid item xs={12}>
                <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick = {handleEmailSubmission}
                >
                Confirm
                </Button>
            </Grid>
            <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="#" variant="body2" onClick={() => navigate("/login")}>
                  Log In
                  </Link>
                </Grid>
            </Grid>
            <Grid item>
            </Grid>
          </Grid>
          <Grid item>
                <EmailErrorMessage/>
            </Grid>
          </Box>
          </Box>
          </Grid>
          </Grid>
    </ThemeProvider>
  );
};


