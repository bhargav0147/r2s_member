import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Alert, Button, Modal, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
import { Box, Stack } from '@mui/system';
import { useSnackbar } from 'notistack';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/hooks';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { TableHeadCustom, TableNoData, useTable } from 'src/components/table';
import { AppContext } from 'src/store/AppProvider';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';
import SupportTableRow from './support-table-row';

const TABLE_HEAD = [
  {
    id: 'craetedAt',
    label: 'Date',
    width: 250,
  },
  { id: 'title', label: 'Title' },


  { id: 'description', label: 'Description' },
  { id: 'status', label: 'Status', width: 110 },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SOLVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

const SupportPage = () => {
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const table = useTable({});
  const { enqueueSnackbar } = useSnackbar();

  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState(defaultFilters);
  const [errorMsg, setErrorMsg] = useState('');
  const [supports, setSupports] = useState([]);

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

  const getSupport = async () => {
    try {
      const { data } = await axiosInstance.get('/api/member/support');
      setSupports(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const validationSchema = Yup.object().shape({
    title: Yup.object().required('Title is required'),
    description: Yup.string().required('Message is required'),
  });

  const defaultValues = {
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
      const { data } = await axiosInstance.post('/api/member/support/', {
        title: input?.title?.title,
        description: input?.description,
      });
      reset();
      enqueueSnackbar(data?.message);
      handleCloseModal();
      getSupport()
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
    }
  });

  useEffect(() => {
    getSupport();
  }, []);

  const ApplyFilter = () => {
    if (activeTab === 'all') {
      return supports;
    }
    return supports.filter(support => support.supportStatus === activeTab);
  }

  return (
    <>
      <Helmet>
        <title> Support</title>
      </Helmet>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Support"
          links={[{ name: 'Dashboard', href: '/' }, { name: 'Support' }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />


        <Stack
          sx={{ position: 'absolute', right: { xs: 12, md: 40 }, top: 80 }}
          ml="auto"
          alignItems="center"
          justifyContent="center"
          direction="row"
          gap={3}
        >
          <LoadingButton
            color="inherit"
            type="submit"
            variant="contained"
            onClick={() => setIsModalOpen(true)}
          >
            Request
          </LoadingButton>
        </Stack>

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                onClick={() => setActiveTab(tab.value)}
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
              />
            ))}
          </Tabs>

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} />

                <TableBody>
                  {ApplyFilter()?.map((row) => (
                    <SupportTableRow
                      key={row.id}
                      row={row}
                    />
                  ))}

                  <TableNoData notFound={!ApplyFilter().length} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Card>

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
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <Typography mb={3} typography="h5">
                Request Support
              </Typography>
              {!!errorMsg && (
                <Alert sx={{ mb: 2 }} severity="error">
                  {errorMsg}
                </Alert>
              )}

              <RHFAutocomplete
                sx={{ width: '100%' }}
                name="title"
                label="Title"
                options={supportTitle}
                getOptionLabel={(option) => option?.title}
                isOptionEqualToValue={(option, value) => option?.title === value.title}
                renderOption={(props, option) => (
                  <li {...props} key={option.title}>
                    {option.title}
                  </li>
                )}
              />

              <RHFTextField
                multiline
                sx={{ mt: 1 }}
                rows={4}
                name="description"
                label="Message"
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


      </Container>
    </>
  );
};

export default SupportPage;
