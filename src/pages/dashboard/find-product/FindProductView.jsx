import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { Container, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { AppContext } from 'src/store/AppProvider';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import EmptyContent from 'src/components/empty-content/empty-content';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { useSettingsContext } from 'src/components/settings';

import { useCheckoutContext } from 'src/sections/checkout/context';
import EcommerceNewProducts from 'src/sections/overview/e-commerce/ecommerce-new-products';
import CartIcon from 'src/sections/product/common/cart-icon';
import ProductList from 'src/sections/product/product-list';

import MembershipView from '../membership/components/MembershipView';
import { Cities, States } from './state-city';

const FindProductView = () => {
  const settings = useSettingsContext();

  const { promotions } = useContext(AppContext);
  const checkout = useCheckoutContext();

  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const [stateKey, setStateKey] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [search,setSearch] = useState()

  const LoginSchema = Yup.object().shape({
  });

  const defaultValues = {
    pincode_or_area: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    formState: { isSubmitting },
  } = methods;

  const handleSearch = async (el) => {
    setSearch(el)
    
  };



  const handleSelect = (option) => {

    setStateKey(option?.name);
    setSelectedState(option?.name ?? "")
    methods.setValue('state', option, { shouldValidate: true });
  };

  const handlecity = (option) => {
    setSelectedCity(option?.value ?? "")
  }

  const renderFilters = (
    <FormProvider methods={methods} >

      <Stack justifyContent="space-between" direction={{ xs: 'column', sm: 'row' }} alignItems='center'>
        <RHFTextField sx={{ m: 1 }} name="query" label="Search" onChange={(event) => {
          handleSearch(event.target.value)
        }} />
        
        <RHFAutocomplete
          sx={{ m: 1, width: '100%' }}
          name="state"
          label="State"
          options={States}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.label === value.label}
          renderOption={(props, option) => (
            <li {...props} key={option.label}>
              {option.label}
            </li>
          )}
          onChange={(event, value) => handleSelect(value)}
        />

        <RHFAutocomplete
          sx={{ m: 1, width: '100%' }}
          name="city"
          label="City"
          options={Cities[stateKey] || []}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.label === value.value}
          renderOption={(props, option) => (
            <li {...props} key={option.label}>
              {option.label}
            </li>
          )}
          onChange={(event, value) => handlecity(value)}
        />

      </Stack>
    </FormProvider>
  );

  const renderNotFound = <EmptyContent filled title="No Data" sx={{ py: 10 }} />;

  const [topRated, setTopRated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getTopRateProduct = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, status } = await axios.get(endpoints.product.topRated({ state: selectedState, city: selectedCity, pincode: '', search :search }));
      if (status === 200) {
        setTopRated(data?.data?.result)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  }, [selectedState, selectedCity ,search]);

  const notFound =
    topRated && !topRated?.length;

  const getCart = async () => {
    try {
      const { data } = await axios.get('/api/member/ecommerce/cart/');
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    getTopRateProduct()
  }, [getTopRateProduct])



  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        mb: 15,
      }}
    >
      <CartIcon totalItems={checkout.totalItems} />
      <CustomBreadcrumbs
        heading="Find Product"
        links={[{ name: 'Dashboard', href: paths.findBusiness }, { name: 'Find Product' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {user?.is_premium ? (
        <>
          <EcommerceNewProducts list={promotions} />
          <Stack
            spacing={2.5}
            sx={{
              mb: { xs: 3, md: 5 },
              mt: { xs: 3, md: 5 },
            }}
          >
            {renderFilters}
          </Stack>
          {!isLoading && !loading && notFound && renderNotFound}
          <ProductList
            isProduct
            products={topRated || []}
            loading={loading || isLoading || false}
          />
        </>
      ) : (
        <MembershipView />
      )}
    </Container>
  );
};

export default FindProductView;
