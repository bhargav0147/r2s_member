import { Helmet } from 'react-helmet-async';

import PersonProfileView from './components/PersonProfileView';


const PersonProfile = () => (
  <>
    <Helmet>
      <title> Person Details</title>
    </Helmet>
    <PersonProfileView />
  </>
);

export default PersonProfile;
