import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import axiosInstance from 'src/utils/axios';

import { HOST_API, RAZORPAY_API_KEY } from 'src/config-global';

import FormProvider from 'src/components/hook-form';
import Iconify from 'src/components/iconify';

import CheckoutBillingInfo from './checkout-billing-info';
import CheckoutPaymentMethods from './checkout-payment-methods';
import CheckoutSummary from './checkout-summary';
import { useCheckoutContext } from './context';

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
  {
    value: 0,
    label: 'Free',
    description: '5-7 Days delivery',
  },
  // {
  //   value: 10,
  //   label: 'Standard',
  //   description: '3-5 Days delivery',
  // },
  // {
  //   value: 20,
  //   label: 'Express',
  //   description: '2-3 Days delivery',
  // },
];

const PAYMENT_OPTIONS = [
  // {
  //   value: 'paypal',
  //   label: 'Pay with Paypal',
  //   description: 'You will be redirected to PayPal website to complete your purchase securely.',
  // },
  // {
  //   value: 'credit',
  //   label: 'Credit / Debit Card',
  //   description: 'We support Mastercard, Visa, Discover and Stripe.',
  // },
  {
    value: 'online',
    label: 'Online',
    description: 'Pay with your upi.',
  },
];

const CARDS_OPTIONS = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

export default function CheckoutPayment() {
  const checkout = useCheckoutContext();

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Payment is required'),
  });

  const defaultValues = {
    delivery: checkout.shipping,
    payment: '',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async () => {
    try {
      const body = {
        products: checkout?.items?.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        addressId: checkout?.billing.id,
        transactionID: new Date().toISOString(),
        useWalletBalance: checkout.checked
      };


      const { data } = await axiosInstance.post('/api/member/ecommerce/order/create', body);


      const options = {
        key: RAZORPAY_API_KEY,
        amount: data?.order?.amount,
        currency: 'INR',
        name: 'Return2Success',
        description: 'Test Transaction',
        image: 'https://example.com/your_logo',
        order_id: data?.order?.id,
        callback_url: `${HOST_API}/api/member/ecommerce/order/verifyPayment?secretKey=${data?.secretKey}`,
        prefill: {
          name: checkout?.billing?.order_reciver_name,
          email: '',
          contact: checkout?.billing?.order_reciver_mobile_number,
        },
        notes: {
          address: 'Razorpay Corporate Office',
        },
        theme: {
          color: '#3399cc',
        },
      };
      const razor = new window.Razorpay(options);
      razor.open();

      checkout?.onReset();

    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>

          {/* <CheckoutDelivery onApplyShipping={checkout.onApplyShipping} options={DELIVERY_OPTIONS} /> */}

          <CheckoutPaymentMethods
            cardOptions={CARDS_OPTIONS}
            options={PAYMENT_OPTIONS}
            sx={{ my: 3 }}
          />

          <Button
            size="small"
            color="inherit"
            onClick={checkout.onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Back
          </Button>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutBillingInfo billing={checkout.billing} onBackStep={checkout.onBackStep} />

          <CheckoutSummary
            total={checkout.total}
            subTotal={checkout.subTotal}
            discount={checkout.discount}
            shipping={checkout.shipping}
            onEdit={() => checkout.onGotoStep(0)}
            checked={checkout.checked}
            handleChange={checkout.handleCheckChange}
            shippingFee={checkout?.shipping}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Complete Order
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
