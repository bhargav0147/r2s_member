import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { Alert, LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid/Grid';

import { useAuthContext } from 'src/auth/hooks';

import { RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

const BankDetails = ({ setActiveStep, setFormFeild, formFeild }) => {
  const [errorMsg, setErrorMsg] = React.useState('');
  const { register } = useAuthContext();

  const LoginSchema = Yup.object().shape({
    terms: Yup.boolean().oneOf([true], 'Terms and condition must be accepted').required(),
  });

  const defaultValues = {
    upi_id: '',
    bank_name: '',
    Account_name: '',
    Account_no: '',
    Ifsc_code: '',
    terms: false,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(
    async ({ Account_name, Account_no, Ifsc_code, bank_name, upi_id }) => {
      console.log(formFeild, "this is formfield console")
      try {
        setErrorMsg('');

        if (upi_id) {
          await register?.({
            ...formFeild,

            upiId: upi_id,
          });
          router.push('/find-business');
        } else if (Account_name && Account_no && Ifsc_code && bank_name) {
          await register?.({
            ...formFeild,
            bank: {
              Account_name,
              Account_no,
              Ifsc_code,
              bank_name,
            },
            upiId: upi_id,
          });
          router.push('/find-business');
        } else {
          setErrorMsg('UPI or Bank fields are required!');
        }
      } catch (error) {
        console.error(error);
        setErrorMsg(typeof error === 'string' ? error : error.message);
      }
    }
  );

  return (
    <FormProvider sx={{ mt: 10 }} methods={methods} onSubmit={onSubmit}>
      {!!errorMsg && (
        <Alert sx={{ mb: 2 }} severity="error">
          {errorMsg}
        </Alert>
      )}
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12}>
          <RHFTextField name="upi_id" label="UPI id / Google Pay/ Phone Pe" />
        </Grid>

        <Grid item xs={12}>
          <Typography align="center">Or</Typography>
        </Grid>
        <Grid item xs={12} lg={6}>
          <RHFTextField name="bank_name" label="Bank Name" />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RHFTextField name="Account_name" label="Account Name" />
        </Grid>

        <Grid item xs={12} lg={6}>
          <RHFTextField name="Account_no" label="Account Number" />
        </Grid>

        <Grid item xs={12} lg={6}>
          <RHFTextField name="Ifsc_code" label="IFSC Code" />
        </Grid>

        <Grid item xs={12}>
          <RHFCheckbox
            name="terms"
            label={
              <span>
                By clicking the checkbox, I agree to abide by our{' '}
                <a href="/terms&condition" target="_blank">
                  Terms & Conditions
                </a>{' '}
                and <a href="/privacy-policy" target="_blank">Privacy Policy.</a>
              </span>
            }
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

export default BankDetails;
