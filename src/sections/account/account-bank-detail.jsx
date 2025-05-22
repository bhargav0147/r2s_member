import * as Yup from 'yup';
// import { useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';


// import { fData } from 'src/utils/format-number';

// import { countries } from 'src/assets/data';

import { useEffect, useState } from 'react';

import { Alert } from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';

// import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function AccountBankDetail({ Bank_Detail }) {
  const { enqueueSnackbar } = useSnackbar();

  const { initialize } = useAuthContext();


  const UpdateUserSchema = Yup.object().shape({
    account_name: Yup.string(),
    account_number: Yup.string(),
    ifsc_code: Yup.string(),
    bank_name: Yup.string(),
    upi_id: Yup.string(),
  }).test('oneOfRequired', 'Either UPI id or Bank Account details are required', function (value) {
    const { account_name, account_number, ifsc_code, bank_name, upi_id } = value;
    if (!upi_id && (!account_name || !account_number || !ifsc_code || !bank_name)) {
      return this.createError({ path: 'upi_id', message: 'Either UPI id or Bank Account details are required' });
    }
    return true;
  });


  const defaultValues = {
    account_name: Bank_Detail?.Account_name || '',
    account_number: Bank_Detail?.Account_no || '',
    ifsc_code: Bank_Detail?.Ifsc_code || '',
    bank_name: Bank_Detail?.bank_name || '',
    upi_id: Bank_Detail?.upi_id || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue
  } = methods;

  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = handleSubmit(
    async ({ account_name, account_number, ifsc_code, bank_name, upi_id }) => {
      try {
        const response = await axiosInstance.put(endpoints.updateSetting, {
          bank: { account_name, account_number, ifsc_code, bank_name, upi_id },
        });

        initialize();
        if (response?.data?.success) {
          enqueueSnackbar('Updated successfully');
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Error while updating', { variant: 'error' });
      }
    }
  );

  useEffect(() => {
    setValue('account_number', Bank_Detail?.Account_no)
  }, [])

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} lg={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 2 }} gutterBottom>
              Bank Detail
            </Typography>

            {!!errorMsg && (
              <Alert sx={{ mb: 2 }} severity="error">
                {errorMsg}
              </Alert>
            )}
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="account_name" label="Account Name" />
              <RHFTextField name="account_number" label="Account Number" />
              <RHFTextField name="bank_name" label="Bank Name " />
              <RHFTextField name="ifsc_code" label="IFSC Code " sx={{
                textTransform: 'uppercase',
              }} />
            </Box>
            <Stack width={1} alignItems='center' sx={{ mb: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                OR
              </Typography>
            </Stack>

            <RHFTextField name="upi_id" label="UPI Id/Google Pay/Phone Pe" />

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
