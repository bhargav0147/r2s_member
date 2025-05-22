import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function AccountSocialLinks({ socialLinks }) {
  const { enqueueSnackbar } = useSnackbar();
  const { initialize } = useAuthContext();
  const defaultValues = {
    facebook: socialLinks.facebook,
    instagram: socialLinks.instagram,
    linkedin: socialLinks.linkedin,
    twitter: socialLinks.twitter,
    youtube: socialLinks.youtube,
  };



  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axiosInstance.put(endpoints.updateSocialLink, data)

      if (response?.data?.success) {
        enqueueSnackbar('Updated successfully')
        initialize()
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message || 'Error while updating', { variant: 'error' })
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <RHFTextField
          name="facebook"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify width={24} icon="eva:facebook-fill" color="#1877F2" />
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField
          name="instagram"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify width={24} icon="ant-design:instagram-filled" color="#DF3E30" />
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField
          name="linkedin"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify width={24} icon="eva:linkedin-fill" color="#006097" />
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField
          name="twitter"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify width={24} icon="eva:twitter-fill" color="#1C9CEA" />
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField
          name="youtube"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify width={24} icon="mdi:youtube" color="#CD201F" />
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save Changes
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

AccountSocialLinks.propTypes = {
  socialLinks: PropTypes.object,
};
