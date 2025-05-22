import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { LoadingButton } from '@mui/lab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';

import { RHFUpload } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Image from 'src/components/image';
// ----------------------------------------------------------------------

export default function ProfileGallery({ businessProfile, isManageBusiness }) {
  const { initialize } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();



  // const products = businessProfile?.Product_Picture_Link;
  const Interior = businessProfile?.Interior_Exterior_Picture_Links?.filter(
    (item) => item.type === 'Interior'
  );
  const Exterior = businessProfile?.Interior_Exterior_Picture_Links?.filter(
    (item) => item.type === 'Exterior'
  );

  const [activeTab, setActiveTab] = React.useState('2');

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Typography variant="h4" sx={{ my: 5 }}>
        Gallery
      </Typography>

      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {/* <Tab label="Products" value="1" /> */}
            <Tab label="Interior" value="2" />
            <Tab label="Exterior" value="3" />
          </TabList>
        </Box>
        {/* <TabPanel value="1">
          <ProductTab
            isManageBusiness={isManageBusiness}
            products={products}
            initialize={initialize}
          />
        </TabPanel> */}
        <TabPanel value="2">
          <InteriorTab
            isManageBusiness={isManageBusiness}
            products={Interior}
            initialize={initialize}
          />
        </TabPanel>
        <TabPanel value="3">
          <ExteriorTab
            isManageBusiness={isManageBusiness}
            products={Exterior}
            initialize={initialize}
          />
        </TabPanel>
      </TabContext>
    </>
  );
}

ProfileGallery.propTypes = {
  gallery: PropTypes.array,
};

const ProductTab = ({ isManageBusiness, products, initialize }) => {
  const { enqueueSnackbar } = useSnackbar();
  const UpdateUserSchema = Yup.object().shape({});

  const defaultValues = {};

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log("hii inside interior exterior");
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error while updating', { variant: 'error' });
    }
  });

  const [imageUpload, setImageUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);

  const handleImageUpload = async () => {
    try {
      setIsLoading(true);
      const form = new FormData();
      form.append('file', image);

      form.append('upload_preset', 'bymtctem');
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dfznwn1fr/image/upload',
        form
      );
      const { data } = await axiosInstance.post(endpoints.uploadProductImage, {
        imageUrl: response?.data?.url,
        imageKey: response?.data?.public_id,
      });
      initialize();
      reset();
      enqueueSnackbar('Uploaded successfully');
      setIsLoading(false);
      setImageUpload(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('business_cover_image', newFile, { shouldValidate: true });
        setImage(newFile);
        setImageUpload(true);
      }
    },
    [setValue]
  );

  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        md: 'repeat(4, 1fr)',
      }}
    >
      {isManageBusiness && products?.length < 9 && (
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <RHFUpload
            isProdcut
            onDrop={handleDrop}
            name="business_cover_image"
            maxSize={3145728}
          />
          {imageUpload && (
            <Stack justifyContent="center">
              <LoadingButton
                color="inherit"
                type="button"
                variant="contained"
                loading={isLoading}
                sx={{ mt: 2, minWidth: 150, mx: 'auto' }}
                onClick={handleImageUpload}
              >
                Upload
              </LoadingButton>
            </Stack>
          )}
        </FormProvider>
      )}

      {products?.map((image) => (
        <Card
          key={image.id}
          sx={{ cursor: 'pointer', color: 'common.white', position: 'relative' }}
          style={{ aspectRatio: '1/1' }}
        >

          <Image alt="gallery" height="100%" width="100%" src={image.image_url} />
        </Card>
      ))}
    </Box>
  );
};

