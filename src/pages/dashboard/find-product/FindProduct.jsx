import { Helmet } from 'react-helmet-async';

import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import FindProductView from './FindProductView';

// ----------------------------------------------------------------------

export default function FindProduct() {
  const settings = useSettingsContext();
  
  return (
    <>
      <Helmet>
        <title> Find Product | Return2Success</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <FindProductView />
      </Container>
    </>
  );
}
