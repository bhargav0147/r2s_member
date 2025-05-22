import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import PropTypes from 'prop-types';
import { OrderDetailsView } from 'src/sections/order/view';
// ----------------------------------------------------------------------

function OrderDetailsPage({ isOrder, isMyOrder }) {
  const params = useParams();

  const { id } = params;


  return (
    <>
      <Helmet>
        <title> Dashboard: Order Details</title>
      </Helmet>

      <OrderDetailsView id={`${id}`} isOrder={isOrder} isMyOrder={isMyOrder} />
    </>
  );
}

OrderDetailsPage.propTypes = {
  isOrder: PropTypes.bool,
  isMyOrder: PropTypes.bool
}

export default OrderDetailsPage;
