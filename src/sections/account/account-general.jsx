import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import 'cropperjs/dist/cropper.css';
import { useCallback, useRef, useState } from 'react';
import Cropper from 'react-cropper';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import LoadingButton from '@mui/lab/LoadingButton';
import { Avatar, Button, Modal, Switch } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import axiosInstance, { endpoints } from 'src/utils/axios';
import { fData } from 'src/utils/format-number';

import { useAuthContext } from 'src/auth/hooks';

import FormProvider, {
  RHFTextField,
  RHFUploadAvatar
} from 'src/components/hook-form';
import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const { user, initialize } = useAuthContext();

  const UpdateUserSchema = Yup.object().shape({
    full_name: Yup.string().required('Name is required'),
    email_id: Yup.string()
      .required('Email is required')
      .email('Email must be a valid email address'),
    Contact_no: Yup.string().required('Phone number is required'),
    Job_title: Yup.string().required('Job Title is required'),
  });

  const defaultValues = {
    full_name: user?.full_name || '',
    email_id: user?.email_id || '',
    profile_picture: user?.profile_picture || null,
    Contact_no: user?.Contact_no || '',
    Job_title: user?.Job_title || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axiosInstance.put(endpoints.updateSetting, {
        member: { name: data?.full_name, job: data?.Job_title },
      });

      initialize();
      if (response?.data?.success) {
        enqueueSnackbar('Updated successfully');
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error while updating', { variant: 'error' });
    }
  });

  const cropperRef = useRef(null);

  const cropperRefCallback = (cropper) => {
    if (cropper) {
      cropperRef.current = cropper;
    }
  };

  const getCroppedImageBlob = (cropper) =>
    new Promise((resolve) => {
      cropper.getCroppedCanvas().toBlob((blob) => {
        resolve(blob);
      });
    });

  const [isLoading, setIsLoading] = useState(false);
  const [avtar, setAvtar] = useState(null);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        const reader = new FileReader();

        reader.onloadend = () => {
          setAvtar(reader.result);
        };

        reader.readAsDataURL(file);

        handleOpen();
      }
    },
    [setValue]
  );

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCrop = async () => {
    try {
      if (cropperRef.current) {
        const { cropper } = cropperRef.current;

        const croppedImageBlob = await getCroppedImageBlob(cropper);
        setIsLoading(true);
        const form = new FormData();
        form.append('file', croppedImageBlob);
        form.append('upload_preset', 'bymtctem');
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dfznwn1fr/image/upload',
          form
        );
        const { data } = await axiosInstance.put(endpoints.uploadsingleImage, {
          type: 'profile',
          image: response?.data?.url,
          imageId: response?.data?.public_id,
        });
        // initialize();
        setValue('profile_picture', response?.data?.url, { shouldValidate: true });
        enqueueSnackbar('Profile uploaded successfully');
        setIsLoading(false);
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
                sx={{ position: 'absolute', zIndex: 9, top: 16, right: 16, left: 16 }}
              >
                <Label variant="filled" color="info">
                  {user?.memberid}
                </Label>
              </Stack>
              <RHFUploadAvatar
                name="profile_picture"
                value={avtar}
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Card>
          </Grid>

          <Grid xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField
                  InputProps={{
                    readOnly: true,
                  }}
                  name="full_name"
                  label="Name"
                />
                <RHFTextField
                  InputProps={{
                    readOnly: true,
                  }}
                  name="email_id"
                  label="Email Address"
                />
                <RHFTextField
                  InputProps={{
                    readOnly: true,
                  }}
                  name="Contact_no"
                  label="Phone Number"
                />
                <RHFTextField
                  InputProps={{
                    readOnly: true,
                  }}
                  name="Job_title"
                  label="Job Title"
                />
                {/* <RHFAutocomplete
                  name="Job_title"
                  label="Job Title"
                  InputProps={{
                    readOnly: true,
                  }}
                  options={jobType.map((country) => country.label)}
                  getOptionLabel={(option) => option}
                  renderOption={(props, option) => {
                    const { label } = jobType.filter((country) => country.label === option)[0];

                    if (!label) {
                      return null;
                    }

                    return (
                      <li {...props} key={label}>
                        {label}
                      </li>
                    );
                  }}
                /> */}
              </Box>

              <Stack
                spacing={3}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: 3 }}
              >
                <Stack>
                  <Stack direction="row" alignItems="center">
                    {/* <Typography>Whatsapp</Typography> */}
                    <Avatar alt="Whatsapp" src="/logo/WhatsApp-logo.png" />

                    <Switch {...label} defaultChecked />
                  </Stack>
                  <Stack direction="row" alignItems="center">
                    <Avatar alt="Contact" src="/logo/Google_Contacts.png" />
                    <Switch
                      onChange={(e) => console.log(e.target.value)}
                      {...label}
                      defaultChecked
                    />
                  </Stack>
                </Stack>
                {/* <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Save Changes
                </LoadingButton> */}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Upload Image
          </Typography>
          <Box sx={{ width: '100%', aspectRatio: '1/1', mx: 'auto', mt: 2 }}>
            <div className="round-crop" style={{ width: '100%', height: '100%' }}>
              <Cropper
                ref={cropperRefCallback}
                src={avtar}
                style={{ height: '100%', width: '100%', borderRadius: '50%' }}
                aspectRatio={1}
                guides
                dragMode="move"
              />
            </div>
          </Box>
          <Stack direction="row" justifyContent="end" mt={2} gap={2}>
            <Button type="button" variant="outoline" color="secondary" onClick={handleClose}>
              Cancel
            </Button>

            <LoadingButton
              onClick={handleCrop}
              color="inherit"
              type="submit"
              variant="contained"
              loading={isLoading}
            >
              Upload
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
