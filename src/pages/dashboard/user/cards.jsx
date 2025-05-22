import { Helmet } from 'react-helmet-async';

// import { UserCardsView } from 'src/sections/user/view';
import { ProductListView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function UserCardsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User Cards</title>
      </Helmet>

      <ProductListView />
    </>
  );
}
