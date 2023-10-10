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
import { useState } from 'react';
import Alert from '@mui/material/Alert';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
const authController = new AuthController();

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  // States for checking the errors
  const [isInvalidEmail, setIsInvalidEmail] = useState(true);
  const [isInvalidPassword, setIsInvalidPssword] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);


  // Handling the email change
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  // Handling the password change
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);

    // validate user
    let emailValid = authController.checkMatchingEmail(email); //would check for empty string
    let passwordValid = authController.checkMatchingPassword(email, password); // would check for empty string

    // redirect valid user
    if (emailValid && passwordValid){
      {navigate("/dashboard")};
    }

    // display message for invalid user
    setIsInvalidEmail(!emailValid);
    setIsInvalidPssword(!passwordValid);
  }

  const handleInput = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  // message for invalid credentials
  interface MessageProps {
    submissionStatus: boolean;
    passwordInvalidity: boolean;
    emailInvalidity: boolean;
  }

  const Message: FC<MessageProps> = ({submissionStatus, passwordInvalidity, emailInvalidity }) => {
    if (submissionStatus){
      if (passwordInvalidity && emailInvalidity) {
        return <Alert severity="info">Password and email are invalid. Log In is unsuccessful.</Alert>
      }
      if (passwordInvalidity){
        return <Alert severity="info">Password is invalid. Log In is unsuccessful.</Alert>
      }
      if (emailInvalidity){
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
          <Box component="form" onSubmit={handleInput} noValidate sx={{ mt: 1 }}>
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
                <Message 
                submissionStatus={isSubmitted}
                emailInvalidity={isInvalidEmail} 
                passwordInvalidity={isInvalidPassword}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}