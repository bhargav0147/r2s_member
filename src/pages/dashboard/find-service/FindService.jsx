import { Helmet } from 'react-helmet-async';

import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import FindServiceView from './FindServiceView';

// ----------------------------------------------------------------------

export default function FindService() {
  const settings = useSettingsContext();
  
  return (
    <>
      <Helmet>
        <title> Find Service | Return2Success</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <FindServiceView />
      </Container>
    </>
  );
}
