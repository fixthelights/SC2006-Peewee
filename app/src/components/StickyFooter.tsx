import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {Typography, Container, Link} from '../components/ComponentsIndex'

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        PEEWEE
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function StickyFooter() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '10vh',
        }}
      >
        <CssBaseline />
        <Box
          component="footer"
          sx={{
            py: 2,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
          }}
        >
          <Container maxWidth="sm">
          <Box
                sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '1vh',
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                }}
            >
            <Copyright />
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}