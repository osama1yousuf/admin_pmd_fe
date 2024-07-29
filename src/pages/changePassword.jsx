import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

import { Box, Button, TextField, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Config from 'src/config/Config';

function ChangePassword() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set('oldPassword', oldPassword);
    formData.set('password', password);
    formData.set('email', JSON.parse(sessionStorage.getItem('user'))?.email);
    try {
      const response = await axios.post(`${Config.apiUrl}/password/update`, formData, {
        headers: {
          'Content-Type': 'application/json',
          token: `${sessionStorage.getItem('token')}`,
        },
        maxBodyLength: Infinity,
      });
      console.log('response', response);
      if (response.status === 200) {
        sessionStorage.setItem('token', response.data?.token);
        toast.success('Password updated successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        router.push('/dashboard');
      }
    } catch (error) {
      console.log(error.response);
      toast.error(error.response?.data?.message || 'Internal server error', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      //   router.push('/blog');
    }
  };

  return (
    <>
      <Helmet>
        <title> Change Password </title>
      </Helmet>
      <Box style={{ marginBottom: '15px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box
            sx={{
              width: { lg: '60%', md: '80%', sm: '95%' },
              background: '#fff',
              borderRadius: '10px',
              boxShadow: 'initial',
            }}
          >
            <form
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
              onSubmit={submitHandler}
            >
              <Typography variant="h4" textAlign="center" padding="10px">
                Change Password
              </Typography>
              <Box sx={{ width: '100%', padding: '20px 15px' }}>
                <Typography>Old Password</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  name="oldPassword"
                />
              </Box>

              <Box sx={{ width: '100%', padding: '20px 15px' }}>
                <Typography>New Password</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={password}
                  name="newPassword"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Box>

              <Button type="submit" variant="contained" sx={{ margin: '20px' }}>
                Update Password
              </Button>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ChangePassword;
