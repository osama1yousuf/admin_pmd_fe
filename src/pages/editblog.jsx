import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { lazy, useState, useEffect } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Stack, Select, MenuItem, TextField, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Config from 'src/config/Config';

export const EditorComponent = lazy(() => import('src/components/EditorComponent'));

export default function EditBlog() {
  const router = useRouter();
  const { id } = useParams();
  const [heading, setHeading] = useState('');
  const [imageBanner, setImageBanner] = useState(null);
  const [imageInner, setImageInner] = useState(null);
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
  };

  const handleImageInner = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageInner(file);
    }
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
      let body = {
        name: heading,
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
            body = {
              ...body,
              bannerImage: {
                public_id: imageResponse?.public_id,
                url: imageResponse?.secure_url,
              },
            };
          }
        } catch (error) {
          console.error('Image upload failed', error);
          return; // Optionally handle the error, e.g., show an alert or toast message
        }
      }

      if (imageInner) {
        try {
          const imageResponse = await uploadImageOnCloud(imageInner); // Await the image upload
          if (imageResponse) {
            body.innerImage = {
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
        const response = await axios.post(`${Config.apiUrl}/editblog/${id}`, body, {
          headers: {
            'Content-Type': 'application/json',
            token: `${sessionStorage.getItem('token')}`,
          },
          maxBodyLength: Infinity,
        });
        if (response.status === 200) {
          toast.success('Blog updated successfully', {
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
    const getBlog = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/getBlog/${id}`);
        console.log('response', response.data.data);
        setHeading(response.data.data?.name);
        setMainContent(response.data.data?.mainContent);
        setSelectedCategory(response.data.data?.category);
        setMetaTittle(response.data.data?.metaTittle);
        setMetaDescription(response.data.data?.metaDescription);
        setSlug(response.data.data?.slug);
      } catch (error) {
        console.log(error);
      }
    };
    getBlog();
  }, [id]);

  return (
    <>
      <Helmet>
        <title> Edit Blog </title>
      </Helmet>

      {/* <BlogView /> */}
      <Box sx={{ margin: '10px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4"> Edit Blog </Typography>
          <LoadingButton
            size="large"
            type="submit"
            variant="contained"
            color="info"
            onClick={handleClick}
          >
            Update
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
            {console.log('selectedCategory', selectedCategory)}
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
          <Stack sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <Box sx={{ padding: '13px 0px', flexBasis: '47%' }}>
              <Typography variant="h6">Banner Image</Typography>
              <input type="file" onChange={handleImageBanner} />
            </Box>
            <Box sx={{ padding: '13px 0px', flexBasis: '47%' }}>
              <Typography variant="h6">Innrer Image</Typography>
              <input type="file" onChange={handleImageInner} />
            </Box>
          </Stack>
        </Box>
        <Box>
          <EditorComponent mainContent={mainContent} setMainContent={setMainContent} />
        </Box>
      </Box>
    </>
  );
}
