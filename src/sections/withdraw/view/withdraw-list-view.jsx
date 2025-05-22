import { useCallback, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import MembershipView from 'src/pages/dashboard/membership/components/MembershipView';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { TableHeadCustom, TableNoData, useTable } from 'src/components/table';

import WithdrawTableRow from '../withdraw-table-row';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Cancelled' },
];


const defaultFilters = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------

function WithdrawListView() {

  const TABLE_HEAD = [
    { id: 'amount', label: 'Amount', width: 116 },
    { id: 'requestDate', label: 'Request Date', width: 140 },
    {
      id: 'releaseDate',
      label: 'Release Date',
      width: 250,
    },
    {
      id: 'transactionId',
      label: 'Transaction ID',
      width: 250,
    },
    { id: 'status', label: 'Status', width: 110 },
  ];

  const table = useTable({});

  const { user } = useAuthContext();




  const settings = useSettingsContext();

  const router = useRouter();

  const [filters, setFilters] = useState(defaultFilters);

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

  const [historyData, setHistoryData] = useState([]);
  const [allDataPage, setAllDataPage] = useState(0);


  // this is for a payout

  const getPayoutHistory = async () => {
    try {
      const { data } = await axios.get(endpoints.payout.history);
      setAllDataPage(data?.data?.totalPages);
      setHistoryData(data?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPayoutHistory();
  }, []);

  const [activeTab, setActiveTab] = useState('all');




  // this is for the filter data
  const filterData = (active) => {

    if (active === 'all') {

      return historyData;
    }

    const filteredData = historyData.filter((item) => item.status === active);

    return filteredData;
  };



  return (
    <>
      <ToastContainer />
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Withdrawal'
          links={[
            {
              name: 'Dashboard',
              href: paths.findBusiness,
            },
            {
              name: 'Withdrawal',
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        {user?.is_premium ? (
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
                // icon={
                //   <Label
                //     variant={
                //       ((tab.value === 'all' || tab.value === filters.status) && 'filled') ||
                //       'soft'
                //     }
                //     color={
                //       (tab.value === 'approved' && 'success') ||
                //       (tab.value === 'PENDING' && 'warning') ||
                //       (tab.value === 'rejected' && 'error') ||
                //       'default'
                //     }
                //   >
                //     {tab.value === 'all' && isOrder
                //       ? order?.length
                //       : isMyOrder
                //       ? myOrder?.length
                //       : historyData?.length}

                //     {tab.value === 'PENDING' &&
                //       order.filter((data) => data.orderStatus === 'PENDING').length}
                //     {tab.value === 'approved' &&
                //       historyData.filter((data) => data.status === 'approved').length}
                //     {tab.value === 'rejected' &&
                //       historyData.filter((data) => data.status === 'rejected').length}
                //   </Label>
                // }
                />
              ))}
            </Tabs>

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom headLabel={TABLE_HEAD} />

                  <TableBody>
                    {filterData(activeTab)?.map((row) => (
                      <WithdrawTableRow
                        key={row.id}
                        row={row}
                      />
                    ))}

                    <TableNoData notFound={!filterData(activeTab)?.length} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            {/* {allDataPage ? (
            <Stack sx={{ m: 3 }} direction={'row'} justifyContent="end">
              <Pagination count={100} />
            </Stack>
          ) : null} */}

          </Card>
        ) : (
          <MembershipView />
        )}
      </Container>
    </>
  );

}

export default WithdrawListView;

// ----------------------------------------------------------------------
