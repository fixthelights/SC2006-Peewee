import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useContext  } from 'react'
import Alert from '@mui/material/Alert';
import { AuthManager} from '../../classes/AuthManager';
import { RecoveryContext } from "../../pages/PasswordRecovery";
import axios from 'axios';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
const authController = new AuthManager()


export default function ResetPassword() {


  // Importing States
  const [password, setPassword] = useState('')
  const [retypedPassword, setRetypedPassword] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [isRetypedPasswordValid, setIsRetypedPasswordValid] = useState(false)
  const [isPasswordSubmitted, setIsPasswordSubmitted] = useState(false)
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false)
  const { email, setPage } = useContext(RecoveryContext)

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

    console.log(email);
    console.log(password, retypedPassword);

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
      .then(res => console.log(res.data))
      .then(res => setIsPasswordUpdated(true))
      .then(res => setIsPasswordSubmitted(true))
      .then(res => setPage("login"))
      .catch(error => {
          console.log(error);
          setIsPasswordUpdated(false);
          setIsPasswordSubmitted(true)
        })
    }
  };
  
  const PasswordMessage = () => {
    if (isPasswordSubmitted){
      if (!isPasswordValid){
        return <Alert severity="error">Password does not meet the requirements.</Alert>
      } else if(!isRetypedPasswordValid){
        return <Alert severity="error">Retyped password has to be the same as password.</Alert>
      } else if (!isPasswordUpdated){
        return <Alert severity="error">Failed to update password. Please try again.</Alert>
      } else {
        return <Alert severity="success">Password has been changed.</Alert>
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
              backgroundColor: 'white',
              borderRadius:'6px',
              padding: '22px'
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
                <Grid item>
                  <PasswordMessage />
                </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      
      
    );
};
