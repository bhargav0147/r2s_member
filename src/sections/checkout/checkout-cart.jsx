import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { RouterLink } from 'src/routes/components';

import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';

import CheckoutCartProductList from './checkout-cart-product-list';
import CheckoutSummary from './checkout-summary';
import { useCheckoutContext } from './context';

// ----------------------------------------------------------------------

export default function CheckoutCart() {
  const checkout = useCheckoutContext();

  const empty = !checkout.items.length;

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Cart
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({checkout.totalItems} item)
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {empty ? (
            <EmptyContent
              title="Cart is Empty!"
              description="Look like you have no items in your shopping cart."
              imgUrl="/assets/icons/empty/ic_cart.svg"
              sx={{ pt: 5, pb: 10 }}
            />
          ) : (
            <CheckoutCartProductList
              products={checkout?.items}
              onDelete={checkout?.onDeleteCart}
              onIncreaseQuantity={checkout?.onIncreaseQuantity}
              onDecreaseQuantity={checkout?.onDecreaseQuantity}
            />
          )}
        </Card>

        <Button
          component={RouterLink}
          href="/find-product"
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Continue Shopping
        </Button>
      </Grid>

      <Grid xs={12} md={4}>
        <CheckoutSummary
          total={checkout.total}
          discount={checkout.discount}
          subTotal={checkout.subTotal}
          onApplyDiscount={checkout.onApplyDiscount}
          checked={checkout.checked}
          handleChange={checkout.handleCheckChange}
          shippingFee={checkout?.shipping}
        />

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={empty}
          onClick={checkout.onNextStep}
        >
          Check Out
        </Button>
      </Grid>
    </Grid>
  );
}
