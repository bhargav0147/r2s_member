import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function OrderDetailsToolbar({
  status,
  backLink,
  createdAt,
  orderNumber,
  statusOptions,
  onChangeStatus,
  isMyOrder,
  isOrder,
  setDeliveryOtp,
  updateStatus,
  deliveryOtp,
  orderId
}) {
  const popover = usePopover();
  const navigate = useNavigate()

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        justifyContent="space-between"
      >
        <Stack spacing={1} direction="row" alignItems="flex-start" >
          <IconButton component={RouterLink} href={backLink}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4"> Order {orderNumber} </Typography>
              <Label
                variant="soft"
                color={
                  (status === 'completed' && 'success') ||
                  (status === 'pending' && 'warning') ||
                  (status === 'cancelled' && 'error') ||
                  'default'
                }
              >
                {status}
              </Label>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {fDateTime(createdAt)}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction='column' sx={{ gap: 2 }}>
          <Stack
            flexGrow={1}
            spacing={1.5}
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
          >

            <Button

              onClick={
                () => {
                  navigate(`/order-inovoice/${orderId}`)
                }
              }
              color="inherit"
              variant="outlined"
              startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
            >
              Print
            </Button>

            {isOrder && <Button
              color="inherit"
              variant="outlined"
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              onClick={popover.onOpen}
              sx={{ textTransform: 'capitalize' }}
            >
              {status}
            </Button>}

            {isOrder && <Button color="inherit" variant="contained" startIcon={<Iconify icon="ic:baseline-save" />} onClick={updateStatus}>
              Save
            </Button>}

          </Stack>
          {status === "DELIVERED" && <TextField placeholder='Enter Delivery Otp' value={deliveryOtp} onChange={(event) => {
            setDeliveryOtp(event.target.value)
          }} />}
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === status}
            onClick={() => {
              popover.onClose();
              onChangeStatus(option.value);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

OrderDetailsToolbar.propTypes = {
  backLink: PropTypes.string,
  createdAt: PropTypes.instanceOf(Date),
  onChangeStatus: PropTypes.func,
  orderNumber: PropTypes.string,
  status: PropTypes.string,
  statusOptions: PropTypes.array,
  isMyOrder: PropTypes.bool,
  isOrder: PropTypes.bool,
  setDeliveryOtp: PropTypes.func,
  updateStatus: PropTypes.func,
  deliveryOtp: PropTypes.string,
  orderId: PropTypes.string

};
