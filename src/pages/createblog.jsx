import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { lazy, useState, useEffect } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Stack, Select, MenuItem, TextField, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Config from 'src/config/Config';

export const EditorComponent = lazy(() => import('src/components/EditorComponent'));

export default function CreateBlog() {
  const router = useRouter();
  const [heading, setHeading] = useState('');
  const [imageBanner, setImageBanner] = useState(null);
  // const [imageInner, setImageInner] = useState([]);
  const [mainContent, setMainContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [metaTittle, setMetaTittle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [categories, setCategories] = useState([]);

  const handleImageBanner = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageBanner(file);
    }
    // setImageBanner([]);

    // files.forEach((file) => {
    //   const reader = new FileReader();

    //   reader.onload = () => {
    //     if (reader.readyState === 2) {
    //       setImageBanner((oldArray) => [...oldArray, reader.result]);
    //     }
    //   };
    //   reader.readAsDataURL(file);
    // });
  };

  const uploadImageOnCloud = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', `${Config?.uploadPersetCloudinaryKey}`);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${Config?.cloudinarySecretKey}/image/upload`,
        formData
      );
      console.log('form', response);
      return response.data;
    } catch (error) {
      console.log('Error while uplading image on cloudinary', error.message);
      return null;
    }
  };

  const handleClick = async () => {
    if (heading && slug) {
      const body = {
        name: heading,
        bannerImage: {},
        mainContent,
        user: JSON.parse(sessionStorage.getItem('user'))?._id,
        category: selectedCategory,
        metaTittle,
        slug: slug.replaceAll(' ', '_'),
        metaDescription,
      };

      if (imageBanner) {
        try {
          const imageResponse = await uploadImageOnCloud(imageBanner); // Await the image upload
          if (imageResponse) {
            body.bannerImage = {
              public_id: imageResponse?.public_id,
              url: imageResponse?.secure_url,
            };
          }
        } catch (error) {
          console.error('Image upload failed', error);
          return; // Optionally handle the error, e.g., show an alert or toast message
        }
      }

      try {
        const response = await axios.post(`${Config.apiUrl}/admin/newBlog`, body, {
          headers: {
            'Content-Type': 'application/json',
            token: `${sessionStorage.getItem('token')}`,
          },
          maxBodyLength: Infinity,
        });
        if (response.status === 200) {
          toast.success('Blog created successfully', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
          router.push('/blog');
        }
      } catch (error) {
        console.log('error', error);
      }
    } else {
      window.alert('Please Fill Heading or Slug');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${Config.apiUrl}/categories`);
      console.log('response?.data?.category', response?.data?.category);
      setCategories(response?.data?.category);
    } catch (error) {
      console.log(error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <>
      <Helmet>
        <title> Create Blog </title>
      </Helmet>

      {/* <BlogView /> */}
      <Box sx={{ margin: '10px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4"> Add New Blog </Typography>
          <LoadingButton
            size="large"
            type="submit"
            variant="contained"
            color="info"
            onClick={handleClick}
          >
            Create
          </LoadingButton>
        </Box>

        <Box>
          <Stack
            sx={{
              padding: '13px 0px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TextField
              size="small"
              sx={{ width: '65%' }}
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              name="email"
              label="Heading"
            />
            <Select
              size="small"
              sx={{ width: '32%' }}
              value={selectedCategory}
              onChange={(e) => {
                console.log('e', e.target.value);
                setSelectedCategory(e.target.value);
              }}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {categories.length > 0 &&
                categories.map((v) => <MenuItem value={v._id}>{v?.name}</MenuItem>)}
            </Select>
          </Stack>
          <Stack
            sx={{
              padding: '13px 0px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TextField
              size="small"
              sx={{ width: '32%' }}
              value={metaTittle}
              onChange={(e) => setMetaTittle(e.target.value)}
              name="metaTitle"
              label="Meta Tittle"
            />
            <TextField
              size="small"
              sx={{ width: '32%' }}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              name="metaDescription"
              label="Meta Description"
            />
            <TextField
              size="small"
              sx={{ width: '32%' }}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              name="slug"
              label="Slug"
            />
          </Stack>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <Box sx={{ padding: '13px 0px', flexBasis: '47%' }}>
              <Typography variant="h6">Banner Image</Typography>
              <input type="file" onChange={handleImageBanner} />
            </Box>
            {/* <Box sx={{ padding: '13px 0px' , flexBasis : "47%" }}>
              <Typography variant="h6">Innrer Image</Typography>
              <input type="file" onChange={handleImageInner} />
            </Box> */}
          </Box>
        </Box>
        <Box>
          <EditorComponent mainContent={mainContent} setMainContent={setMainContent} />
        </Box>
      </Box>
    </>
  );
}
