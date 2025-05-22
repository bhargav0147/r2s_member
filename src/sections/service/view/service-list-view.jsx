import { useCallback, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import MembershipView from 'src/pages/dashboard/membership/components/MembershipView';

import PropTypes from 'prop-types';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { TableHeadCustom, TableNoData, useTable } from 'src/components/table';

import { alpha, Tab, Tabs } from '@mui/material';
import ServiceTableRow from '../service-table-row';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Deal' },
  { value: 'REJECTED', label: 'Rejected' },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------

function OrderListView({ isService, isMyService }) {

  const TABLE_HEAD = [
    { id: 'serviceName', label: 'Service Name' },
    { id: 'amount', label: 'Amount' },
    { id: 'requestDate', label: 'Request Date' },
    ...(isService ? [{ id: 'buyerName', label: 'Buyer Name' }, { id: 'buyercontact', label: 'Buyer ContactNo' },] : []),
    ...(isMyService ? [{ id: 'businessName', label: 'Business Name' }] : []),
    // Uncomment the following lines if you need them
    // ...(isService || isMyService ? [{ id: 'orderId', label: 'Order ID', width: 250 }] : [{ id: 'releaseDate', label: 'Release Date', width: 250 }]),
    { id: 'status', label: 'Status', width: 110 },
    ...(isService ? [{ id: 'action', label: 'Action' }] : [])
  ];

  const table = useTable({});
  const [service, setService] = useState([]);
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('all');


  const getService = useCallback(
    async () => {
      try {
        const { data } = await axios.get(`/api/member/ecommerce/service/booking?status=${activeTab}`);
        setService(data?.data);
      } catch (error) {
        console.log(error);
      }
    }, [activeTab]
  )


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

  const handleViewRow = useCallback(
    (id) => {
      console.log("to the view row", id)
      router.push(paths.dashboard.service.details(id));
    },
    [router]
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


  const [myService, setMyService] = useState([]);

  const getMyService = useCallback(async () => {
    try {
      const { data } = await axios.get(`api/member/ecommerce/service/me?status=${activeTab}`);

      setMyService(data?.data);
    } catch (error) {
      console.log(error);
    }
  }, [activeTab]
  )
  useEffect(() => {
    if (isService) { getService(); }
    if (isMyService) { getMyService(); }
  }, [isService, isMyService, getMyService, getService]);


  // this is for the filter data
  const filterData = () => {
    if (isService) {
      return service
    }
    return myService
  };


  // this is for the heading and the navigation link
  let heading;
  let secondLink;

  if (isService) {
    heading = 'Service';
    secondLink = 'Service';
  } else if (isMyService) {
    heading = 'My Service';
    secondLink = 'My Service';
  } else {
    heading = 'Withdrawal';
    secondLink = 'Withdrawal';
  }

  return (
    <>
      <ToastContainer />
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={heading}
          links={[
            {
              name: 'Dashboard',
              href: paths.findBusiness,
            },
            {
              name: secondLink,
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
                />
              ))}
            </Tabs>

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom headLabel={TABLE_HEAD} />

                  <TableBody>
                    {filterData()?.map((row) => (
                      <ServiceTableRow
                        isService={isService}
                        isMyService={isMyService}
                        key={row.id}
                        row={{ ...row.service, status: row.status, bookingId: row.id }}
                        getService={getService}
                        // onViewRow={() => handleViewRow(row.id)}
                        buyer={row.buyer}
                        seller={row.seller}
                      />
                    ))}

                    <TableNoData notFound={!filterData()?.length} />
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

OrderListView.propTypes = {
  isService: PropTypes.bool,
  isMyService: PropTypes.bool,
};
export default OrderListView;

// ----------------------------------------------------------------------
