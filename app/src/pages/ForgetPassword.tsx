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
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import { AuthManager} from '../classes/AuthManager';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
const authController = new AuthManager()

export default function ForgetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('')
  const [generatedOTP, setGeneratedOTP] = useState('')
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false)

  const [OTP, setOTP] = useState('')
  const [password, setPassword] = useState('')
  const [retypedPassword, setRetypedPassword] = useState('')
  const [isOTPValid, setIsOTPValid] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [isRetypedPasswordValid, setIsRetypedPasswordValid] = useState(false)
  const [isPasswordSubmitted, setIsPasswordSubmitted] = useState(false)
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false)
  
  const [userList, setUserList] = useState([])

  const handleOTP = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOTP(event.target.value);
  };

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRetypedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRetypedPassword(event.target.value);
  };

  
  const handleEmailSubmission = (event: React.MouseEvent) => {

    event.preventDefault()

    //let otpGenerated = authManager.generateOTP()
    let otpGenerated = 12345678

    /*axios.post('http://localhost:2000/users/forget-password',{
      username: "hiiii",
      email: email,
      otp: otpGenerated
      })
      .then((res)=> console.log(res.data))
      .then ((res) => setIsOTPSent(true))
      .then ((res)=>setIsEmailSubmitted(true))
      .catch(function(error) {
          console.log(error);
          if (error.message === "Request failed with status code 404"){
            setIsEmailValid(false)
          }else{
            etIsEmailValid(false)
          }
          setIsOTPSent(false);
          setIsEmailSubmitted(true)
    })*/

    setIsEmailValid(true)
    setIsOTPSent(true);
    setIsEmailSubmitted(true)

  };

  const OtpMessage = () => {
    if (isEmailSubmitted){
      if (!isEmailValid){
        return <Alert severity="info">Email is invalid</Alert>
      } else if (!isOTPSent){
        return <Alert severity="info">OTP failed to send. Please retry.</Alert>
      } else{
        return <Alert severity="info">OTP has been sent to your email. Please enter the OTP and new password below.</Alert>
      }
    }
    return null;
  }

  const handlePasswordSubmission = (event: React.MouseEvent) => {

    setIsPasswordSubmitted(true)

    event.preventDefault()

     // let OTP = correctOTP

    let validOTP = false
    let validPassword = false
    let validRetypedPassword = false
    let savedNewPassword = false

    if (generatedOTP!=='' && OTP===generatedOTP){
      validOTP = true
    }
    if (authController.checkPasswordValidity(password)){ 
      validPassword = true
    } 
    if (validPassword && password===retypedPassword){
      validRetypedPassword = true
    }
    if (validOTP && validPassword && validRetypedPassword){
      /*axios.put('http://localhost:2000/users/reset-password', {
        email: email,
        newPassword: password
      })
      .then(res => console.log(res.data))
      .then(res => isPasswordUpdated(true))
      .then(res => isPasswordSubmitted(true))
      .catchcatch(function(error) {
          console.log(error);
          setIsPasswordUpdated(false);
          setIsPasswordSubmitted(true)
        })*/
    }

    setIsOTPValid(validOTP)
    setIsPasswordValid(validPassword)
    setIsRetypedPasswordValid(validRetypedPassword)
    setIsPasswordUpdated(savedNewPassword)

  };

  const PasswordMessage = () => {
    if (isPasswordSubmitted){
      if (!isOTPValid){
        return <Alert severity="info">Invalid OTP.</Alert>
      } else if (!isPasswordValid){
        return <Alert severity="info">Password does not meet the requirements.</Alert>
      } else if(!isRetypedPasswordValid){
        return <Alert severity="info">Retyped password has to be the same as password.</Alert>
      } else if (!isPasswordUpdated){
        return <Alert severity="info">Failed to update password. Please try again.</Alert>
      } else {
        return <Alert severity="info">Password has been changed.</Alert>
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
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
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
              <Grid item xs={12}>
              <OtpMessage />
              </Grid>
              <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="otp"
                    label="OTP"
                    type="otp"
                    id="otp"
                    onChange = {handleOTP}
                  />
              </Grid>
              <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    onChange = {handlePassword}
                  />
              </Grid>
              <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="retypedPassword"
                    label="Retype Password"
                    type="retypedPassword"
                    id="retypedPassword"
                    onChange = {handleRetypedPassword}
                  />
              </Grid>
              <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick = {handlePasswordSubmission}
              >
                Reset Password
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
                <PasswordMessage />
              </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
  );
}