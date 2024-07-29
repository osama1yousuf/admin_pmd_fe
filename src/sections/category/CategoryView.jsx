import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import { Modal, TextField, Typography } from '@mui/material';

// import { posts } from 'src/_mock/blog';
import { useRouter } from 'src/routes/hooks';

import Config from 'src/config/Config';

import Iconify from 'src/components/iconify';

// import PostCard from '../post-card';
// import PostSort from '../post-sort';
// import PostSearch from '../post-search';

// ----------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: '#FFF',
  p: 4,
};

export default function CategoriesView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editableCategory, setEditableCategory] = useState(null);

  const router = useRouter();
  const [rowData, setRowData] = useState([]);
  const columns = [
    { field: '_id', headerName: '_id', width: 250 },
    {
      field: 'name',
      headerName: 'Name',
      width: 250,
      editable: true,
    },
    {
      field: 'url',
      headerName: 'URL',
      width: 250,
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

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Config.apiUrl}/categories`);
      setRowData(response?.data?.category);
    } catch (error) {
      console.log(error);
      setRowData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault();
    if (editableCategory.name) {
      const url = `${editableCategory.name.replaceAll('_', '')}`;
      const newUrl = url.replaceAll(' ', '_');
      try {
        const formData = new FormData();
        formData.set('name', editableCategory.name);
        formData.set('url', newUrl.toLowerCase());
        const response = await axios.post(
          `${Config.apiUrl}/updateCategory/${editableCategory._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              token: `${sessionStorage.getItem('token')}`,
            },
            maxBodyLength: Infinity,
          }
        );
        if (response.status === 200) {
          toast.success('Category updated successfully', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
          setModalOpen(false);
          fetchData();
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Server error', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        setModalOpen(false);
      }
    } else {
      toast.error('Please enter category nam', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      setModalOpen(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${Config.apiUrl}/category/${id}`);
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
      toast.error(error?.response?.data?.message || 'Server error', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };
  const handleEdit = (id) => {
    const findRow = rowData.find((v) => v._id === id);
    console.log('findRow', findRow);
    setModalOpen(true);
    setEditableCategory(findRow);
  };
  return (
    <Container>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditableCategory(null);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={submitHandler} encType="multipart/form-data">
            <Box>
              <Typography sx={{ margin: '10px 0px' }}>Name</Typography>
              <TextField
                size="small"
                value={editableCategory?.name}
                onChange={(e) =>
                  setEditableCategory({
                    ...editableCategory,
                    name: e.target.value,
                  })
                }
                name="name"
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '10px 0px',
              }}
            >
              <Button size="small" type="submit" variant="contained">
                Update
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">All Categories</Typography>

        <Button
          onClick={() => router.push('/category/create')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New Category
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
