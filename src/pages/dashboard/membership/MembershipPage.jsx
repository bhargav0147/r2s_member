import { Helmet } from 'react-helmet-async';

import MembershipView from './components/MembershipView';

const MembershipPage = () => (
    <>
    <Helmet>
      <title>Member | Return 2 Success</title>
    </Helmet>

    <MembershipView isMembership />
  </>
  )

export default MembershipPage
