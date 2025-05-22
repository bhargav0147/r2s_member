import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation } from 'react-router';
import * as Yup from 'yup';

import { Alert, LoadingButton } from '@mui/lab';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/system/Unstable_Grid/Grid';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';

import { FormControlLabel, Switch } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify';
import axiosInstance from 'src/utils/axios';

const Signup = ({ setActiveStep, setFormFeild }) => {
  const [errorMsg, setErrorMsg] = React.useState('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const password = useBoolean();
  const confirmPassword = useBoolean();

  const LoginSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phone: Yup.string()
      .required('Contact number is required')
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one special character, and one digit'
      ),
    emailOTP: Yup.string()
      .required('Email OTP is required')
      .matches(/^\d{6}$/, 'OTP must be 6 digits'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const referCode = queryParams.get('ref');

  const defaultValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referal_id: referCode || '',
    is_sales_person: false
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    control
  } = methods;

  const formValues = watch()

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      const res = await axios.post(endpoints.auth.validate, {
        phone: data?.phone,
        referal_code: data?.referal_id,
        email: data?.email,
      });

      const res2 = await axios.post('/api/member/auth/verify', {
        otpWithExpiration: otpHash,
        otp: data.emailOTP,
      });

      if (res?.data?.data?.Ismemberexist) {
        setErrorMsg('User already exist');
        return;
      }

      if (!res?.data?.data?.Isreferalexist && data?.referal_id) {
        setErrorMsg('Invalid referral code');
        return;
      }

      setFormFeild({
        Member: {
          email: data?.email,
          member_name: `${data?.first_name}-${data?.last_name}`,
          password: data?.password,
          phone: data?.phone,
          referal_id: data?.referal_id,
          is_sales_person: data?.is_sales_person
        },
      });

      setActiveStep(1);
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpHash, setOtpHash] = useState(null);

  const sendOTP = async (value) => {
    try {
      const email = value.email;
      setOtpLoading(true);
      if (!email.length) {
        return setErrorMsg('Email is required');
      }

      const { data } = await axiosInstance.post('/api/member/auth/sendotp', { email });
      setOtpHash(data?.otpWithExpiration);
      setOtpSent(true);
      setOtpLoading(false);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <FormProvider sx={{ mt: 10 }} methods={methods} onSubmit={onSubmit}>
      {!!errorMsg && (
        <Alert sx={{ mb: 2 }} severity="error">
          {errorMsg}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <RHFTextField name="first_name" label="First Name" />
        </Grid>

        <Grid item xs={12} lg={6}>
          <RHFTextField name="last_name" label="Last Name" />
        </Grid>

        <Grid sx={{ display: 'flex', gap: 1 }} item xs={12} lg={6}>
          <RHFTextField name="email" label="Email" />{' '}
          <div style={{ marginTop: 10 }}>
            <LoadingButton
              color="inherit"
              type="button"
              variant="contained"
              sx={{ marginLeft: 'auto' }}
              loading={otpLoading}
              onClick={() => sendOTP(methods.getValues())}
            >
              {otpSent ? 'Resend' : 'Send'}
            </LoadingButton>
          </div>
        </Grid>
        <Grid item xs={12} lg={6}>
          <RHFTextField name="emailOTP" label="Email OTP" />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RHFTextField name="phone" label="Contact" />
        </Grid>

        <Grid item xs={12} lg={6}>
          <RHFTextField name="referal_id" label="Referral Code" />
        </Grid>

        <Grid item xs={12} lg={6}>
          <RHFTextField
            name="password"
            label="Password"
            type={password.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RHFTextField
            name="confirmPassword"
            label="Confirm Password"
            type={confirmPassword.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={confirmPassword.onToggle} edge="end">
                    <Iconify
                      icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Controller
            name="is_sales_person"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} />}
                label="Register as a Sales Person"
              />
            )}
          />
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

export default Signup;
