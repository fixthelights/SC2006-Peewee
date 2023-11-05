import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useState } from 'react'
import Alert from '@mui/material/Alert';
import { AuthController } from '../classes/AuthController';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
const authController = new AuthController();

export default function SetNewPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('')
  const [otp, setOTP] = useState('');
  const [password, setPassword] = useState('');
  const [retypedPassword, setRetypedPassword] = useState('')
  const [isOTPValid, setIsOTPValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isRetypedPasswordValid, setIsRetypedPasswordValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false)

  /*useEffect(()=> {  
      axios.get('http://localhost:2000/') 
      .then((res)=> setUserList(res.data));
  }, []);*/

  /*let correctOTP = userList.map((user)=>{
    if (user.email === email){
      return user.otp
    }
    return 0;
  });*/

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

     // let OTP = correctOTP
    let OTP = 12345678

    let validEmail = false
    let validOTP = false
    let validPassword = false
    let validRetypedPassword = false

    
    if (OTP!=0){
      validEmail = true
    }
    if (OTP.toString()===otp){
      validOTP = true
    }
    if (authController.checkPasswordValidity(password)){
      validPassword = true

      /*axios.put('http://localhost:2000/', newUser)
      .then(res => {
        console.log(res.data)
      })*/
    } 
    if (validPassword && password===retypedPassword){
      validRetypedPassword = true
    }

    setIsEmailValid(validEmail)
    setIsOTPValid(validOTP)
    setIsPasswordValid(validPassword)
    setIsRetypedPasswordValid(validRetypedPassword)

    setIsSubmitted(true)

  };

  const Message = () => {
    if (isSubmitted){
      if (!isEmailValid){
        return <Alert severity="info">Invalid Email.</Alert>
      } 
      if (isEmailValid && !isOTPValid){
        return <Alert severity="info">Invalid OTP.</Alert>
      } 
      if (isEmailValid && isOTPValid && !isPasswordValid){
        return <Alert severity="info">Password does not meet the requirements.</Alert>
      }
      if (isEmailValid && isOTPValid && isPasswordValid && !isRetypedPasswordValid){
        return <Alert severity="info">Retyped password has to be the same as password.</Alert>
      }
      if (isEmailValid && isOTPValid && isPasswordValid && isRetypedPasswordValid){
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
            Set New Password
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1"> 
                  Please enter your email again. 
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  onChange = {handleEmail}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"> 
                Please enter the 8 digit OTP sent to your email to reset your password.
                </Typography>
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" onClick={() => navigate("/login")}>
                  Log In
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Message />
      </Container>
    </ThemeProvider>
  );
}