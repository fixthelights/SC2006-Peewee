import React, { FC } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useState , useEffect } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
// import { LegendToggleRounded } from '@mui/icons-material';
import { LegendToggleRounded } from '@mui/icons-material';
import Photo from '../assets/LoginBackground.jpg';
import Paper from '@mui/material/Paper';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  // States for checking the errors
  const [isValidUser, setIsValidUser] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect( () => {
    handleLogin();
  },[isSubmitted]);

  const handleLogin = async () => {
    try {
      // If user logged in, redirect to next page and end function call
      if (await isUserLoggedIn()) {
        return;
      };
      
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
      const loggedIn = await axios.post(`http://localhost:2000/users/auth`, { jwt: userJwt });

      // Redirect to dashboard
      if (loggedIn.data === true) {
        navigate("/dashboard");
      } else {
        // display message for invalid user
       setIsValidUser(true)
      }

    } catch (error) {
      setIsValidUser(false)  
      console.log("Invalid login");
    }
  }
  
  const handleSubmit = (event : any) => {
    event.preventDefault(); // Prevents page from refreshing on submit
    setIsSubmitted(true);
    handleLogin();
  };

  async function isUserLoggedIn() {
    // Check if JWT exists in local storage
    let userJwt = JSON.parse(localStorage.getItem('token') || 'null');

    // Validate JWT with backend - Check if token still valid
    const loggedIn = await axios.post(`http://localhost:2000/users/auth`, { jwt: userJwt });
    
    console.log(userJwt);
    
    // If already logged in, redirect to next page
    if (loggedIn.data === true) {
      navigate("/dashboard");
      return true;
    }
    return false;
  }

  // Handling the email change
  function handleEmail(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  // Handling the password change
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
    
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
      if (!isValidUser) {
        return <Alert severity="info">Invalid User.</Alert>
      }
      return null;
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            <Grid container spacing={2}>
            <Grid item xs={12}>
            <Message/>
            </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={() => navigate("/forgetpassword2")}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={() => navigate("/register")}>
                  {"Don't have an account? Register"}
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