import { LoadingButton } from '@mui/lab';
import {
  Divider,
  ListItemText,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import { Box, Container, Stack } from '@mui/system';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { paths } from 'src/routes/paths';

import { useCountdownDate } from 'src/hooks/use-countdown';

import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { HOST_API, RAZORPAY_API_KEY } from 'src/config-global';

import { useQuery, useQueryClient } from 'react-query';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Image from 'src/components/image/image';
import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';
import { useBoolean } from 'src/hooks/use-boolean';
import ReferallDialog from './referalldialog';

const MembershipView = ({ isMembership }) => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const dialog = useBoolean();
  const [haveReferral, setHaveReferral] = useState(true)
  const [referallCode, setReferallCode] = useState("")
  const settings = useSettingsContext();
  const navigate = useNavigate();

  const { days, hours, minutes, seconds } = useCountdownDate(new Date(user?.Valid_upto));

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getRecentTransition = async () => {
    const { data } = await axios.get(endpoints.transaction);
    return data?.data;
  };

  const {
    data: transactions,
    isLoading,
    error,
    refetch,
  } = useQuery('RecentTransition', getRecentTransition, {
    staleTime: 60000,
    cacheTime: 3600000,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('success');

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(window.location.search);
  //   const payment = searchParams.get('payment');

  //   if (payment) {
  //     setStatus(payment);
  //     setIsModalOpen(true);
  //   }
  // }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/membership');
  };

  const [errorMsg, setErrorMsg] = useState('');

  function isTimestampValid() {
    if (!user?.Valid_upto) {
      return false;
    }
    const givenTimestamp = new Date(user?.Valid_upto);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    if (givenTimestamp > thirtyDaysFromNow) {
      return true;
    }

    return false;
  }

  const handlePayment = async () => {


    try {

      if (isTimestampValid()) {
        setIsModalOpen(true);
        return;
      }
      const { data, status } = await axios.post(endpoints.createPayment, {
        ...(haveReferral && { referallCode })
      });

      if (status === 201) {
        setErrorMsg(data.message)
        return;
      }

      const options = {
        key: RAZORPAY_API_KEY,
        amount: data?.data?.order?.amount,
        currency: 'INR',
        name: 'Return2Success',
        description: 'Test Transaction',
        image: 'https://example.com/your_logo',
        order_id: data?.data?.order?.id,
        callback_url: `${HOST_API}/api/member/payment/verifyPayment?secretKey=${data?.data?.paymentData?.transction_id}`,
        prefill: {
          name: '',
          email: '',
          contact: '',
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
      queryClient.invalidateQueries('RecentTransition');
      setErrorMsg('')
      setReferallCode('')
      dialog.onFalse()
    } catch (error) {
      console.error(error);
      setReferallCode('')
      dialog.onFalse()
    }
  };

  return (
    <Container
      sx={{
        minHeight: 1,
      }}
      maxWidth={settings.themeStretch ? false : 'xl'}
    >
      {isMembership && (
        <CustomBreadcrumbs
          heading="Membership"
          links={[{ name: 'Dashboard', href: paths.findBusiness }, { name: 'Membership' }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
      )}

      <ToastContainer />
      {user?.is_premium &&
        (loading ? (
          <Typography sx={{ textAlign: 'center' }} variant="body2">
            Loading...
          </Typography>
        ) : (
          <>
            <Typography
              align="center"
              sx={{ color: 'text.secondary', mb: { md: 3, xs: 2, sm: 2 } }}
            >
              Your membership is going to expire in
            </Typography>
            <Stack
              direction="row"
              justifyContent="center"
              divider={<Box sx={{ mx: { xs: 1, sm: 1 }, px: { md: 2, xs: 1, sm: 1 } }}>:</Box>}
              sx={{ typography: { md: 'h2', xs: 'h3', sm: 'h3' } }}
            >
              <TimeBlock label="Days" value={days} />

              <TimeBlock label="Hours" value={hours} />

              <TimeBlock label="Minutes" value={minutes} />

              <TimeBlock label="Seconds" value={seconds} />
            </Stack>
          </>
        ))}

      <Box
        sx={{
          mt: 5,
          width: 1,
          borderRadius: 2,
        }}
      >
        <Box
          gap={4}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          <Box>
            <Box
              sx={{
                p: { xs: 2, sm: 2, md: 4 },
                borderRadius: 2,
                bgcolor: 'background.neutral',
                height: '100%',
              }}
            >
              <Typography variant="h6" sx={{ mb: 5 }}>
                Annual Plan
              </Typography>

              <Stack spacing={2.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Subscription
                  </Typography>

                  <Typography variant="h4" sx={{ color: 'text.secondary' }}>
                    ₹2000
                  </Typography>
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack direction="column" gap={2} sx={{
                  mt: { md: 6, xs: 2, sm: 2 },
                }}>
                  <FormControlLabel control={<Checkbox defaultChecked color='success' value={haveReferral} onChange={(event) => {
                    setHaveReferral(event.target.checked)
                  }} sx={
                    { '& .MuiSvgIcon-root': { fontSize: 25 } }
                  } />} label="Have a referral code?" />
                  <LoadingButton
                    color="inherit"
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={false}
                    onClick={() => {
                      if (haveReferral) {
                        dialog.onTrue();
                      } else {
                        handlePayment();
                      }
                    }}
                  >
                    {transactions?.length ? 'Renew Now' : 'Make Payment'}
                  </LoadingButton>
                </Stack>

              </Stack>
            </Box>
          </Box>

          <Box>
            <Box
              gap={0}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                p: { xs: 2, sm: 2, md: 4 },
                borderRadius: 2,
                border: (theme) => ({
                  md: `dashed 1px ${theme.palette.divider}`,
                }),
              }}
            >
              <Image style={{ width: '60%' }} src="/assets/images/subscription.png" />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* <TableSkeleton /> */}
      {transactions && (
        <Box
          sx={{
            p: { xs: 2, sm: 2, md: 4 },
            borderRadius: 2,
            bgcolor: 'background.neutral',
            mt: 3,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Payment status
          </Typography>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell align="right">Transaction ID</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions?.map((item, i) => (
                  <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      ₹{item?.amount || 100 / 100}
                    </TableCell>
                    <TableCell align="right">{item?.orderId}</TableCell>
                    <TableCell align="right">
                      <ListItemText
                        primary={format(new Date(item?.created_at), 'dd MMM yyyy')}
                        secondary={format(new Date(item?.created_at), 'p')}
                        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                        secondaryTypographyProps={{
                          mt: 0.5,
                          component: 'span',
                          typography: 'caption',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Label
                        variant="soft"
                        color={
                          (item?.status === 'approved' && 'success') ||
                          (item?.status === 'pending' && 'warning') ||
                          (item?.status === 'rejected' && 'error') ||
                          'default'
                        }
                      >
                        {item?.status}
                      </Label>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '10px',
          }}
        >
          <Stack justifyContent="center" alignItems="center">
            <Image style={{ width: '40%' }} src='/assets/images/waring.png' />
          </Stack>

          <h1 style={{ textAlign: 'center', color: 'red' }}>Request Failed</h1>
          <p style={{ textAlign: 'center' }}>
            Sorry, your request failed.
            <br />
            You can renew Your subscription only in last 30 days of your current plan.
          </p>
        </Box>
      </Modal>

      <ReferallDialog dialog={dialog} handlePayment={handlePayment} setReferallCode={setReferallCode} referallCode={referallCode} errorMsg={errorMsg} />
    </Container>
  );
};

export default MembershipView;






function TimeBlock({ label, value }) {
  return (
    <div>
      <Box sx={{ textAlign: 'center' }}> {value} </Box>
      <Box
        sx={{
          color: 'text.secondary',
          typography: 'body1',
          fontSize: { md: 17, xs: 12, sm: 12 },
          textAlign: 'center',
        }}
      >
        {label}
      </Box>
    </div>
  );
}

TimeBlock.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

