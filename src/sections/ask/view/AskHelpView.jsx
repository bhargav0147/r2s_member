import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Alert, Button, Modal, Pagination, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Box, Stack } from '@mui/system';
import { useSnackbar } from 'notistack';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/hooks';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { useSettingsContext } from 'src/components/settings';
import { TableHeadCustom, TableNoData, useTable } from 'src/components/table';
import { AppContext } from 'src/store/AppProvider';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';
import MembershipView from '../../../pages/dashboard/membership/components/MembershipView';
import UserCardList from '../user-card-list';

const TABLE_HEAD = [
  { id: 'title', label: 'Title' },

  {
    id: 'craetedAt',
    label: 'Date',
    width: 250,
  },
  { id: 'description', label: 'Description' },
  { id: 'status', label: 'Status', width: 110 },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'solve', label: 'Solved' },
  { value: 'cancel', label: 'Cancelled' },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

const AskHelpView = ({ isself }) => {

  console.log("inside ask help view", isself)
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const table = useTable({});
  const { enqueueSnackbar } = useSnackbar();
  const [getAsk, setGetAsk] = useState([]);
  const [count, SetCount] = useState()
  const [page,setPage] = useState(1)

  const getAllAskpubilc = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/member/ask/privateask?page=${page}&perPage=6`);
      if (isself === true) {
        setGetAsk(data?.data?.asks);
        // console.log("count==>", data?.data?.pagination?.totalPages);
        SetCount(data?.data?.pagination?.totalPages)
      }

    } catch (error) {
      console.log(error);
    }
  };
  const getAllAsk = async () => {
    try {
      const { data } = await axiosInstance.get('/api/member/ask/publicask');
      if (isself === false) setGetAsk(data?.data?.asks);

    } catch (error) {
      console.log(error);
    }
  };


  const handlePrivatePage = (value)=>{
    console.log(value);
    setPage(value)
  }


  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState(defaultFilters);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const { supportTitle } = useContext(AppContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Message is required'),
  });

  const defaultValues = {
    title: '',
    description: '',
  };

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (input) => {
    try {
      setErrorMsg('');
      const { data } = await axiosInstance.post('/api/member/ask/add', {
        title: input?.title,
        description: input?.description,
      });
      reset();
      handleCloseModal();
      getAllAskpubilc();
      getAllAsk();
      enqueueSnackbar('Successfully your request add!', { variant: 'success' });
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
    }
  });

  useEffect(() => {
    getAllAsk();
    getAllAskpubilc()
  }, []);
  useEffect(() => {
    getAllAskpubilc()
  }, [page]);

  return (
    <>
      <Helmet>
        <title> Support</title>
      </Helmet>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading= {isself ? "My Ask" : "Ask"}
          links={[{ name: 'Dashboard', href: '/' }, { name: isself ? "My Ask" : "Ask" }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        {user?.is_premium ? (
          <>
            <Stack
              sx={{ position: 'absolute', right: { xs: 12, md: 40 }, top: 80 }}
              ml="auto"
              alignItems="center"
              justifyContent="center"
              direction="row"
              gap={3}
            >
              {isself === true && <LoadingButton
                color="inherit"
                type="submit"
                variant="contained"
                onClick={() => setIsModalOpen(true)}
              >
                Request
              </LoadingButton>}
            </Stack>

      
            <UserCardList allask={getAsk} isself={isself} />
            {isself && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
             <Pagination count={count}
                page={page}
                onChange={(event, value)=>handlePrivatePage(value)}
                size="large" />
            </Box>}


            <Modal open={isModalOpen} onClose={handleCloseModal}>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: {xs:300,sm:400,md:600},
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  p: 4,
                  borderRadius: '10px',
                }}
              >
                <FormProvider methods={methods} onSubmit={onSubmit}>
                  <Typography mb={3} typography="h5">
                    Request Ask
                  </Typography>
                  {!!errorMsg && (
                    <Alert sx={{ mb: 2 }} severity="error">
                      {errorMsg}
                    </Alert>
                  )}

                  <RHFTextField
                    sx={{ mt: 0 }}
                    rows={4}
                    name="title"
                    label="Enter Title"
                  />


                  <RHFTextField
                    multiline
                    sx={{ mt: 3 }}
                    rows={4}
                    name="description"
                    label="Description"
                  />


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
                      variant="contained"
                      loading={isSubmitting}
                      type="submit"
                    >
                      Send
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
    </>
  );
};

export default AskHelpView;
