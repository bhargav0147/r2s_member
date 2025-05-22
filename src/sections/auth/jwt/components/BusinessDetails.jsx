import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { Alert, LoadingButton } from '@mui/lab';
import Grid from '@mui/system/Unstable_Grid/Grid';

import { timeStamps } from 'src/assets/data';
import { Cities, States } from 'src/pages/dashboard/find-business/state-city';

import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import axiosInstance from 'src/utils/axios';

const BusinessDetails = ({ setActiveStep, setFormFeild, formFeild }) => {
  const [errorMsg, setErrorMsg] = React.useState('');

  const [businessTypeValue, setBusinessTypeValue] = useState(null);

  const LoginSchema = Yup.object().shape({
    bussiness_name: Yup.string().required('Bussiness Name is required'),
    Bussiness_type: Yup.object().required('Bussiness Type is required'),
    start_time: Yup.object().required('Start Time is required'),
    end_time: Yup.object().required('End Time is required'),
    address_line_1: Yup.string().required('Address line 1 is required'),
    area: Yup.string().required('Area is required'),
    city: Yup.object().required('City is required'),
    state: Yup.object().required('State is required'),
    pincode: Yup.string()
      .required('Pincode is required')
      .matches(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
    bussiness_description: Yup.string().required('Business description is required'),
    other_caterogy:
      businessTypeValue === 'Others' ? Yup.string().required('Other category is required') : null,
    website_link: Yup.string().url('Enter a valid url').optional(),
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

        Bussiness: {
          bussiness_name: data?.bussiness_name,
          Bussiness_type: data?.Bussiness_type?.value,
          bussiness_description: data?.bussiness_description,
          website_link: data?.website_link,
          business_hour: `${data?.start_time?.value} - ${data?.end_time?.value}`,
          other: data?.other_caterogy,
        },

        businessAddress: {
          address_line_1: data?.address_line_1,
          address_line_2: data?.address_line_2,
          city: data?.city?.value,
          state: data?.state?.value,
          pincode: data?.pincode,
          area: data?.area,
          country: 'India',
        },
      });

      setActiveStep(3);
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

  const handleBusinessSelect = (option) => {
    console.log(option);
    setBusinessTypeValue(option?.value);
    methods.setValue('Bussiness_type', option, { shouldValidate: true });
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
    <FormProvider sx={{ mt: 10 }} methods={methods} onSubmit={onSubmit}>
      {!!errorMsg && (
        <Alert sx={{ mb: 2 }} severity="error">
          {errorMsg}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <RHFTextField name="bussiness_name" label="Bussiness Name" />
        </Grid>

        <Grid item xs={12} lg={6}>
          <RHFAutocomplete
            name="Bussiness_type"
            label="Bussiness Type"
            options={businessType}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.label === value.value}
            renderOption={(props, option) => (
              <li {...props} key={option.label}>
                {option.label}
              </li>
            )}
            onChange={(event, value) => handleBusinessSelect(value)}
          />
        </Grid>
        {businessTypeValue === 'Others' && (
          <Grid item xs={12}>
            <RHFTextField name="other_caterogy" label="Other Category" />
          </Grid>
        )}

        <Grid container item xs={12} lg={6}>
          <Grid item xs={6}>
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
          </Grid>
          <Grid item xs={6}>
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
          </Grid>
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
          <RHFTextField name="pincode" label="Pincode" />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RHFTextField name="area" label="Area" />
        </Grid>

        <Grid item xs={12} lg={6}>
          <RHFTextField name="address_line_1" label="Address Line 1" />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RHFTextField name="address_line_2" label="Address Line 2" />
        </Grid>

        <Grid item xs={12} lg={6}>
          <RHFTextField name="website_link" label="Website URL" />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RHFTextField name="bussiness_description" label="Bussiness Description" />
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

export default BusinessDetails;
