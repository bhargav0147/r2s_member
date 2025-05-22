import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Unstable_Grid2';


import axiosInstance from 'src/utils/axios';


import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';

import { useCheckoutContext } from '../../checkout/context';
import CartIcon from '../common/cart-icon';
import ProductDetailsCarousel from '../product-details-carousel';
import ProductDetailsDescription from '../product-details-description';
import ProductDetailsReview from '../product-details-review';
import ProductDetailsSummary from '../product-details-summary';
import { ProductDetailsSkeleton } from '../product-skeleton';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function ProductShopDetailsView({ id, isService, isProduct }) {
  const settings = useSettingsContext();

  const checkout = useCheckoutContext();

  const [currentTab, setCurrentTab] = useState('description');

  // const { product } = useGetProduct(id, isProduct);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const [info, setInfo] = useState();
  const [loading, setLoading] = useState(true);

  const [productReview, setProductReview] = useState([])
  const [avgrating, setAvgRating] = useState(0)

  const getDetails = async () => {
    try {
      setLoading(true);
      if (isProduct) {
        const { data } = await axiosInstance.get(`/api/member/ecommerce/product/${id}`);
        setInfo(data?.data);
      } else {
        const { data } = await axiosInstance.get(`/api/member/ecommerce/service/${id}`);
        setInfo(data?.data);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getProductReview = async () => {
    try {

      if (isProduct) {
        const { data } = await axiosInstance.get(`/api/member/feedback/business?type=product&id=${id}`)
        setProductReview(data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getAvgRating = async () => {
    try {

      if (isProduct) {
        const { data } = await axiosInstance.get(`/api/member/feedback/business/avg/${id}`)
        setAvgRating(data.averageRating)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDetails();
    getProductReview();
    getAvgRating();
  }, []);




  const renderSkeleton = <ProductDetailsSkeleton />;

  const renderProduct = info && (
    <>
      <CustomBreadcrumbs
        links={[
          {
            name: isService ? 'Find Service' : 'Find Product',
            href: isService ? '/find-service' : '/find-product',
          },
          { name: info?.title },
        ]}
        sx={{ mb: 5 }}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel product={info} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <ProductDetailsSummary
            isService={isService}
            product={info}
            items={checkout?.items}
            onAddCart={checkout?.onAddToCart}
            onGotoStep={checkout?.onGotoStep}
            isProduct={isProduct}
            avgrating={avgrating}
            totalReviews={productReview?.length || 0}
          />
        </Grid>
      </Grid>


      <Card sx={{ mt: 10 }}>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {[
            {
              value: 'description',
              label: 'Description',
            },
            ...(isProduct ? [{
              value: 'reviews',
              label: `Reviews (${productReview?.length || 0})`,
            },] : [])
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === 'description' && (
          <ProductDetailsDescription description={info?.description} />
        )}

        {currentTab === 'reviews' && (
          <ProductDetailsReview
            ratings={productReview?.ratings}
            reviews={productReview}
            totalRatings={productReview?.totalRatings}
            totalReviews={productReview?.length || 0}
          />
        )}
      </Card>
    </>
  );

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        mt: 5,
        mb: 15,
      }}
    >
      {!isService && <CartIcon totalItems={checkout.totalItems} />}

      {loading && renderSkeleton}

      {info && renderProduct}
    </Container>
  );
}

ProductShopDetailsView.propTypes = {
  id: PropTypes.string,
};
