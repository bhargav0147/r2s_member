import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';



import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function AccountShippingFee() {
  const { enqueueSnackbar } = useSnackbar();
  const { user, initialize } = useAuthContext();




  const shippingFeeSchema = Yup.object().shape({
    shippingFee: Yup.number().required('Shipping Fee is required').min(0, 'Shipping Fee must be a positive number'),
  })

  const defaultValues = {
    shippingFee: 0,
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(shippingFeeSchema)
  });

  const {
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {

    try {
      const response = await axiosInstance?.put(endpoints?.updateShippingFee, {
        shippingFee: data?.shippingFee
      });

      if (response.data.success) {
        setValue('shippingFee', response.data?.data?.shippingFee);
      }
      enqueueSnackbar('Update success!');

    } catch (error) {
      enqueueSnackbar(error?.message || 'Error while Update Shipping Fee!', { variant: 'error' });
    }
  });


  useEffect(() => {
    const fetchShippingFee = async () => {
      try {
        const response = await axiosInstance?.get(endpoints?.getShippingFee);

        setValue('shippingFee', response.data.data?.shippingFee || 0)
      } catch (error) {
        console.log(error);
      }
    }
    fetchShippingFee();
  }, [setValue])


  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>


        <RHFTextField
          name="shippingFee"
          type='number'
          label="Shipping Fee"
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save Changes
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
