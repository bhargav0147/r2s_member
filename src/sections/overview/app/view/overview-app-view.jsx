import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillCloseCircle } from 'react-icons/ai';
import { FaCopy } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import * as Yup from 'yup';

import { LoadingButton } from '@mui/lab';
import { Alert, Button, Modal, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Stack } from '@mui/system';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import MembershipView from 'src/pages/dashboard/membership/components/MembershipView';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { useSettingsContext } from 'src/components/settings';

import { useTable } from 'src/components/table';
import EcommerceBestSalesman from '../../e-commerce/ecommerce-best-salesman';
import AppTopAuthors from '../app-top-authors';
import AppWidgetSummary from '../app-widget-summary';
import { number } from 'prop-types';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const theme = useTheme();

  const settings = useSettingsContext();


  const { user } = useAuthContext();
  console.log("user", user)

  const Table = useTable()
  const [totalDocument, setTotalDocument] = useState()

  const shareLink = () => {
    // Replace this URL with the link you want to share
    const linkToShare = `https://member.return2success.com/auth/jwt/register?ref=${user?.referal_id}`;
    const message = `Some thing`;

    // Use the Web Share API to share the link
    if (navigator.share) {
      navigator
        .share({
          title: 'Share this link',
          text: message,
          url: linkToShare,
        })
        .then(() => console.log('Link shared successfully'))
        .catch((error) => console.error('Error sharing link:', error));
    }
  };

  const [copied, setCopied] = useState(false);
  function copyLink() {
    setCopied(true);
    const link = `https://member.return2success.com/auth/jwt/register?ref=${user?.referal_id}`;
    navigator.clipboard.writeText(link);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }


  const _appAuthors = [
    { id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1', name: 'Master', avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg', totalFavorites: 9911 },
    { id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2', name: '1', avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_2.jpg', totalFavorites: 1947 },
    { id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3', name: '2', avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_3.jpg', totalFavorites: 9124 }
  ]

  const [earningDetails, setEarningDetails] = useState({});
  const [referralsData, setReferralsData] = useState([
    {
      key: 0,
      level: 'Master',
      count: 0,
    },
    {
      key: 1,
      level: 'Level 1',
      count: 0,
    },
    {
      key: 2,
      level: 'Level 2',
      count: 0,
    },
    {
      key: 3,
      level: 'Level 3',
      count: 0,
    },
    {
      key: 4,
      level: 'Level 4',
      count: 0,
    },
  ]);

  const [masterReferal, setMasterReferal] = useState([]);

  const getEarnig = useCallback(async () => {
    try {
      const { data } = await axios.get(endpoints.earning);

      setEarningDetails(data?.data?.earningData);
      setReferralsData([
        {
          key: 0,
          level: 'Master',
          count: data?.data?.masterReferralCount,
        },
        {
          key: 1,
          level: 'Level 1',
          count: data?.data?.firstLevelCount,
        },
        {
          key: 2,
          level: 'Level 2',
          count: data?.data?.secondLevelCount,
        },
        {
          key: 3,
          level: 'Level 3',
          count: data?.data?.thirdLevelCount,
        },
        {
          key: 4,
          level: 'Level 4',
          count: data?.data?.fourthLevelCount,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  }, []);




  const getMasterReferal = useCallback(async () => {
    try {
      const { data } = await axios.get(endpoints.masterReferal({ page: Table.page + 1, limit: Table.rowsPerPage }));
      setMasterReferal(data?.data);
      setTotalDocument(data?.totalDocuments);
    } catch (error) {
      console.log(error);
    }
  }, [Table.page, Table.rowsPerPage]);

  useEffect(() => {
    getEarnig();
    getMasterReferal();
  }, [getMasterReferal, getEarnig]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalReferOpen, setIsReferModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseReferModal = () => {
    setIsReferModalOpen(false);
  };

  const validationSchema = Yup.object().shape({
    amount: Yup.string().required('Amount is required'),
  });

  const defaultValues = {
    amount: '',
  };

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const [errorMsg, setErrorMsg] = useState('');

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg('');
    try {
      // Convert 'amount' to a number before comparing
      const amount = Number(data?.amount);
  
      if (isNaN(amount)) {
        setErrorMsg('Invalid amount entered');
        return;
      }
  
      if (amount < 500) {
        setErrorMsg('Minimum amount is 500');
        return;
      }
  
      if (amount > Number(earningDetails?.balance)) {
        setErrorMsg('Insufficient Balance');
        return;
      }
  
      console.log("data=============>", { ...data, amount });
  
      const response = await axios.post("api/member/payout/sales-request", { ...data, amount });
  
      if (response?.data?.success) {
        toast.success('Payment request sent successfully', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
        getEarnig();
        reset();
        handleCloseModal();
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const [level, setLevel] = useState([])

  let getcount = async () => {
    try {
      const response = await axios.get("api/member/referral/count");
      const arr = Object.values(response?.data.data);
      setLevel(arr)

    } catch (error) {
      console.log(error.massage);

    }
  }


  useEffect(() => {
    getcount()
  }, [])


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <ToastContainer />
      <CustomBreadcrumbs
        heading="Wallet"
        links={[{ name: 'Dashboard', href: paths.findBusiness }, { name: 'Wallet' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {user?.is_premium ? (
        <Grid container spacing={3}>
          <Stack
            sx={{ position: 'absolute', right: { xs: 40 }, top: 100 }}
            ml="auto"
            direction={'row'}
            alignItems="center"
            justifyContent="center" spacing={2}
          >
            {user?.is_sales_person && <LoadingButton
              color="inherit"
              type="submit"
              variant="contained"
              onClick={() => setIsModalOpen(true)}
              sx={{
                width: {
                  sm: 'auto',
                  xs: '200px'
                }
              }}
            >
              Request Payment
            </LoadingButton>}
            <Button
              color="inherit"
              type="submit"
              variant="contained"
              onClick={() => setIsReferModalOpen(true)}
            >
              Refer and earn
            </Button>
          </Stack>

          <Grid xs={12} md={4}>
            <AppWidgetSummary
              title="Current Balance"
              total={Number(earningDetails?.balance) || 0}
              chart={{
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          </Grid>


          <Grid xs={12} md={4}>
            <AppWidgetSummary
              title="Total Withdrawal"
              total={Number(earningDetails?.withdrawl) || 0}
              chart={{
                colors: [theme.palette.warning.light, theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <AppWidgetSummary
              title="Total Revenue"
              total={Number(earningDetails?.revenue) || 0}
              chart={{
                colors: [theme.palette.info.light, theme.palette.info.main],
                series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={12}>
            <AppTopAuthors title="Top Authors" list={level} />
          </Grid>
          <Grid xs={12} lg={12}>
            <EcommerceBestSalesman
              title="Master Referrals"
              tableData={masterReferal}
              tableLabels={[
                { id: 'no', label: 'Sr.No' },
                { id: 'name', label: 'Name' },
                { id: 'contact', label: 'Contact' },
                { id: 'id', label: 'Id' },
                { id: 'Amount', label: 'Amount', align: 'right' },
                { id: 'Status', label: 'Status', align: 'right' },
              ]}
              count={totalDocument}
              page={Table.page}
              rowsPerPage={Table.rowsPerPage}
              onPageChange={Table.onChangePage}
              onRowsPerPageChange={Table.onChangeRowsPerPage}
              dense={Table.dense}
              onChangeDense={Table.onChangeDense}
            />
          </Grid>

        </Grid>
      ) : (
        <MembershipView />
      )}

      <Modal open={isModalOpen} onClose={handleCloseModal} >
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
          <FormProvider sx={{ mt: 10 }} methods={methods} onSubmit={onSubmit}>
            <Typography mb={3} typography="h5">
              Request Payment
            </Typography>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            <Grid container spacing={2} mt="1px" mb={3}>
              <Grid item xs={12}>
                <RHFTextField type="number" name="amount" label="Amount" />
              </Grid>
            </Grid>

            <Stack direction="row" justifyContent="end" mt={2} gap={2}>
              <Button type="button" variant="outoline" color="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>

              <LoadingButton
                color="inherit"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Send
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Box>
      </Modal>

      <Modal open={isModalReferOpen} onClose={handleCloseReferModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {
              xs: "80%",
              sm: 500,
              lg: 700,
            }, // Set the desired width
            height: {
              xs: 'auto',
              sm: 400,
              lg: 300
            }, // Set the desired height
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '10px',
          }}
        >
          <FormProvider sx={{ mt: 7 }} methods={methods} onSubmit={onSubmit}>
            <Typography
              mb={3}
              typography="h5"
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <span>🌟 Refer and Earn Exciting Rewards! 🎉💸</span>
              <IconButton
                sx={{ fontSize: '24px' }}
                size="small"
                aria-label="delete"
                onClick={handleCloseReferModal}
              >
                <AiFillCloseCircle />
              </IconButton>
            </Typography>

            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            <Grid container spacing={2} mb={2}>
              <ol style={{ color: '#637381', fontSize: '0.93rem' }}>
                <li style={{ marginBottom: 10 }}>
                  <strong>Master Referral Earnings:</strong> For each new user directly referred
                  through your referral link, known as a 'Master Referral', you will earn INR 500.
                </li>
              </ol>
              <Stack
                flexWrap="wrap"
                direction={
                  {
                    xs: 'column',
                    sm: 'row'
                  }
                }
                justifyContent="space-between"
                sx={{ mt: 1 }}
                width={{
                  xs: '100%',
                  sm: '100%'
                }}
              >
                <Alert
                  severity={copied ? 'success' : 'info'}
                  style={{
                    display: 'flex', alignItems: 'center', flexWrap: 'wrap',
                  }}
                  sx={
                    {
                      width: {
                        xs: '100%',
                        sm: 'auto'
                      }
                    }
                  }
                >
                  {`https://member.return2success.com/auth/jwt/register?ref=${user?.referal_id}`}
                  <IconButton size="small" aria-label="delete">
                    <FaCopy onClick={copyLink} />
                  </IconButton>
                </Alert>

                <LoadingButton
                  sx={{
                    m: 1, mr: 0, width: {
                      xs: '200px',
                      sm: 'auto'
                    }
                  }}
                  variant="contained"
                  loading={false}
                  onClick={shareLink}

                >
                  Refer Link
                </LoadingButton>
              </Stack>
            </Grid>
          </FormProvider>
        </Box>
      </Modal>
    </Container>
  );
}
