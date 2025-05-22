import * as Yup from 'yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, LoadingButton } from '@mui/lab';
import Grid from '@mui/system/Unstable_Grid/Grid';

import { jobType } from 'src/assets/data';
import { Cities, States } from 'src/pages/dashboard/find-business/state-city';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

const PersonalDetails = ({ setActiveStep, setFormFeild, formFeild }) => {
  const [errorMsg, setErrorMsg] = React.useState('');

  const LoginSchema = Yup.object().shape({
    address_line_1: Yup.string().required('Address line 1 is required'),
    city: Yup.object().required('City is required'),
    Job_title: Yup.object().required('Job title is required'),
    state: Yup.object().required('State is required'),
    pincode: Yup.string()
      .required('Pincode is required')
      .matches(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  });

  const defaultValues = {
    address_line_1: '',
    pincode: '',
    country: '',
    address_line_2: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);
      setFormFeild({
        ...formFeild,
        Member: { ...formFeild.Member, Job_title: data?.Job_title?.label },
        memberAddress: {
          address_line_1: data?.address_line_1,
          address_line_2: data?.address_line_2,
          city: data?.city?.value,
          state: data?.state?.value,
          pincode: data?.pincode,
          country: "India",
        },
      });

      setActiveStep(2);
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const [stateKey, setStateKey] = useState(null);

  const handleSelect = (option) => {
    console.log(option);
    setStateKey(option?.name);
    methods.setValue('state', option, { shouldValidate: true });
  };

  return (
    <FormProvider sx={{ mt: 10 }} methods={methods} onSubmit={onSubmit}>
      {!!errorMsg && <Alert sx={{mb: 2}} severity="error">{errorMsg}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <RHFAutocomplete
            name="Job_title"
            label="Job"
            options={jobType}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            renderOption={(props, option) => (
              <li {...props} key={option.label}>
                {option.label}
              </li>
            )}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
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
        </Grid>

        <Grid item xs={12} lg={6}>
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
        </Grid>

        <Grid item xs={12} lg={6}>
          <RHFTextField name="address_line_1" label="Address Line 1" />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RHFTextField name="address_line_2" label="Address Line 2" />
        </Grid>

        <Grid item xs={12} lg={6}>
          <RHFTextField name="pincode" label="Pincode" />
        </Grid>

        <Grid item xs={12} sx={{ margin: 'auto' }}>
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Next
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default PersonalDetails;
