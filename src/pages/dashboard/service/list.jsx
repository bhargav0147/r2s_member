import PropTypes from 'prop-types';

import { Helmet } from 'react-helmet-async';

import { ServiceListView } from 'src/sections/service/view';


// ----------------------------------------------------------------------

export default function ServiceListPage({ isService, isMyService }) {
  return (
    <>
      <Helmet>
        <title> {isService ? 'Service' : 'My Service'} | Return 2 Success</title>
      </Helmet>

      <ServiceListView isService={isService} isMyService={isMyService} />
    </>
  );
}

ServiceListPage.propTypes = {
  isService: PropTypes.bool,
  isMyService: PropTypes.bool
}
