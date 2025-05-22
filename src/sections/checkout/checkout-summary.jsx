import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import { Switch } from '@mui/material';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CheckoutSummary({
  total,
  discount,
  subTotal,
  shipping,
  //
  onEdit,
  onApplyDiscount,
  checked,
  handleChange,
  shippingFee
}) {
  const displayShipping = shippingFee !== null ? shippingFee : 'Free';


  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Order Summary"
        action={
          onEdit && (
            <Button size="small" onClick={onEdit} startIcon={<Iconify icon="solar:pen-bold" />}>
              Edit
            </Button>
          )
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sub Total
            </Typography>
            <Typography variant="subtitle2">{fCurrency(subTotal)}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Discount
            </Typography>
            <Typography variant="subtitle2">{discount ? fCurrency(-discount) : '-'}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems='center'>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Use WalletBalance
            </Typography>
            <Switch color='success' sx={{ marginRight: "-15px" }} checked={checked} onChange={handleChange} />
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems='center'>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Shipping
            </Typography>
            <Typography variant="subtitle2">
              {shippingFee ? fCurrency(shippingFee) : displayShipping}
            </Typography>
          </Stack>


          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Total</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                {fCurrency(total)}
              </Typography>
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                (VAT included if applicable)
              </Typography>
            </Box>
          </Stack>
          {/*
          {onApplyDiscount && (
            <TextField
              fullWidth
              placeholder="Discount codes / Gifts"
              value="DISCOUNT5"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button color="primary" onClick={() => onApplyDiscount(5)} sx={{ mr: -0.5 }}>
                      Apply
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          )} */}
        </Stack>
      </CardContent>
    </Card>
  );
}

CheckoutSummary.propTypes = {
  total: PropTypes.number,
  discount: PropTypes.number,
  shipping: PropTypes.number,
  subTotal: PropTypes.number,
  onEdit: PropTypes.func,
  onApplyDiscount: PropTypes.func,
  checked: PropTypes.bool,
  handleChange: PropTypes.func,
  shippingFee: PropTypes.number
};
