import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { PRODUCT_CHECKOUT_STEPS } from 'src/_mock/_product';

import { useSettingsContext } from 'src/components/settings';

import CheckoutBillingAddress from '../checkout-billing-address';
import CheckoutCart from '../checkout-cart';
import CheckoutOrderComplete from '../checkout-order-complete';
import CheckoutPayment from '../checkout-payment';
import CheckoutSteps from '../checkout-steps';
import { useCheckoutContext } from '../context';

// ----------------------------------------------------------------------

export default function CheckoutView() {
  const settings = useSettingsContext();

  const checkout = useCheckoutContext();



  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 10 }}>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        Checkout
      </Typography>

      <Grid container justifyContent={checkout.completed ? 'center' : 'flex-start'}>
        <Grid xs={12} md={8}>
          <CheckoutSteps activeStep={checkout.activeStep} steps={PRODUCT_CHECKOUT_STEPS} />
        </Grid>
      </Grid>

      {checkout.completed ? (
        <CheckoutOrderComplete
          open={checkout.completed}
          onReset={checkout.onReset}
          onDownloadPDF={() => { }}
        />
      ) : (
        <>
          {checkout.activeStep === 0 && <CheckoutCart />}

          {checkout.activeStep === 1 && <CheckoutBillingAddress />}

          {checkout.activeStep === 2 && <CheckoutPayment />}
        </>
      )}
    </Container>
  );
}
