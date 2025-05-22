import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import { ProductShopView } from 'src/sections/product/view';

export default function UserCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      
      <ProductShopView />
    </Container>
  );
}
