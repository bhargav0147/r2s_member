import { Helmet } from 'react-helmet-async';

import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import FindBusinessView from './FindBusinessView';
// ----------------------------------------------------------------------

export default function FindBusiness() {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Find business | Return2Success</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <FindBusinessView />
      </Container>
    </>
  );
}
