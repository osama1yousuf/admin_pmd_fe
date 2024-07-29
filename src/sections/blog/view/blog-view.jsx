import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// import { posts } from 'src/_mock/blog';
import { useRouter } from 'src/routes/hooks';

import Config from 'src/config/Config';

import Iconify from 'src/components/iconify';

// import PostCard from '../post-card';
// import PostSort from '../post-sort';
// import PostSearch from '../post-search';

// ----------------------------------------------------------------------

export default function BlogView() {
  const columns = [
    { field: '_id', headerName: '_id', width: 250 },
    {
      field: 'name',
      headerName: 'Name',
      width: 250,
      editable: true,
    },
    {
      field: 'user.name',
      headerName: 'Created By',
      width: 250,
      renderCell: (params) => {
        const userName = params.row.user.name;
        return <span>{userName}</span>;
      },
    },
    {
      headerName: 'Actions',
      width: 300,
      renderCell: (params) => (
        <Box>
          <Button
            sx={{ margin: '5px' }}
            color="error"
            variant="outlined"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </Button>
          <Button
            sx={{ margin: '5px' }}
            color="info"
            variant="outlined"
            onClick={() => handleEdit(params.row._id)}
          >
            Edit
          </Button>
        </Box>
      ),
    },
  ];

  const router = useRouter();
  const [rowData, setRowData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Config.apiUrl}/getBlogs`);
      setRowData(response?.data?.data);
    } catch (error) {
      console.log(error);
      setRowData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${Config.apiUrl}/blog/${id}` , {
        headers: {
          token: `${sessionStorage.getItem('token')}`,
        },
      });
      if (response.status === 200) {
        toast.success(response.data?.message, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = (id) => {
    router.push(`/editblog/${id}`, {
      headers: {
        token: `${sessionStorage.getItem('token')}`,
      },
    });
  };
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Blog</Typography>

        <Button
          onClick={() => router.push('/blog/create')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New Blog
        </Button>
      </Stack>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rowData}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row._id}
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          disableRowSelectionOnClick
          // rowsPerPageOptions={[5]}
          // experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </Container>
  );
}
