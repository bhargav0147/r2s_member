import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import axiosInstance from 'src/utils/axios';

import { _orders } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hooks';
import OrderDetailsInfo from '../order-details-info';
import OrderDetailsItems from '../order-details-item';
import OrderDetailsToolbar from '../order-details-toolbar';

// ----------------------------------------------------------------------

export const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  // { value: 'PROCESSING', label: 'Processing' },
  // { value: 'APPROVED', label: 'Approved' },
  // { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  // { value: 'RETURNED', label: 'Returned' },
  // { value: 'REFUNDED', label: 'Refunded' },
  // { value: 'ON_HOLD', label: 'On hold' },
];

export default function OrderDetailsView({ id, isOrder, isMyOrder }) {
  const settings = useSettingsContext();

  const currentOrder = _orders.filter((order) => order.id === id)[0];
  const [status, setStatus] = useState('PENDING');
  const [deliveryOtp, setDeliveryOtp] = useState();
  const router = useRouter()




  const handleChangeStatus = useCallback((newValue) => {
    setStatus(newValue);
    if (newValue !== 'DELIVERED') {
      setDeliveryOtp()
    }
  }, []);

  const [order, setOrder] = useState();

  const getSingleOrder = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/member/ecommerce/order/single/${id}`
      );
      setOrder(data?.data);
      setStatus(data?.data?.orderStatus)
    } catch (error) {
      console.log(error);
    }
  }, [id])

  const updateStatus = async () => {
    try {
      const response = await axiosInstance.put(
        `/api/member/ecommerce/order/status/${id}`,
        {
          status,
          ...(deliveryOtp && { deliveryOtp }),
        }
      )
      if (response.status === 200) {
        enqueueSnackbar("Status Updated Successfully!!", { variant: 'success' })
        router.back()
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' })
      router.back()
    }
  }


  useEffect(() => {
    getSingleOrder();
  }, [getSingleOrder]);

  useEffect(() => {
    console.log(deliveryOtp, "this is delivery otp")
  }, [deliveryOtp])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <OrderDetailsToolbar
        backLink={`${isOrder ? "/order-history" : "/my-order"}`}
        orderNumber={order?.orderId}
        createdAt={order?.orderDate}
        status={status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
        isMyOrder={isMyOrder}
        isOrder={isOrder}
        setDeliveryOtp={setDeliveryOtp}
        updateStatus={updateStatus}
        deliveryOtp={deliveryOtp}
        orderId={id}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              items={order?.products}
              taxes={currentOrder?.taxes}
              discount={currentOrder?.discount}
              subTotal={order?.subAmount}
              totalAmount={order?.amount}
              isMyOrder={isMyOrder}
              orderStatus={order?.orderStatus}
              shipping={order?.shippingFee}
            />

            {/* <OrderDetailsHistory history={currentOrder?.history} /> */}
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo
            customer={order?.buyer}
            delivery={currentOrder?.delivery}
            payment={order}
            shippingAddress={order?.address}
            isOrder={isOrder}
            isMyOrder={isMyOrder}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

OrderDetailsView.propTypes = {
  id: PropTypes.string,
  isOrder: PropTypes.bool,
  isMyOrder: PropTypes.bool
};
