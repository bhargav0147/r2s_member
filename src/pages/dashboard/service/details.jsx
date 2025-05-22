import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import PropTypes from 'prop-types';
import { ServiceDetailsView } from 'src/sections/service/view';
// ----------------------------------------------------------------------

function ServiceDetailsPage({ isService, isMyService }) {
  const params = useParams();

  const { id } = params;


  return (
    <>
      <Helmet>
        <title> Dashboard: Order Details</title>
      </Helmet>

      <ServiceDetailsView id={`${id}`} isService={isService} isMyService={isMyService} />
    </>
  );
}

ServiceDetailsPage.propTypes = {
  isService: PropTypes.bool,
  isMyService: PropTypes.bool
}

export default ServiceDetailsPage;
