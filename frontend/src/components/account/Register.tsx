import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import agent from '../../api/agent';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';

const theme = createTheme();

export default function Register() {

  const history = useHistory();
  const {register, handleSubmit, setError, formState: {isSubmitting, errors, isValid}} = useForm({
      mode: 'all'
  });

  function handleApiErrors(errors: any) {
    if(!errors) return;

    errors.forEach((error: string) => {
      if(error.includes('Password'))
        setError('password', {message: error});
      else if(error.includes('Email'))
        setError('emailAddress', {message: error});
      else if(error.includes('Username'))
        setError('username', {message: error});
    });
  }

  return (
    <ThemeProvider theme={theme}>
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
          <Box component="form" noValidate 
              onSubmit={handleSubmit((data) => agent.Account.register(data)
                  .then(() => {
                    toast.success('Registered! You can log in now.')
                    history.push('/login')
                  }).catch(e => handleApiErrors(e)))} 
              sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  fullWidth
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  autoComplete='email'
                  {...register('emailAddress', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                        message: 'Not a valid email address'
                      }
                      })}
                  error={!!errors.emailAddress}
                  helperText={errors?.emailAddress?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Username"
                    autoComplete="username"
                    {...register('username', {required: 'Username is required'})}
                    error={!!errors.username}
                    helperText={errors?.username?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    pattern: {
                      value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                      message: 'Password does not meet complexity requirements'
                    }
                  })}
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                />
              </Grid>
            </Grid>
            <LoadingButton
                disabled={!isValid}
                loading={isSubmitting}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
              Register
            </LoadingButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to='/login'>
                  {"Already have an account? Log in."}"
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}