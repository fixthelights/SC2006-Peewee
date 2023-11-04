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
import { useState, useEffect, useContext } from 'react'
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import axios from 'axios';
import Photo from '../../assets/LoginBackground.jpg'
import Paper from '@mui/material/Paper';
import { RecoveryContext, delayTime } from "../../pages/PasswordRecovery";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function OTPResetEmail() {
  // Importing States
  const navigate = useNavigate();

  const [enteredEmail, setEnteredEmail] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState({} as boolean);
  const { email, setEmail, setOTP, setPage } = useContext(RecoveryContext);
  const [test, setTest] = useState(0);

  // useEffect(() => {
  //   console.log("Component mounted or updated");
  //   return () => {
  //     console.log("Component will unmount");
  //   };
  // }, []); 
  
  // Handle changes to Email Input
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredEmail(event.target.value);
  };

  // Handle Email Submission
  const handleEmailSubmission = async (event: React.FormEvent) => {
    setIsEmailSubmitted(true);
    setEmail(enteredEmail);
    event.preventDefault();

    console.log("Test value = ", test);
    try {
        setEmail(enteredEmail);
        const otpPromise = sendForgetPassword(enteredEmail);
        const otp = await otpPromise; // Async (?)
        setOTP(otp?.data.otp.token);
        setIsEmailValid(true);
        setPage("otpinput"); // Move to next step
    } catch (error : any) {
        console.log(error);
        setIsEmailValid(false);
    }
    return;
  };

  // Send OTP to email
  function sendForgetPassword(toEmail: string) {
      console.log("Email is " + toEmail);
      const response = axios.post('http://localhost:2000/users/forget-password', { email : toEmail });
      console.log(response);
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


