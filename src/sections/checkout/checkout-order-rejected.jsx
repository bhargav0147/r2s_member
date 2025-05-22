import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { m, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import { varFade } from 'src/components/animate';
import Image from 'src/components/image/image';

// ----------------------------------------------------------------------

export default function CheckoutOrderRejected({ open = true}) {
  const navigate = useNavigate()

  const renderContent = (
    <Stack
      spacing={5}
      sx={{
        m: 'auto',
        maxWidth: 480,
        textAlign: 'center',
        px: { xs: 2, sm: 0 },
      }}
    >
       <Typography variant="h4" sx={{ color: 'red' }}>
        Payment failed
      </Typography>
      <Stack justifyContent="center" alignItems="center">
        <Image style={{ width: '25%' }} src={'/assets/images/failed.png'} />
      </Stack>
      <Typography>
        We're sorry, but your payment was unsuccessful.
        <br />
        <br />
        Please check your payment details and try again.
        <br /> If you continue to experience issues, feel free to contact us for assistance. <br />{' '}
        <br />
        We apologize for any inconvenience caused.
      </Typography>
      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack
        spacing={2}
        justifyContent="space-between"
        direction={{ xs: 'column-reverse', sm: 'row' }}
      >
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          onClick={() => navigate('/find-product')}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Back to Shopping
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          fullWidth
          fullScreen
          open={open}
          PaperComponent={(props) => (
            <Box
              component={m.div}
              {...varFade({
                distance: 120,
                durationIn: 0.32,
                durationOut: 0.24,
                easeIn: 'easeInOut',
              }).inUp}
              sx={{
                width: 1,
                height: 1,
                p: { md: 3 },
              }}
            >
              <Paper {...props}>{props.children}</Paper>
            </Box>
          )}
        >
          {renderContent}
        </Dialog>
      )}
    </AnimatePresence>
  );
}

CheckoutOrderRejected.propTypes = {
  open: PropTypes.bool,
  onReset: PropTypes.func,
  children: PropTypes.node,
  onDownloadPDF: PropTypes.func,
};
