import React, { FC } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import {AuthController} from "../classes/AuthController"
import { useState , useEffect } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { LegendToggleRounded } from '@mui/icons-material';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  // States for checking the errors
  const [isInvalidEmail, setIsInvalidEmail] = useState(true);
  const [isInvalidPassword, setIsInvalidPssword] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userList, setUserList] = useState([])

  useEffect( () => {
    handleLogin();
    console.log("Use effect");
    
    if (isSubmitted){   

      // // Check if JWT exists in local storage
      // let userJwt = JSON.parse(localStorage.getItem('token') || 'null');
      // // userJwt = "null";
      // // Validate JWT with backend - Check if token still valid
      // let loggedIn;
      // const loggedInPromise = axios.post(`http://localhost:2000/users/${userJwt}`);

      // loggedInPromise.then((response) => {
      //   loggedIn = response.data;
      // });
 
      // // Validate user login
      // if (loggedIn === true) {
      //   {navigate("/dashboard")};
      // } else {
      //   // display message for invalid user
      //   setIsInvalidEmail(false);
      //   setIsInvalidPssword(false);
      // }
    }
  }, [isSubmitted]);

  const handleLogin = async () => {
    try {
      isUserLoggedIn();
      
      // Make login request to server
      const response = await axios.post('http://localhost:2000/users/login', {
        email: email,
        password: password
      });

      // Get JWT from backend
      const userJwt = JSON.parse(JSON.stringify(response.data.token));

      // Store User JWT into local storage
      localStorage.setItem('token', JSON.stringify(userJwt));

      console.log(userJwt);
      // Validate JWT with backend - Check if token still valid
      const loggedIn = await axios.post(`http://localhost:2000/users/${userJwt}`);

      // Redirect to dashboard
      if (loggedIn.data === true) {
        {navigate("/dashboard")};
      } else {
        // display message for invalid user
        setIsInvalidEmail(false);
        setIsInvalidPssword(false);
      }

    } catch (error) {
      setIsInvalidEmail(true);
      setIsInvalidPssword(true);  
      console.log("Invalid login");
    }
  }
  
  const handleSubmit = (event : any) => {
    event.preventDefault(); // Prevents page from refreshing on submit
    setIsSubmitted(true);
    handleLogin();
  };


  // Checks can be done backend
  /*let checkMatchingEmail = userList.map((user)=>{
    if (user.email === email){
      return true;
    }
    return false;
  });*/

  /*let checkMatchingPassword = userList.map((user)=>{
    if (user.password === password && user.email === email){
      return true;
    }
    return false;
  });*/

  async function isUserLoggedIn() {
    // Check if JWT exists in local storage
    let userJwt = JSON.parse(localStorage.getItem('token') || 'null');
    // userJwt = "";
    // Validate JWT with backend - Check if token still valid
    const loggedIn = await axios.post(`http://localhost:2000/users/${userJwt}`);
    
    console.log(userJwt);
    
    // If already logged in, redirect to next page
    if (loggedIn.data === true) {
      {navigate("/dashboard")};
    }
  }
  // Handling the email change
  function handleEmail(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  // Handling the password change
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

    // // to be removed
    // let emailValid = true;
    // let passwordValid = true;
  
    // // redirect valid user
    // if (emailValid && passwordValid){
    //   {navigate("/dashboard")};
    // }

    // User validation can be done backend
    /*let emailValid = checkMatchingEmail;*/
    /*let passwordValid = checkMatchingPassword; // would check for empty string*/
    

  const handleInput = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const Message = () => {
    if (isSubmitted){
      if (isInvalidPassword && isInvalidEmail) {
        return <Alert severity="info">Password and email are invalid. Log In is unsuccessful.</Alert>
      }
      if (isInvalidPassword){
        return <Alert severity="info">Password is invalid. Log In is unsuccessful.</Alert>
      }
      if (isInvalidEmail){
        return <Alert severity="info">Email is invalid. Log In is unsuccessful.</Alert>
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleEmail}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handlePassword}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={() => navigate("/forgetpassword")}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={() => navigate("/register")}>
                  {"Don't have an account? Register"}
                </Link>
              </Grid>
              <Grid item sx={{pt:2}}>
                <Message />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}