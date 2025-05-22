import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import axiosInstance from 'src/utils/axios';

import { _orders } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import ServiceDetailsInfo from '../service-details-info';
import ServiceDetailsItems from '../service-details-item';
import ServiceDetailsToolbar from '../service-details-toolbar';

// ----------------------------------------------------------------------

export const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'RETURNED', label: 'Returned' },
  { value: 'REFUNDED', label: 'Refunded' },
  { value: 'ON_HOLD', label: 'On hold' },
];

export default function OrderDetailsView({ id, isService, isMyService }) {
  const settings = useSettingsContext();

  const currentOrder = _orders.filter((order) => order.id === id)[0];

  const handleChangeStatus = useCallback((newValue) => {
    setStatus(newValue);
  }, []);

  const [order, setOrder] = useState();

  const getSingleService = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/member/ecommerce/order/single/${id}`
      );
      setOrder(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleService();
  }, []);

  const [status, setStatus] = useState('PENDING');
  return (

    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <ServiceDetailsToolbar
        backLink={`${isService ? "/service-history" : "/my-service"}`}
        orderNumber={order?.orderId}
        createdAt={order?.orderDate}
        status={status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
        isMyService={isMyService}
        isService={isService}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <ServiceDetailsItems
              items={order?.products}
              taxes={currentOrder?.taxes}
              shipping={currentOrder?.shipping}
              discount={currentOrder?.discount}
              subTotal={order?.amount / 100}
              totalAmount={(order?.amount) / 100}
            />

            {/* <OrderDetailsHistory history={currentOrder?.history} /> */}
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <ServiceDetailsInfo
            customer={order?.buyer}
            delivery={currentOrder?.delivery}
            payment={order}
            shippingAddress={order?.address}
            isService={isService}
            isMyService={isMyService}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

OrderDetailsView.propTypes = {
  id: PropTypes.string,
  isService: PropTypes.bool,
  isMyService: PropTypes.bool
};
