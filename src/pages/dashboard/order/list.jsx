import { Helmet } from 'react-helmet-async';

import { OrderListView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function OrderListPage({isOrder, isMyOrder}) {
  return (
    <>
      <Helmet>
        <title> {isOrder? 'Order': isMyOrder ? 'My Order': 'Withdrawal'} | Return 2 Success</title>
      </Helmet>

      <OrderListView isOrder={isOrder} isMyOrder={isMyOrder} />
    </>
  );
}
