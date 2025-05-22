import * as Yup from 'yup';
import { useState } from 'react';
// import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { Cities, States } from 'src/pages/dashboard/find-business/state-city';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AccountAddress({ personalAdress, businessAddress }) {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Grid container spacing={3}>
      <Grid xs={12} lg={6} md={12}>
        <BusinessAddress businessAddress={businessAddress} enqueueSnackbar={enqueueSnackbar} />
      </Grid>

      <Grid xs={12} lg={6} md={12}>
        <PersonalAddress personalAdress={personalAdress} enqueueSnackbar={enqueueSnackbar} />
      </Grid>
    </Grid>
  );
}

const BusinessAddress = ({ businessAddress, enqueueSnackbar }) => {
  const { initialize } = useAuthContext();
  const BusinessAddressSchema = Yup.object().shape({
    state: Yup.object().required('State is required'),
    city: Yup.object().required('City is required'),
    pincode: Yup.string().required('Pin code is required'),
    area: Yup.string().required('Area is required'),
    address_line_1: Yup.string().required('Primary address is required'),
  });

  const defaultValues = {
    state: { value: businessAddress[0]?.state, label: businessAddress[0]?.state } || '',
    city: { value: businessAddress[0]?.city, label: businessAddress[0]?.city } || '',
    pincode: businessAddress[0]?.pincode || '',
    area: businessAddress[0]?.area || '',
    address_line_1: businessAddress[0]?.address_line_1 || '',
    address_line_2: businessAddress[0]?.address_line_2 || '',
    country: 'India',
  };

  const methods = useForm({
    resolver: yupResolver(BusinessAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axiosInstance.put(endpoints.updateBusiness, {
        address: {
          address_line_1: data?.address_line_1,
          address_line_2: data?.address_line_2,
          state: data?.state?.value,
          city: data?.city?.value,
          pincode: data?.pincode,
          country: data?.country,
          area: data?.area,
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

  const [stateKey, setStateKey] = useState(null);

  const handleSelect = (option) => {
    console.log(option);
    setStateKey(option?.name);
    methods.setValue('state', option, { shouldValidate: true });
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }} gutterBottom>
          Business Address
        </Typography>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <RHFAutocomplete
            name="state"
            label="State"
            options={States}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            renderOption={(props, option) => (
              <li {...props} key={option.label}>
                {option.label}
              </li>
            )}
            onChange={(event, value) => handleSelect(value)}
          />

          <RHFAutocomplete
            name="city"
            label="City"
            options={Cities[stateKey] || []}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.label === value.value}
            renderOption={(props, option) => (
              <li {...props} key={option.label}>
                {option.label}
              </li>
            )}
          />

          <RHFTextField name="pincode" label="Pincode" />
          <RHFTextField name="area" label="Area" />
        </Box>

        <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
          <RHFTextField name="address_line_1" multiline rows={4} label="Primary Address" />
          <RHFTextField name="address_line_2" multiline rows={4} label="Secondary Address" />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
};

const PersonalAddress = ({ personalAdress, enqueueSnackbar }) => {
  const { initialize } = useAuthContext();

  const PersonalAddressSchema = Yup.object().shape({
    state: Yup.object().required('State is required'),
    city: Yup.object().required('City is required'),
    pincode: Yup.string().required('Pin code is required'),
    address_line_1: Yup.string().required('Primary address is required'),
  });

  const defaultValues = {
    state: { value: personalAdress?.state, label: personalAdress?.state } || '',
    city: { value: personalAdress?.city, label: personalAdress?.city } || '',
    pincode: personalAdress?.pincode || '',
    address_line_1: personalAdress?.address_line_1 || '',
    address_line_2: personalAdress?.address_line_2 || '',
    country: 'India',
  };

  const methods = useForm({
    resolver: yupResolver(PersonalAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axiosInstance.put(endpoints.updateSetting, {
        address: {
          address_line_1: data?.address_line_1,
          address_line_2: data?.address_line_2,
          state: data?.state?.value,
          city: data?.city?.value,
          pincode: data?.pincode,
          country: data?.country,
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

  const [stateKey, setStateKey] = useState(null);

  const handleSelect = (option) => {
    console.log(option);
    setStateKey(option?.name);
    methods.setValue('state', option, { shouldValidate: true });
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }} gutterBottom>
          Personal Address
        </Typography>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <RHFAutocomplete
            name="state"
            label="State"
            options={States}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            renderOption={(props, option) => (
              <li {...props} key={option.label}>
                {option.label}
              </li>
            )}
            onChange={(event, value) => handleSelect(value)}
          />

          <RHFAutocomplete
            name="city"
            label="City"
            options={Cities[stateKey] || []}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.label === value.value}
            renderOption={(props, option) => (
              <li {...props} key={option.label}>
                {option.label}
              </li>
            )}
          />

          <RHFTextField name="pincode" label="Pincode" />
        </Box>

        <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
          <RHFTextField name="address_line_1" multiline rows={4} label="Primary Address" />
          <RHFTextField name="address_line_2" multiline rows={4} label="Secondary Address" />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
};
