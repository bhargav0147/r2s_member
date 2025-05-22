import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import * as Yup from 'yup';

import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Avatar,
  Button,
  Divider,
  Grid,
  ListItemText,
  Modal,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { Box, Container, Stack } from '@mui/system';

import { paths } from 'src/routes/paths';

import axiosInstance from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';

import { useQuery } from 'react-query';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { RHFUpload } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';
import MembershipView from '../../membership/components/MembershipView';

const PromotionView = () => {
  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const settings = useSettingsContext();

  const [promotions, setPromotions] = useState([]);
  const getPromotions = async () => {
    try {
      const { data } = await axiosInstance.get('/api/member/promotion');
      setPromotions(data?.data?.promotionData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPromotions();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const validationSchema = Yup.object().shape({
    // amount: Yup.string().required('Amount is required'),
    poster: Yup.string().required('Poster is required'),
    // transctionId: Yup.string().required('Transction Id is required'),
  });

  const defaultValues = {
    amount: '',
    transction_id: '',
  };

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [image, setImage] = useState(null);

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg('');
    try {
      const form = new FormData();
      form.append('file', image);
      form.append('upload_preset', 'bymtctem');
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dfznwn1fr/image/upload',
        form
      );

      const response2 = await axiosInstance.post('/api/member/promotion/request', {
        poster: response?.data?.url,
        poster_key: response?.data?.public_id,
      });

      if (response2?.data?.success) {
        enqueueSnackbar('Request send successfully');
        setImage(null);
        reset();
        refetch()
        handleCloseModal();
      }
      if (response2.status === 203) {
        enqueueSnackbar(response2.data.Message, {
          variant: 'warning'
        })
        setImage(null);
        reset();
        handleCloseModal();
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.Message);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('poster', newFile, { shouldValidate: true });
        setImage(newFile);
      }
    },
    [setValue]
  );

  const getPromotionDetails = async () => {
    const { data } = await axiosInstance.get('/api/member/promotion/promotionAmount');
    return data?.data[0]?.promotionAmount || 0;
  };

  const {
    data: amount,
    isLoading: amountLoading,
    error,
    refetch,
  } = useQuery('promotionDetails', getPromotionDetails, {
    staleTime: 60000,
    cacheTime: 3600000,
  });

  return (
    <Container
      sx={{
        minHeight: 1,
      }}
      maxWidth={settings.themeStretch ? false : 'xl'}
    >
      <CustomBreadcrumbs
        heading="Promotion"
        links={[{ name: 'Dashboard', href: paths.findBusiness }, { name: 'Promotion' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ToastContainer />
      {user?.is_premium ? (
        <>
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
                    Promotion Plan
                  </Typography>

                  <Stack spacing={2.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Fees
                      </Typography>

                      <Typography variant="h4" sx={{ color: 'text.secondary' }}>
                        {amountLoading ? (
                          <Skeleton variant="circular" width={40} height={40} />
                        ) : (
                          `₹${amount}`
                        )}
                      </Typography>
                    </Stack>

                    <Divider sx={{ borderStyle: 'dashed' }} />
                    <LoadingButton
                      color="inherit"
                      size="large"
                      type="submit"
                      variant="contained"
                      loading={false}
                      sx={{
                        mt: { md: 6, xs: 2, sm: 2 },
                      }}
                      onClick={() => setIsModalOpen(true)}
                    >
                      Request Promotion
                    </LoadingButton>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Box>

          {promotions?.length ? (
            <Box
              sx={{
                p: { xs: 2, sm: 2, md: 4 },
                borderRadius: 2,
                bgcolor: 'background.neutral',
                mt: 3,
              }}
            >
              <Typography variant="h5" gutterBottom>
                Promotion request
              </Typography>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Poster</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell align="right">Date</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {promotions?.map((item, i) => (
                      <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="center">
                          <Avatar
                            variant="rounded"
                            alt=""
                            src={item.poster}
                            sx={{ mr: 2, width: 48, height: 48 }}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {item?.amount == 0 ? (
                            <Label variant="soft" color={'success'}>
                              Free
                            </Label>
                          ) : (
                            `₹${item?.amount}`
                          )}
                        </TableCell>
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
          ) : null}

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
              <FormProvider sx={{ mt: 10 }} methods={methods} onSubmit={onSubmit}>
                <Typography typography="h5">Promotion Request</Typography>
                <Alert severity="error">Recommended  dimensions for Image: <span style={{
                  fontWeight: 'bold',
                  color: 'black'
                }}>1100px x 340px</span></Alert>
                {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                <Grid container spacing={2} mt="1px">
                  <Grid item xs={12}>
                    <RHFUpload thumbnail name="poster" maxSize={3145728} onDrop={handleDrop} />

                  </Grid>
                </Grid>
                {/* <Grid container spacing={2} mt="1px">
                  <Grid item xs={12}>
                    <RHFTextField type="number" name="amount" label="Amount" />
                  </Grid>
                </Grid>
                <Grid container spacing={2} mt="1px" mb={3}>
                  <Grid item xs={12}>
                    <RHFTextField name="transctionId" label="Transction Id" />
                  </Grid>
                </Grid> */}

                <Stack direction="row" justifyContent="end" mt={2} gap={2}>
                  <Button
                    type="button"
                    variant="outoline"
                    color="secondary"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>

                  <LoadingButton
                    color="inherit"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Submit
                  </LoadingButton>
                </Stack>
              </FormProvider>
            </Box>
          </Modal>
        </>
      ) : (
        <MembershipView />
      )}
    </Container>
  );
};

export default PromotionView;

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
