import { Helmet } from 'react-helmet-async';

import ReferalView from './components/ReferalView';

// ----------------------------------------------------------------------

export default function Referal() {
  return (
    <>
      <Helmet>
        <title> Referral | Return 2 Success</title>
      </Helmet>
      <ReferalView />
    </>
  );
}
