import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Cropper } from 'react-cropper';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Modal, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { timeStamps } from 'src/assets/data';
import { useAuthContext } from 'src/auth/hooks';

import FormProvider, {
  RHFAutocomplete,
  RHFTextField,
  RHFUpload,
  RHFUploadAvatar,
} from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

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



export default function BussinessGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user, initialize } = useAuthContext();

  const businessProfile = user?.Business_Profile[0];

  const [businessTypeValue, setBusinessTypeValue] = useState(
    businessProfile?.Bussiness_type?.split('_')?.join(' ')
  );

  const UpdateUserSchema = Yup.object().shape({
    Bussiness_type: Yup.string().required('Bussiness Type is required'),
    description: false ? Yup.string().required('Description is required') : null,
    other_caterogy:
      businessTypeValue === 'Others' ? Yup.string().required('Other category is required') : null,
    start_time: Yup.object().required('Start time is required'),
    end_time: Yup.object().required('End time Type is required'),
    website_link: Yup.string().url('Enter a valid url').optional()
  });

  const defaultValues = {
    bussiness_name: businessProfile?.bussiness_name || '',
    short_description: businessProfile?.short_description || '',
    Bussiness_type: businessProfile?.Bussiness_type?.split('_')?.join(' ') || '',
    description: businessProfile?.description || '',
    start_time: {
      value: businessProfile?.business_hour?.split(' - ')[0],
      label: businessProfile?.business_hour?.split(' - ')[0],
    },
    end_time: {
      value: businessProfile?.business_hour?.split(' - ')[1],
      label: businessProfile?.business_hour?.split(' - ')[1],
    },
    business_logo: businessProfile?.business_logo || null,
    business_cover_image: businessProfile?.business_cover_image || null,
    website_link: businessProfile?.website_link || '',
    other_caterogy: businessProfile?.otherType || '',
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
      const response = await axiosInstance.put(endpoints.updateBusiness, {
        business: {
          name: data?.bussiness_name,
          short_description: data?.short_description,
          type: data?.Bussiness_type,
          other: data?.other_caterogy,
          hour: `${data?.start_time?.value} - ${data?.end_time?.value}`,
          description: data?.description,
          website_link: data?.website_link,
        },
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

  const [logo, setLogo] = useState(null);
  const [cover, setCover] = useState(null);

  const [activeModal, setActiveModal] = useState('Logo');

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        const reader = new FileReader();

        reader.onloadend = () => {
          setLogo(reader.result);
        };

        reader.readAsDataURL(file);
        setActiveModal('Logo');
        handleOpen();
      }
    },
    [setValue]
  );

  const handleDropCover = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();

        reader.onloadend = () => {
          setCover(reader.result);
        };

        reader.readAsDataURL(file);
        setActiveModal('Cover');
        handleOpen();
      }
    },
    [setValue]
  );

  const handleSelect = (option) => {
    console.log(option);
    setBusinessTypeValue(option);
    methods.setValue('Bussiness_type', option, { shouldValidate: true });
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const cropperRef = useRef(null);

  const cropperRefCallback = (cropper) => {
    if (cropper) {
      cropperRef.current = cropper;
    }
  };

  const getCroppedImageBlob = (cropper) => new Promise((resolve) => {
    cropper.getCroppedCanvas().toBlob((blob) => {
      resolve(blob);
    });
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleCrop = async () => {
    try {
      if (cropperRef.current) {
        const { cropper } = cropperRef.current;

        const croppedImageBlob = await getCroppedImageBlob(cropper);
        setIsLoading(true);
        const form = new FormData();
        form.append('file', croppedImageBlob);

        form.append('upload_preset', 'bymtctem');
        if (activeModal === 'Logo') {
          const response = await axios.post(
            'https://api.cloudinary.com/v1_1/dfznwn1fr/image/upload',
            form
          );
          const { data } = await axiosInstance.put(endpoints.uploadsingleImage, {
            type: 'logo',
            image: response?.data?.url,
            imageId: response?.data?.public_id,
          });
          setValue('business_logo', response?.data?.url, { shouldValidate: true });
          enqueueSnackbar('Logo uploaded successfully');
        } else {
          const response = await axios.post(
            'https://api.cloudinary.com/v1_1/dfznwn1fr/image/upload',
            form
          );
          const { data } = await axiosInstance.put(endpoints.uploadsingleImage, {
            type: 'cover',
            image: response?.data?.url,
            imageId: response?.data?.public_id,
          });
          setValue('business_cover_image', response?.data?.url, { shouldValidate: true });
          enqueueSnackbar('Cover photo uploaded successfully');
        }
        initialize();
        setIsLoading(false);
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // for businessType

  const [businessType, setBusinessType] = useState([]);

  const getBusinessTypes = async () => {
    try {
      const { data } = await axiosInstance.get("/api/admin/business/type?page=1&pageSize=1000");
      const businessTypeList = data?.data?.map((item) => ({
        value: item.type,
        label: item.type
      }));

      setBusinessType(businessTypeList)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getBusinessTypes()
  }, [])

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <Card sx={{ pt: 4, pb: 5, px: 3, textAlign: 'center' }}>
              <RHFUploadAvatar name="business_logo" maxSize={3145728} onDrop={handleDrop} />

              <RHFUpload
                sx={{ mt: 3 }}
                name="business_cover_image"
                maxSize={3145728}
                onDrop={handleDropCover}
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
                <RHFTextField name="bussiness_name" label="Business Name" />
                <RHFAutocomplete
                  name="Bussiness_type"
                  label="Category"
                  options={businessType.map((item) => item.label)}
                  getOptionLabel={(option) => option}
                  renderOption={(props, option) => {
                    const { code, label, phone } = businessType.filter(
                      (item) => item.label === option
                    )[0];

                    if (!label) {
                      return null;
                    }

                    return (
                      <li {...props} key={label}>
                        {label}
                      </li>
                    );
                  }}
                  onChange={(event, value) => handleSelect(value)}
                />
              </Box>

              {businessTypeValue === 'Others' && (
                <RHFTextField sx={{ mt: 3 }} name="other_caterogy" label="Other Category" />
              )}

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
                sx={{ mt: 3 }}
              >
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFAutocomplete
                    name="start_time"
                    label="Start Time"
                    options={timeStamps}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.label === value.value}
                    renderOption={(props, option) => (
                      <li {...props} key={option.label}>
                        {option.label}
                      </li>
                    )}
                  />
                  <RHFAutocomplete
                    name="end_time"
                    label="End Time"
                    options={timeStamps}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.label === value.value}
                    renderOption={(props, option) => (
                      <li {...props} key={option.label}>
                        {option.label}
                      </li>
                    )}
                  />
                </Box>

                <RHFTextField name="website_link" label="Website Link" />
              </Box>

              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <RHFTextField
                  name="short_description"
                  rows={1}
                  inputProps={{ maxLength: 300 }}
                  label="Short Description"
                />

                <RHFTextField name="description" multiline rows={4} label="Description" />

                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>

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
          <Box
            sx={{
              width: '100%',
              aspectRatio: activeModal === 'Logo' ? '1/1' : '16/9',
              mx: 'auto',
              mt: 2,
            }}
          >
            {activeModal === 'Logo' ? (
              <div className="round-crop" style={{ width: '100%', height: '100%' }}>
                <Cropper
                  ref={cropperRefCallback}
                  src={logo}
                  aspectRatio={1}
                  guides
                  dragMode="move"
                />
              </div>
            ) : (
              <Cropper
                ref={cropperRefCallback}
                src={cover}
                aspectRatio={16 / 9}
                guides
                dragMode="move"
              />
            )}
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
