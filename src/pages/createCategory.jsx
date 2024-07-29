// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { Helmet } from 'react-helmet-async';
// import { useState, useEffect } from 'react';

// // import LoadingButton from '@mui/lab/LoadingButton';
// import {
//   Box,
//   Modal,
//   Button,
//   Select,
//   MenuItem,
//   TextField,
//   Typography,
//   FormControl,
// } from '@mui/material';

// import { useRouter } from 'src/routes/hooks';

// import Config from 'src/config/Config';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   background: '#FFF',
//   p: 4,
// };

// export default function CreateCategory() {

//   const router  = useRouter()

//   const [categoriesList, setCategoriesList] = useState([]);
//   const [currentLevel, setCurrentLevel] = useState(1);
//   const [keys , setKeys] = useState([])
//   const [parentId, setParentId] = useState('parent');
//   const [modalOpen, setModalOpen] = useState(false);

//   const [apiDataForCategory, setApiDataForCategory] = useState({
//     name: '',
//     url: '',
//     parentId: '',
//     level: null,
//   });
//   const submitHandler = async (e) => {
//     e.preventDefault();
//     if (apiDataForCategory.name) {
//       const url = `${apiDataForCategory.url}/${apiDataForCategory.name.replaceAll('-', '')}`;
//       const newUrl = url.replaceAll(' ', '-');
//       const formData = new FormData();
//       formData.set('level', Number(currentLevel));
//       formData.set('parentId', parentId);
//       formData.set('name', apiDataForCategory.name);
//       formData.set('url', newUrl);
//       formData.set('keys', JSON.stringify(keys));
//       // dispatch(newCategory(formData));
//       const response = await axios.post(
//         `${Config.apiUrl}/newCategory` , formData , {
//           headers: {
//             token: `${sessionStorage.getItem('token')}`,
//           },
//         }
//       );
//        if (response.status === 200) {
//         toast.success("Category created successfully" , {
//           position: 'top-right',
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: 'colored',
//         })
//         setModalOpen(false)
//         router.push('/categories')
//        }else{
//         toast.error("Server error" , {
//           position: 'top-right',
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: 'colored',
//         })
//        }
//     }else{
//       window.alert("Please enter category name")
//     }
//   };

//   useEffect(() => {
//     async function fetchData() {
//       const { data } = await axios.get(
//         `${Config.apiUrl}/getCategoryBylevel/${currentLevel}/${parentId}`
//       );
//       setCategoriesList((prevCategoriesList) => [...prevCategoriesList, data.record]);
//     }
//     fetchData();
//   }, [currentLevel, parentId, setCategoriesList]);

//   return (
//     <>
//       <Helmet>
//         <title> Create Category </title>
//       </Helmet>
//       <Box>
//         <Typography>Create Category</Typography>
//         <Modal
//           open={modalOpen}
//           onClose={() => setModalOpen(false)}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//         >
//           <Box sx={style}>
//             <form onSubmit={submitHandler} encType="multipart/form-data">
//               <Box>
//                 <Typography sx={{margin : '10px 0px'}} >Name</Typography>
//                 <TextField
//                 size='small'
//                   value={apiDataForCategory.name}
//                   onChange={(e) =>
//                     setApiDataForCategory({
//                       ...apiDataForCategory,
//                       name: e.target.value,
//                     })
//                   }
//                   name="email"
//                 />

//               </Box>
//               <Box sx={{display:"flex" , justifyContent : "center" , alignItems :"center" , margin : '10px 0px'}}>
//               <Button size='small'  type="submit" variant="contained">
//                 CREATE
//               </Button>
//               </Box>
//             </form>
//           </Box>
//         </Modal>
//         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//           <Box
//             sx={{
//               width: '60%',
//               background: '#fff',
//               margin: 'auto',
//               display: 'flex',
//               gap: '100px',
//               padding: '12px 0px',
//               flexDirection: 'column',
//               justifyContent: 'center',
//               alignItems: 'center',
//               marginTop: '50px',
//             }}
//             className="shadow-lg"
//           >
//             {categoriesList?.map((val, ind) => (
//               <FormControl>
//                 <Select
//                   onChange={(e) => {
//                     console.log('e', JSON.parse(e.target.value)._id);
//                     setParentId(JSON.parse(e.target.value)._id);
//                     setCurrentLevel(Number(val.level) + 1);
//                     setKeys([...keys ,JSON.parse(e.target.value)._id ])
//                     setApiDataForCategory({
//                       ...apiDataForCategory,
//                       url: JSON.parse(e.target.value).url,
//                     });
//                   }}
//                   sx={{ minWidth: 230 }}
//                   inputProps={{ 'aria-label': 'Without label' }}
//                 >
//                   <MenuItem value="">
//                     <em>None</em>
//                   </MenuItem>
//                   {val?.categories.map((v) => (
//                     <MenuItem value={JSON.stringify(v)}>{v?.name}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             ))}
//             <Box>
//               <Button onClick={() => setModalOpen(true)} variant="contained">
//                 Add Sibling
//               </Button>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </>
//   );
// }
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

// import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, TextField, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Config from 'src/config/Config';

const style = {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  height: '70vh',
  alignItems: 'center',
  margin: '10px 0px',
  // backgroundColor : "rgba(255,255,255",
  // border : "1px solid gray"
};

export default function CreateCategory() {
  const router = useRouter();

  const [apiDataForCategory, setApiDataForCategory] = useState({
    name: '',
    url: '',
  });
  const submitHandler = async (e) => {
    e.preventDefault();
    if (apiDataForCategory.name) {
      const url = `${apiDataForCategory.name.replaceAll('-', '')}`;
      const newUrl = url.replaceAll(' ', '-');
      const formData = new FormData();
      formData.set('name', apiDataForCategory.name);
      formData.set('url', newUrl.toLowerCase());

      const response = await axios.post(`${Config.apiUrl}/newCategory`, formData, {
        headers: {
          'Content-Type': 'application/json',
          token: `${sessionStorage.getItem('token')}`,
        },
        maxBodyLength: Infinity,
      });
      if (response.status === 200) {
        toast.success('Category created successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        router.push('/categories');
      }
    } else {
      toast.error('Please select a category', {
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

  return (
    <>
      <Helmet>
        <title> Create Category </title>
      </Helmet>
      <Box>
        <Typography variant="h4">Create Category</Typography>

        <Box>
          <form style={style} onSubmit={submitHandler} encType="multipart/form-data">
            <Box>
              <Typography sx={{ margin: '10px 0px' }}>Name</Typography>
              <TextField
                size="medium"
                value={apiDataForCategory.name}
                onChange={(e) =>
                  setApiDataForCategory({
                    ...apiDataForCategory,
                    name: e.target.value,
                  })
                }
                name="email"
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
              <Button size="medium" type="submit" variant="contained">
                CREATE
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
}
