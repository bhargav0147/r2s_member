import { Helmet } from 'react-helmet-async';

import { ProductCreateView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function ProductCreatePage({ isService }) {

  return (
    <>
      <Helmet>
        <title>{isService ? 'Add Service' : 'Add Product'} </title>
      </Helmet>

      <ProductCreateView isService={isService} />
    </>
  );
}
