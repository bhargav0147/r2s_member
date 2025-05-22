import { useSnackbar } from 'notistack';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';

import Iconify from 'src/components/iconify';

import { AddressItem, AddressNewForm } from '../address';
import CheckoutSummary from './checkout-summary';
import { useCheckoutContext } from './context';

import { useMutation, useQuery } from 'react-query';

// ----------------------------------------------------------------------

export default function CheckoutBillingAddress() {
  const checkout = useCheckoutContext();
  const { enqueueSnackbar } = useSnackbar();

  const addressForm = useBoolean();

  const getAddress = async () => {
    const { data } = await axiosInstance.get('/api/member/ecommerce/address');
    return data?.data;
  };

  const {
    data: addresses,
    isLoading,
    error,
    refetch,
  } = useQuery('addresses', getAddress, {
    staleTime: 60000,
    cacheTime: 3600000,
  });



  const deleteAddress = useMutation(
    (id) => axiosInstance.delete(`/api/member/ecommerce/address/${id}`),
    {
      onSuccess: () => {
        refetch();
        enqueueSnackbar('Deleted Successfully');
      },
      onError: (error) => {
        console.log(error);
        enqueueSnackbar(error?.response?.data?.message || 'Internal Server Error', {
          variant: 'error',
        });
      },
    }
  );

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          {addresses?.map((address) => {
            if (!address?.is_delete)
              return (
                <AddressItem
                  key={address.id}
                  address={address}
                  action={
                    <Stack flexDirection="row" flexWrap="wrap" flexShrink={0}>
                      {!address.primary && (
                        <Button
                          onClick={() => deleteAddress.mutate(address.id)}
                          size="small"
                          color="error"
                          sx={{ mr: 1 }}
                        >
                          Delete
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => checkout.onCreateBilling(address)}
                      >
                        Deliver to this Address
                      </Button>
                    </Stack>
                  }
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: (theme) => theme.customShadows.card,
                  }}
                />
              );
          })}

          <Stack direction="row" justifyContent="space-between">
            <Button
              size="small"
              color="inherit"
              onClick={checkout.onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              Back
            </Button>

            <Button
              size="small"
              color="primary"
              onClick={addressForm.onTrue}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Address
            </Button>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutSummary
            total={checkout.total}
            subTotal={checkout.subTotal}
            discount={checkout.discount}
            checked={checkout.checked}
            handleChange={checkout.handleCheckChange}
            shippingFee={checkout?.shipping}
          />
        </Grid>
      </Grid>

      <AddressNewForm
        refetch={refetch}
        open={addressForm.value}
        onClose={addressForm.onFalse}
        onCreate={checkout.onCreateBilling}
      />
    </>
  );
}
