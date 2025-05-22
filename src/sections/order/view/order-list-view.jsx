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

import PropTypes from 'prop-types';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { TableHeadCustom, TableNoData, useTable } from 'src/components/table';

import OrderTableRow from '../order-table-row';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];


const defaultFilters = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------

function OrderListView({ isOrder, isMyOrder }) {

  const TABLE_HEAD = [
    { id: 'amount', label: 'Amount', width: 116 },
    { id: 'requestDate', label: 'Request Date', width: 140 },
    {
      id: isOrder || isMyOrder ? 'orderId' : 'releaseDate',
      label: isOrder || isMyOrder ? 'Order ID' : 'Release Date',
      width: 250,
    },
    { id: 'status', label: 'Status', width: 110 },
  ];

  const table = useTable({});
  const [order, setOrder] = useState([]);
  const { user } = useAuthContext();

  const getOrder = async () => {
    try {
      const { data } = await axios.get('/api/member/ecommerce/order/my');

      setOrder(data?.data?.orders);
    } catch (error) {
      console.log(error);
    }
  };


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
      console.log(id)
      router.push(paths.dashboard.order.details(id));
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
      console.log(historyData)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPayoutHistory();
  }, []);

  const [activeTab, setActiveTab] = useState('all');

  const [myOrder, setMyOrder] = useState([]);

  const getMyOrder = async () => {
    try {
      const { data } = await axios.get('/api/member/ecommerce/order');

      setMyOrder(data?.data?.orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isOrder) { getOrder(); }
    if (isMyOrder) { getMyOrder(); }
  }, [isOrder, isMyOrder]);


  // this is for the filter data
  const filterData = (active) => {

    if (active === 'all') {
      if (isOrder) return order;
      if (isMyOrder) return myOrder;
      return historyData;
    }


    let filteredData;

    if (isOrder) {
      filteredData = order.filter((item) => item.orderStatus === active);
    } else if (isMyOrder) {
      filteredData = myOrder.filter((item) => item.orderStatus === active);
    } else {
      filteredData = historyData.filter((item) => item.status === active);
    }

    return filteredData;
  };


  // this is for the heading and the navigation link
  let heading;
  let secondLink;

  if (isOrder) {
    heading = 'Order';
    secondLink = 'Order';
  } else if (isMyOrder) {
    heading = 'My Order';
    secondLink = 'My Order';
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
                      <OrderTableRow

                        isOrder={isOrder}
                        isMyOrder={isMyOrder}
                        key={row.id}
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
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

OrderListView.propTypes = {
  isOrder: PropTypes.bool,
  isMyOrder: PropTypes.bool,
};
export default OrderListView;

// ----------------------------------------------------------------------
