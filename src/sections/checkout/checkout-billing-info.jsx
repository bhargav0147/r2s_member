import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CheckoutBillingInfo({ billing, onBackStep }) {
  console.log(billing);
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Address"
        action={
          <Button size="small" startIcon={<Iconify icon="solar:pen-bold" />} onClick={onBackStep}>
            Edit
          </Button>
        }
      />
      <Stack spacing={1} sx={{ p: 3 }}>
        <Box sx={{ typography: 'subtitle2' }}>
          {`${billing?.order_reciver_name} `}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            ({billing?.type === 'home_delivery' ? 'Home' : 'Office'})
          </Box>
        </Box>

        <Box
          sx={{ color: 'text.secondary', typography: 'body2' }}
        >{`${billing?.address_line_1}, ${billing?.city}, ${billing?.country}, ${billing?.pincode}`}</Box>

        <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
          {billing?.order_reciver_mobile_number}
        </Box>
      </Stack>
    </Card>
  );
}

CheckoutBillingInfo.propTypes = {
  billing: PropTypes.object,
  onBackStep: PropTypes.func,
};