const InteriorTab = ({ isManageBusiness, products, initialize }) => {
  const { enqueueSnackbar } = useSnackbar();
  const UpdateUserSchema = Yup.object().shape({});

  const defaultValues = {};

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error while updating', { variant: 'error' });
    }
  });

  const [imageUpload, setImageUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);

  const handleImageUpload = async () => {
    try {
      setIsLoading(true);
      const form = new FormData();
      form.append('file', image);
      form.append('upload_preset', 'bymtctem');
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dfznwn1fr/image/upload',
        form
      );
      const { data } = await axiosInstance.post(endpoints.uploadBusinessImage, {
        imageUrl: response?.data?.url,
        type: 'Interior',
        imageKey: response?.data?.public_id,
      });
      initialize();
      reset();
      enqueueSnackbar('Uploaded successfully');
      setIsLoading(false);
      setImageUpload(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('business_cover_image', newFile, { shouldValidate: true });
        setImage(newFile);
        setImageUpload(true);
      }
    },
    [setValue]
  );

  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        md: 'repeat(4, 1fr)',
      }}
    >
      {isManageBusiness && products?.length < 4 && (
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <RHFUpload
            isProdcut
            onDrop={handleDrop}
            name="business_cover_image"
            maxSize={3145728}
          />
          {imageUpload && (
            <Stack justifyContent="center">
              <LoadingButton
                color="inherit"
                type="button"
                variant="contained"
                loading={isLoading}
                sx={{ mt: 2, minWidth: 150, mx: 'auto' }}
                onClick={handleImageUpload}
              >
                Upload
              </LoadingButton>
            </Stack>
          )}
        </FormProvider>
      )}

      {products?.map((image) => (
        <Card
          key={image.id}
          sx={{ cursor: 'pointer', color: 'common.white', position: 'relative' }}
          style={{ aspectRatio: '1/1' }}
        >
          {/* <Stack>
                <IconButton color="secondary" aria-label="add an alarm">
  <DeleteIcon />
</IconButton>
                </Stack> */}
          <Image alt="gallery" height="100%" width='100%' src={image.image_url} />
        </Card>
      ))}
    </Box>
  );
};

const ExteriorTab = ({ isManageBusiness, products, initialize }) => {
  const { enqueueSnackbar } = useSnackbar();
  const UpdateUserSchema = Yup.object().shape({});

  const defaultValues = {};

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error while updating', { variant: 'error' });
    }
  });

  const [imageUpload, setImageUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);

  const handleImageUpload = async () => {
    try {
      setIsLoading(true);
      const form = new FormData();
      form.append('file', image);
      form.append('upload_preset', 'bymtctem');
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dfznwn1fr/image/upload',
        form
      );
      const { data } = await axiosInstance.post(endpoints.uploadBusinessImage, {
        imageUrl: response?.data?.url,
        type: 'Exterior',
        imageKey: response?.data?.public_id,
      });
      initialize();
      reset();
      enqueueSnackbar('Uploaded successfully');
      setIsLoading(false);
      setImageUpload(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('business_cover_image', newFile, { shouldValidate: true });
        setImage(newFile);
        setImageUpload(true);
      }
    },
    [setValue]
  );

  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        md: 'repeat(4, 1fr)',
      }}
    >
      {isManageBusiness && products?.length < 4 && (
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <RHFUpload
            isProdcut
            onDrop={handleDrop}
            name="business_cover_image"
            maxSize={3145728}
          />
          {imageUpload && (
            <Stack justifyContent="center">
              <LoadingButton
                color="inherit"
                type="button"
                variant="contained"
                loading={isLoading}
                sx={{ mt: 2, minWidth: 150, mx: 'auto' }}
                onClick={handleImageUpload}
              >
                Upload
              </LoadingButton>
            </Stack>
          )}
        </FormProvider>
      )}

      {products?.map((image) => (
        <Card
          key={image.id}
          sx={{ cursor: 'pointer', color: 'common.white', position: 'relative' }}
          style={{ aspectRatio: '1/1' }}
        >
          {/* <Stack>
                <IconButton color="secondary" aria-label="add an alarm">
  <DeleteIcon />
</IconButton>
                </Stack> */}
          <Image alt="gallery" height="100%" src={image.image_url} />
        </Card>
      ))}
    </Box>
  );
};
