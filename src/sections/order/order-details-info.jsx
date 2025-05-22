import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function OrderDetailsInfo({ customer, delivery, payment, shippingAddress, isOrder, isMyOrder }) {
  const renderCustomer = (
    <>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" justifyContent='space-between'>
            <Typography variant="h6" component="div">
              Customer Info
            </Typography>
            {isMyOrder && <Typography variant="h6" component="div" sx={{ fontWeight: 700, ml: 2 }}>
              OTP - {payment?.deliveryOtp}
            </Typography>
            }
          </Stack>
        }
      />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar
          alt={customer?.full_name}
          src={customer?.avatarUrl}
          sx={{ width: 48, height: 48, mr: 2 }}
        />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{customer?.full_name}</Typography>

          <Box sx={{ color: 'text.secondary' }}>{customer?.Contact_no}</Box>

          {/* <Box>
            IP Address:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {customer?.ipAddress}
            </Box>
          </Box> */}

          {/* <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ mt: 1 }}
          >
            Add to Blacklist
          </Button> */}
        </Stack>
      </Stack>
    </>
  );

  const renderDelivery = (
    <>
      <CardHeader
        title="Delivery"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Ship by
          </Box>
          {delivery?.shipBy}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Speedy
          </Box>
          {delivery?.speedy}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Tracking No.
          </Box>
          <Link underline="always" color="inherit">
            {delivery?.trackingNumber}
          </Link>
        </Stack>
      </Stack>
    </>
  );

  const renderShipping = (
    <>
      <CardHeader
        title="Shipping"
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Address
          </Box>
          {`${shippingAddress?.address_line_1 ? shippingAddress?.address_line_1 : ""}  ${shippingAddress?.address_line_2 ? shippingAddress?.address_line_2 : ""}  ${shippingAddress?.city ? shippingAddress?.city : ""}  ${shippingAddress?.state}  ${shippingAddress?.country}  ${shippingAddress?.pincode}`}
        </Stack>

        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Phone number
          </Box>
          {customer?.Contact_no}
        </Stack>
      </Stack>
    </>
  );

  const renderPayment = (
    <>
      <CardHeader
        title="Payment"

      />
      <Stack direction="row" alignItems="center" sx={{ p: 3, typography: 'body2' }}>
        <Box component="span" sx={{ color: 'text.secondary', flexGrow: 1 }}>
          Transaction Id
        </Box>
        {payment?.orderId}
      </Stack>
    </>
  );

  return (
    <Card>
      {renderCustomer}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* {renderDelivery} */}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderShipping}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderPayment}
    </Card>
  );
}

OrderDetailsInfo.propTypes = {
  customer: PropTypes.object,
  delivery: PropTypes.object,
  payment: PropTypes.object,
  shippingAddress: PropTypes.object,
};
