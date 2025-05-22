import { useEffect } from 'react';
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

export default function PaymentSuccess({ open = true, }) {
  const navigate = useNavigate();
  

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
      <Typography variant="h4">Thank you for your membership payment!</Typography>
      <Stack justifyContent="center" alignItems="center">
        <Image style={{ width: '30%' }} src={'/assets/images/payment-success.png'} />
      </Stack>
      <Typography>
        Thank you for becoming a member of our community!
        <br />
        <br />
        You now have access to exclusive benefits and content.
        <br /> If you have any questions or need assistance, feel free to contact us. <br /> <br />
        All the best,
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
          onClick={() => navigate('/membership')}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Back to Membership
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

PaymentSuccess.propTypes = {
  open: PropTypes.bool,
  onReset: PropTypes.func,
  children: PropTypes.node,
  onDownloadPDF: PropTypes.func,
};
