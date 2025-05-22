import { yupResolver } from '@hookform/resolvers/yup';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import * as Yup from 'yup';

import { LoadingButton } from '@mui/lab';
import { Alert, Container, Stack } from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';
import { paths } from 'src/routes/paths';
import { AppContext } from 'src/store/AppProvider';

import { default as axios, default as axiosInstance, endpoints } from 'src/utils/axios';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import EmptyContent from 'src/components/empty-content/empty-content';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { useSettingsContext } from 'src/components/settings';

import EcommerceNewProducts from 'src/sections/overview/e-commerce/ecommerce-new-products';
import ProductList from 'src/sections/product/product-list';

import MembershipView from '../membership/components/MembershipView';
import { Cities, States } from './state-city';

const FindBusinessView = () => {
  const settings = useSettingsContext();

  const { promotions } = useContext(AppContext);

  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const [stateKey, setStateKey] = useState(null);

  // for businessType

  const [businessType, setBusinessType] = useState([]);

  const getBusinessTypes = async () => {
    try {
      const { data } = await axiosInstance.get("/api/admin/business/type?page=1&pageSize=1000");
      const businessTypeList = data?.data?.map((item) => ({
        value: item.type,
        label: item.type
      }));

      setBusinessType(businessTypeList)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getBusinessTypes()
  }, [])

  const handleSelect = (option) => {

    setStateKey(option?.name);
    methods.setValue('state', option, { shouldValidate: true });
  };

  const LoginSchema = Yup.object().shape({
    state: Yup.object().required('State is required'),
    city: Yup.object().required('City is required'),
    // bussinessType: Yup.object().required('Category is required'),
  });

  const defaultValues = {
    pincode_or_area: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      setLoading(true);
      const response = await axios.post(
        `/api/member/business/search?businessType=${data?.bussinessType?.value !== undefined ? data?.bussinessType?.value : ''
        }&state=${data?.state?.value}&city=${data?.city?.value}&pincode_or_area=${data?.pincode_or_area
        }`
      );


      setTopRated(response?.data?.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
      setLoading(false);
    }
  });

  const [errorMsg, setErrorMsg] = useState('');

  const renderFilters = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {!!errorMsg && (
        <Alert sx={{ mb: 2 }} severity="error">
          {errorMsg}
        </Alert>
      )}
      <Stack justifyContent="space-between" direction={{ xs: 'column', sm: 'row' }}>
        <RHFAutocomplete
          sx={{ m: 1, width: '100%' }}
          name="bussinessType"
          label="Catergory"
          options={businessType}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.label === value.value}
          renderOption={(props, option) => (
            <li {...props} key={option.label}>
              {option.label}
            </li>
          )}
        />

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
        />

        <RHFTextField sx={{ m: 1 }} name="pincode_or_area" label="Area/Pincode" />

        <LoadingButton
          sx={{ m: 1 }}
          style={{ width: '50%', height: '50px' }}
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Search
        </LoadingButton>
      </Stack>
    </FormProvider>
  );

  const renderNotFound = <EmptyContent filled title="No Data" sx={{ py: 10 }} />;

  const [topRated, setTopRated] = useState(null);

  const getTopRatedBusiness = async () => {
    const { data } = await axios.get(endpoints.business.topRated);
    return data;
  };

  const useBusiness = () => useQuery('topRatedBusiness', getTopRatedBusiness, {
    staleTime: 60000,
    cacheTime: 3600000,
  });

  const { data: topRatedBusiness, error, isLoading } = useBusiness();

  const notFound =
    topRated !== null
      ? !topRated?.length
      : !topRated?.length && !topRatedBusiness?.data?.result?.length;

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        mb: 15,
      }}
    >
      <CustomBreadcrumbs
        heading="Find Business"
        links={[
          { name: 'Dashboard', href: paths.findBusiness },
          { name: 'Find Business', href: paths.findBusiness },
        ]}
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
            products={topRated || topRatedBusiness?.data?.result || []}
            loading={loading && isLoading}
          />
        </>
      ) : (
        <MembershipView />
      )}
    </Container>
  );
};

export default FindBusinessView;
