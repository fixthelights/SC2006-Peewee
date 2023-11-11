import * as React from 'react';
import { useState, useContext  } from 'react'
import { AuthManager} from '../../classes/AuthManager';
import { RecoveryContext, delayTime } from "../../pages/ForgetPassword";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {createTheme, ThemeProvider, CssBaseline, Box, Typography, Button, Alert, Grid, Paper, TextField, Photo} from '../ComponentsIndex'

const defaultTheme = createTheme();
const authController = new AuthManager()

export default function ResetPassword() {
  
  const [password, setPassword] = useState('')
  const [retypedPassword, setRetypedPassword] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState({} as boolean)
  const [isRetypedPasswordValid, setIsRetypedPasswordValid] = useState({} as boolean)
  const [isPasswordSubmitted, setIsPasswordSubmitted] = useState(false)
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false)
  const { email } = useContext(RecoveryContext)
  const navigate = useNavigate();

  // Handle changes to Password Input
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  // Handle changes to Retyped Password Input
  const handleRetypedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRetypedPassword(event.target.value);
  };
  

  const handlePasswordSubmission = (event: React.MouseEvent) => {

    setIsPasswordSubmitted(true)

    event.preventDefault()

    let validPassword = false
    let validRetypedPassword = false

    if (authController.checkPasswordValidity(password)){ 
      validPassword = true
    } 
    if (validPassword && password===retypedPassword){
      validRetypedPassword = true
    }
    if (validPassword && validRetypedPassword){
      axios.put('http://localhost:2000/users/update-password', {
        email: email,
        password: password
      })
      .then(res => setIsPasswordUpdated(true))
      .then(res => setIsPasswordSubmitted(true))
      .then(res => setTimeout(() => navigate("/login"),delayTime))
      .catch(error => {
          console.log(error);
          setIsPasswordUpdated(false);
          setIsPasswordSubmitted(true)
        })
    }
    setIsPasswordValid(validPassword)
    setIsRetypedPasswordValid(validRetypedPassword)
  };
  
  const PasswordMessage = () => {
    if (isPasswordSubmitted){
      if (!isPasswordValid){
        return <Alert severity="error">Password does not meet the requirements.</Alert>
      } else if(!isRetypedPasswordValid){
        return <Alert severity="error">Retyped password has to be the same as password.</Alert>
      } else if (isPasswordUpdated){
        return <Alert severity="success">Password has been changed.</Alert>
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
            <Typography component="h1" variant="h5" fontWeight={'bold'}>
              Reset your password
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" align={'center'}>
                  Enter your new password below
                  </Typography>
                </Grid>
                <><Grid item xs={12}>
        <TextField
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          onChange={handlePassword} />
      </Grid><Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="retypedPassword"
            label="Retype Password"
            type="Password"
            id="retypedPassword"
            onChange={handleRetypedPassword} />
        </Grid><Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handlePasswordSubmission}
          >
            Reset Password
          </Button>
        </Grid></>
                <Grid item xs={12}>
                  <PasswordMessage />
                </Grid>
                </Grid>
              </Box>
              </Box>
              </Grid>
              </Grid>
        </ThemeProvider>
    );
};
