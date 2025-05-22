import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { Navigate, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { LoadingButton } from '@mui/lab';
import { Alert, CardHeader, InputAdornment, Modal, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Stack } from '@mui/system';

import axiosInstance from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import ConfirmModal from 'src/components/alert/ConfirmModal';
import { RHFAutocomplete } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';
import { useSettingsContext } from 'src/components/settings';
import { useTable } from 'src/components/table';
import MembershipView from 'src/pages/dashboard/membership/components/MembershipView';
import EcommerceBestSalesman from '../ecommerce-best-salesman';
import EcommerceWidgetSummary from '../ecommerce-widget-summary';
// ----------------------------------------------------------------------

export default function OverviewEcommerceView() {

  const theme = useTheme();

  const table = useTable()
  const table2 = useTable()


  let [totalCount, setTotalCount] = useState()
  let [totalCount2, setTotalCount2] = useState()

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  if (user?.is_sales_person) <Navigate to='/find-product' />

  const queryClient = useQueryClient();
  const [filterDay, setFilterDay] = useState('all')

  let [search, SetSearch] = useState('')
  let [allproduct, setAllproduct] = useState()

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/api/member/ecommerce/product?pageSize=${table.rowsPerPage}&page=${(table.page + 1)}&search=${search}`);
      setAllproduct(response.data.data);
      setTotalCount(response?.data.pagination?.totalResults);
    } catch (error) {
      console.error(error);
    }
  }, [table.rowsPerPage, table.page, search])


  let [search2, SetSearch2] = useState('')
  let [allservice, setAllservice] = useState()

  const fetchservices = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/api/member/ecommerce/service?pageSize=${table2.rowsPerPage}&page=${(table2.page + 1)}&search=${search2}`);
      setAllservice(response.data.data);
      setTotalCount2(response?.data.pagination?.totalResults);
    } catch (error) {
      console.error(error);
    }
  }, [table2.rowsPerPage, table2.page, search2])





  const settings = useSettingsContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSubmited(false)
  };


  const [errorMsg, setErrorMsg] = useState('');

  const validationSchema = Yup.object().shape({});

  const defaultValues = {
    amount: '',
  };

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [amountValue, setAmountValue] = useState('');
  const [submited, setSubmited] = useState(false);

  // code for request pyment button
  const handleSubmit1 = async () => {

    setErrorMsg('');

    try {
      if (amountValue < 500) {
        setErrorMsg('Minimus amount is 500');
        return;
      }

      // if (amountValue > Number(earningDetails?.balance)) {
      //   setErrorMsg('Insufficient Balance ');
      //   return;
      // }

      const response = await axiosInstance.post('/api/member/payout/request', {
        amount: Number(amountValue),
      });

      if (response?.data?.success) {
        toast.success('Payement requrest send successfully', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
        reset();
        setSubmited(true);
        // handleCloseModal();
      } else {
        setErrorMsg(response?.data?.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  };

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [type, setType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickOpen = (id, typeOfTable) => {
    setId(id);
    setType(typeOfTable);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setId(null);
  };

  // code for delete product or services
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      let response;
      if (type === 'product') {
        response = await axiosInstance.delete(`/api/member/ecommerce/product/${id}`);
      } else {
        response = await axiosInstance.delete(`/api/member/ecommerce/service/${id}`);
      }

      if (response?.data?.success) {
        enqueueSnackbar('Deleted successfully');
        setIsLoading(false);
        handleClose();
        if (type === 'product') {
          queryClient.invalidateQueries('products');
        } else {
          queryClient.invalidateQueries('services');
        }
      }
    } catch (error) {
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
      setIsLoading(false);
    }
  };
  const getStats = async (FilterDay) => {
    const { data } = await axiosInstance.get(`/api/member/business/ecommerce-dashboard?filter=${FilterDay}`);
    return data.data;
  };
  const { data: stats, refetch } = useQuery(['dashboard-stats', filterDay], () => getStats(filterDay), {
    staleTime: 60000,
    cacheTime: 3600000,
  });

  const handleSelect = (option) => {
    setFilterDay(option?.value);
    refetch(option);
  };

  useEffect(() => {
    refetch();
    fetchProducts()
    fetchservices()
  }, [fetchProducts, fetchservices]);


  const onSubmit = async (data) => {
    console.log("hello")
  }
  const renderFilters = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {!!errorMsg && (
        <Alert sx={{ mb: 2 }} severity="error">
          {errorMsg}
        </Alert>
      )}
      <Stack direction={{ xs: 'row' }} width='100%'>

        <RHFAutocomplete
          sx={{
            m: 1, width: {
              xs: '200px',
              sm: '140px',
              md: '200px'
            }
          }}
          name="filterDay"
          label="All"
          options={[
            { value: 'all', label: 'All' },
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'Last Week' },
            { value: 'month', label: 'Last Month' },
            { value: 'year', label: 'Last Year' },
          ]}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.label === value.label}
          renderOption={(props, option) => (
            <li {...props} key={option.label}>
              {option.label}
            </li>
          )}
          onChange={(event, value) => handleSelect(value)}
        />




      </Stack>
    </FormProvider>
  );
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {user?.is_premium ? (
        <>

          <Stack width={1} direction={
            {
              sm: 'row',
              xs: 'column'
            }
          } alignItems={
            {
              sm: 'center',
              xs: 'start'
            }
          } justifyContent={{
            sm: 'space-between',
            xs: 'center'
          }} gap={{
            sm: 0,
            xs: '10px'
          }}>

            {renderFilters}

            <Stack
              alignItems={{
                sm: "center",
                xs: 'start'
              }}
              justifyContent="end"
              direction={{
                sm: 'row',
                xs: 'column'
              }}
              gap={{
                sm: 3,
                xs: "10px"
              }}
              width={{
                sm: '100%',
                xs: '100%'
              }}
            >
              {!user.is_sales_person && <LoadingButton
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
              <LoadingButton
                color="inherit"
                type="submit"
                variant="contained"
                onClick={() => navigate('/add-product')}
                startIcon={<Iconify icon="mingcute:add-line" />}
                sx={{
                  width: {
                    sm: 'auto',
                    xs: '200px'
                  }
                }}
              >
                Add Product
              </LoadingButton>
              <LoadingButton
                color="inherit"
                type="submit"
                variant="contained"
                onClick={() => navigate('/add-service')}
                startIcon={<Iconify icon="mingcute:add-line" />}
                sx={{
                  width: {
                    sm: 'auto',
                    xs: '200px'
                  }
                }}
              >
                Add Service
              </LoadingButton>
            </Stack>

          </Stack>
          <Grid container spacing={3} mt={1}>
            <Grid xs={12} md={3}>
              <EcommerceWidgetSummary title="Product Sold" total={stats?.totalProductSales} />
            </Grid>

            <Grid xs={12} md={3}>
              <EcommerceWidgetSummary title="Withdrawn" total={stats?.ecommerceWithdraw} />
            </Grid>
            <Grid xs={12} md={3}>
              <EcommerceWidgetSummary title="Current Balance" total={stats?.totalBalance} />
            </Grid>

            <Grid xs={12} md={3}>
              <EcommerceWidgetSummary title="Total Earning" total={stats?.totalEarnings} />
            </Grid>


            <Grid xs={12}>
              <CardHeader title="All Product" sx={{ mb: 3 }} />
              <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1, mb: 5 }}>
                <TextField
                  fullWidth
                  placeholder="Search..."
                  onChange={(event) => {
                    SetSearch(event.target.value);
                    console.log(search);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              <EcommerceBestSalesman
                tableData={allproduct}
                tableLabels={[
                  { id: 'SrNo', label: 'Sr.No' },
                  { id: 'title', label: 'Title' },
                  { id: 'description', label: 'Description', align: 'left' },
                  { id: 'price', label: 'Price', align: 'right' },
                  { id: 'action', label: '', align: 'right' },
                ]}
                handleDeletefn={handleClickOpen}
                // isLoading={loading}
                isProduct
                //  table pagination value
                count={totalCount}
                page={table.page}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                onRowsPerPageChange={table.onChangeRowsPerPage}
                //
                dense={table.dense}
                onChangeDense={table.onChangeDense}
              />
            </Grid>
            <Grid xs={12}>
              <CardHeader title="All Services" sx={{ mb: 3 }} />
              <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1, mb: 5 }}>
                <TextField
                  fullWidth
                  placeholder="Search..."
                  onChange={(event) => {
                    SetSearch2(event.target.value);
                    console.log(search2);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              <EcommerceBestSalesman
                tableData={allservice}
                tableLabels={[
                  { id: 'SrNo', label: 'Sr.No' },
                  { id: 'title', label: 'Title' },
                  { id: 'description', label: 'Description', align: 'left' },
                  { id: 'price', label: 'Price', align: 'right' },
                  { id: 'action', label: '', align: 'right' },
                ]}
                handleDeletefn={handleClickOpen}
                // isLoading={serviceLoading}
                isService
                //  table pagination value
                count={totalCount2}
                page={table2.page}
                rowsPerPage={table2.rowsPerPage}
                onPageChange={table2.onChangePage}
                onRowsPerPageChange={table2.onChangeRowsPerPage}
                //
                dense={table2.dense}
                onChangeDense={table2.onChangeDense}
              />
            </Grid>
          </Grid>
          <ConfirmModal
            title="Confirm Deletion"
            description="Are you sure you want to delete this item? This action cannot be undone."
            open={open}
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
            handleConfirm={handleDelete}
            isLoading={isLoading}
          />
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
              {submited ? (
                <>
                  <Stack justifyContent="center" alignItems="center">
                    <Image style={{ width: '40%' }} src={'/assets/images/payment-success.png'} />
                  </Stack>

                  <h1 style={{ textAlign: 'center', color: 'green' }}>Request Success</h1>
                  <p style={{ textAlign: 'center' }}>
                    Withdrawal request will be processed in 3 days
                  </p>
                  <Stack direction="row" justifyContent="end" mt={2} gap={2}>
                    <Button
                      type="button"
                      variant="outoline"
                      color="secondary"
                      onClick={handleCloseModal}
                    >
                      Close
                    </Button>
                  </Stack>
                </>
              ) : (
                <form sx={{ mt: 10 }}>
                  <Typography mb={3} typography="h5">
                    Request Payment
                  </Typography>
                  {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                  <Grid container spacing={2} mt="1px" mb={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="outlined-basic"
                        label="Amount"
                        name="amount"
                        variant="outlined"
                        onChange={(e) => setAmountValue(e.target.value)}
                      />
                    </Grid>
                  </Grid>

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
                      onClick={handleSubmit1}
                      variant="contained"
                      loading={isSubmitting}
                    >
                      Send
                    </LoadingButton>
                  </Stack>
                </form>
              )}
            </Box>
          </Modal>
        </>
      ) : (
        <MembershipView />
      )}
    </Container>
  );
}
