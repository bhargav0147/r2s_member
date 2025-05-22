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

import EcommerceNewProducts from 'src/sections/overview/e-commerce/ecommerce-new-products';
import ProductList from 'src/sections/product/product-list';

import MembershipView from '../membership/components/MembershipView';
import { Cities, States } from './state-city';

const FindServiceView = () => {
  const settings = useSettingsContext();

  const { user } = useAuthContext();
  const { promotions } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [topRated, setTopRated] = useState(null);
  const [stateKey, setStateKey] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [search, setSearch] = useState('');


  const seacrhSchema = Yup.object().shape({
  });



  const methods = useForm({
    resolver: yupResolver(seacrhSchema),
  });

  const {
    formState: { isSubmitting },
  } = methods;

  const handleSearch = async (el) => {
    setSearch(el)
  }

  const handleSelect = (option) => {

    setStateKey(option?.name);
    setSelectedState(option?.name ?? "")
    methods.setValue('state', option, { shouldValidate: true });
  };

  const handlecity = (option) => {
    setSelectedCity(option?.value ?? "")
  }


  const [errorMsg, setErrorMsg] = useState('');

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

  const getTopRateServices = useCallback(
    async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(endpoints.services.topRated({ state: selectedState, city: selectedCity ,search:search}));
        setTopRated(data?.data?.result)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    }, [selectedState, selectedCity,search]
  );

  const notFound = topRated && !topRated?.length;

  useEffect(() => {
    getTopRateServices()
  }, [getTopRateServices])

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        mb: 15,
      }}
    >
      <CustomBreadcrumbs
        heading="Find Service"
        links={[{ name: 'Dashboard', href: paths.findBusiness }, { name: 'Find Service' }]}
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
            // products={topRated || topRatedServices || []}
            isService
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

export default FindServiceView;
