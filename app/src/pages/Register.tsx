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
import {AuthController} from "../classes/AuthController"
import Alert from '@mui/material/Alert';
import 'reactjs-popup/dist/index.css';
import { useState } from 'react';


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
const authController = new AuthController()

export default function Register() {
  
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
    let emailValid = authController.checkEmailValidity(email);
    let passwordValid = authController.checkPasswordValidity(password);
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

  interface MessageProps {
    submissionStatus: boolean;
    passwordInvalidity: boolean;
    emailInvalidity: boolean;
  }

  const Message: FC<MessageProps> = ({submissionStatus, passwordInvalidity, emailInvalidity }) => {
    if (submissionStatus){
      if (passwordInvalidity && emailInvalidity) {
        return <Alert severity="info">Password and Email are invalid. Registration is unsuccessful.</Alert>
      }
      if (passwordInvalidity){
        return <Alert severity="info">Password is invalid. Registration is unsuccessful.</Alert>
      }
      if (emailInvalidity){
        return <Alert severity="info">Email is invalid. Registration is unsuccessful.</Alert>
      }
      return <Alert severity="info">Registration is successful.</Alert>
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
            Register
          </Typography>
          <Box component="form" noValidate onSubmit={handleInput} sx={{ mt: 3 }}>
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Register
            </Button>
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