import React from 'react';
import { useNavigate } from "react-router-dom";
import { useState} from 'react';
import axios from 'axios'
import {createTheme, ThemeProvider, CssBaseline, Box, Typography, Button, Alert, Grid, Paper, Avatar, TextField, Link, LockOutlinedIcon, Photo} from '../components/ComponentsIndex'


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Register() {
  
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypedPassword, setRetypedPassword] = useState('')
 
  // States for checking the errors
  const [isInvalidEmailFormat, setIsInvalidEmailFormat] = useState(true);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isInvalidPassword, setIsInvalidPssword] = useState(true);
  const [isInvalidRetypedPassword, setIsInvalidRetypedPassword] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] = useState(false)
  const [validRetypedPassword, setValidRetypedPassword] = useState({} as boolean);

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRetypedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRetypedPassword(event.target.value);
  };

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    let emailFormatValid = validateEmailAddressFormat(email)
    let passwordValid = checkPasswordValidity(password)
    let retypedPasswordValid = false
    if (password===retypedPassword){
      retypedPasswordValid=true
    } 

    if (passwordValid && password===retypedPassword){
      setValidRetypedPassword(true);
    }

    setIsSubmitted(true)

    if (emailFormatValid && passwordValid && retypedPasswordValid){
      axios.post(`https://${process.env.REACT_APP_SERVER_URL}/users/register`, {
        email: email,
        password: password,
      })
      .then((res)=> console.log(res.data))
      .then ((res)=>setIsExistingUser(false))
      .then ((res) => setIsRegistrationSuccessful(true))
      .catch(function(error) {
        if (error.response){
          if (error.response.status===404) setIsExistingUser(true)
          else setIsExistingUser(false)
          setIsRegistrationSuccessful(false)
        }
      })

    } else {
      setValidRetypedPassword(false);  
      setIsRegistrationSuccessful(false);
    }

    setIsInvalidEmailFormat(!emailFormatValid);
    setIsInvalidPssword(!passwordValid);
    setIsInvalidRetypedPassword(!retypedPasswordValid)
  }

  // message display depending on validity

  const EmailStatusMessage = () => {
    if (isSubmitted){
      if (isInvalidEmailFormat) {
        return <Alert severity="info"> Invalid email. </Alert>
      }
      if (isExistingUser){
        return <Alert severity="info"> Existing user. </Alert>
      }
      return null
    }
    return null; 
  }

  const PasswordStatusMessage = () => {
    if (isSubmitted){
      if (isInvalidPassword) {
        return <Alert severity="info">Password does not meet the requirements.</Alert>
      }
      if (validRetypedPassword === false){
        return <Alert severity="info">Passwords do not match.</Alert>
      }
     return null;
    }
    return null;
  }

  const RetypedPasswordStatusMessage = () => {
    if (isSubmitted){
      if (isInvalidRetypedPassword) {
        return <Alert severity="info">Retyped password does not match the password.</Alert>
      }
     return null;
    }
    return null;
  }

  const RegistrationStatusMessage = () => {
    if (isSubmitted){
      if (isRegistrationSuccessful) {
        return <Alert severity="info">Registration is successful.</Alert>
      } else {
        return <Alert severity="info">Error in Registration.</Alert>
      }
     return null;
    }
    return null;
  }

    // check if email is in the correct format
  function validateEmailAddressFormat(email: string): boolean { 
      const atSymbol: number = email.indexOf("@"); 
      const dotSymbol: number = email.lastIndexOf("."); 
      const spaceSymbol: number = email.indexOf(" "); 

      if ((atSymbol !== -1) && 
          (atSymbol !== 0) && 
          (dotSymbol !== -1) && 
          (dotSymbol !== 0) && 
          (dotSymbol > atSymbol + 1) && 
          (email.length > dotSymbol + 1) && 
          (spaceSymbol === -1)) { 
          return true; 
      } else { 
          return false; 
      } 
  }

  // check if password meets requirements
  function checkPasswordValidity(password: string) : boolean {

      let upper: number = 0;
      let lower: number = 0;
      let special: number = 0;

      for (let i: number = 0; i < password.length; i++) {
          if (password[i] >= "A" && password[i] <= "Z") {
              upper++;
          } else if (password[i] >= "a" && password[i] <= "z") {
              lower++;
          } else {
              special++;
          }
      }

      if (password.length>=8 && upper>0 && lower>0 && special>0){
          return true;
      }

      return false;

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
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  onChange={handleEmail}
                />
              </Grid>
              <Grid item xs={12}>
              <EmailStatusMessage />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onChange={handlePassword}
                  helperText="Password must be at least 8 characters long, contain 1 uppercase character, 1 lowercase character and 1 special character"
                />
              </Grid>
              <Grid item xs={12}>
              <PasswordStatusMessage/>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="retypedPassword"
                  label="Retype Password"
                  type="password"
                  id="retypedPassword"
                  onChange={handleRetypedPassword}
                />
              </Grid>
              <Grid item xs={12}>
              <RetypedPasswordStatusMessage/>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container spacing={2}>
            <Grid item xs={12}>
            <RegistrationStatusMessage/>
            </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={() => navigate("/forgetpassword")}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={() => navigate("/login")}>
                  {"Already have an account? Log in"}
                </Link>
            </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
      </Grid>
    </ThemeProvider>
  );
}