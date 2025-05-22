import isEqual from 'lodash/isEqual';
import React, { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useDebounce } from 'src/hooks/use-debounce';

import { useSearchProducts } from 'src/api/product';

import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import ProductList from '../product-list';
import ProductSearch from '../product-search';
import ProductFiltersResult from '../product-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  gender: [],
  colors: [],
  rating: '',
  category: 'all',
  priceRange: [0, 200],
};

// ----------------------------------------------------------------------

export default function ProductShopView() {
  const settings = useSettingsContext();

  const [searchQuery, setSearchQuery] = useState('');

  const debouncedQuery = useDebounce(searchQuery);

  const [filters, setFilters] = useState(defaultFilters);

  const { searchResults, searchLoading } = useSearchProducts(debouncedQuery);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const dataFiltered = [
    {
      id: 1,
      name: 'Test',
      coverUrl:
        'https://www.dreamhost.com/blog/wp-content/uploads/2019/06/afa314e6-1ae4-46c5-949e-c0a77f042e4f_DreamHost-howto-prod-descrips-full.jpeg',
      price: '12',
      colors: ['red', 'blue'],
      available: true,
      sizes: 'ml',
      priceSale: '100',
      newLabel: 'fgg',
      saleLabel: 'kk',
    },
    {
      id: 1,
      name: 'Test',
      coverUrl:
        'https://www.dreamhost.com/blog/wp-content/uploads/2019/06/afa314e6-1ae4-46c5-949e-c0a77f042e4f_DreamHost-howto-prod-descrips-full.jpeg',
      price: '12',
      colors: ['red', 'blue'],
      available: true,
      sizes: 'ml',
      priceSale: '100',
      newLabel: 'fgg',
      saleLabel: 'kk',
    },
    {
      id: 1,
      name: 'Test',
      coverUrl:
        'https://www.dreamhost.com/blog/wp-content/uploads/2019/06/afa314e6-1ae4-46c5-949e-c0a77f042e4f_DreamHost-howto-prod-descrips-full.jpeg',
      price: '12',
      colors: ['red', 'blue'],
      available: true,
      sizes: 'ml',
      priceSale: '100',
      newLabel: 'fgg',
      saleLabel: 'kk',
    },
    {
      id: 1,
      name: 'Test',
      coverUrl:
        'https://www.dreamhost.com/blog/wp-content/uploads/2019/06/afa314e6-1ae4-46c5-949e-c0a77f042e4f_DreamHost-howto-prod-descrips-full.jpeg',
      price: '12',
      colors: ['red', 'blue'],
      available: true,
      sizes: 'ml',
      priceSale: '100',
      newLabel: 'fgg',
      saleLabel: 'kk',
    },
    {
      id: 1,
      name: 'Test',
      coverUrl:
        'https://www.dreamhost.com/blog/wp-content/uploads/2019/06/afa314e6-1ae4-46c5-949e-c0a77f042e4f_DreamHost-howto-prod-descrips-full.jpeg',
      price: '12',
      colors: ['red', 'blue'],
      available: true,
      sizes: 'ml',
      priceSale: '100',
      newLabel: 'fgg',
      saleLabel: 'kk',
    },
    {
      id: 1,
      name: 'Test',
      coverUrl:
        'https://www.dreamhost.com/blog/wp-content/uploads/2019/06/afa314e6-1ae4-46c5-949e-c0a77f042e4f_DreamHost-howto-prod-descrips-full.jpeg',
      price: '12',
      colors: ['red', 'blue'],
      available: true,
      sizes: 'ml',
      priceSale: '100',
      newLabel: 'fgg',
      saleLabel: 'kk',
    },
    {
      id: 1,
      name: 'Test',
      coverUrl:
        'https://www.dreamhost.com/blog/wp-content/uploads/2019/06/afa314e6-1ae4-46c5-949e-c0a77f042e4f_DreamHost-howto-prod-descrips-full.jpeg',
      price: '12',
      colors: ['red', 'blue'],
      available: true,
      sizes: 'ml',
      priceSale: '100',
      newLabel: 'fgg',
      saleLabel: 'kk',
    },
    {
      id: 1,
      name: 'Test',
      coverUrl:
        'https://www.dreamhost.com/blog/wp-content/uploads/2019/06/afa314e6-1ae4-46c5-949e-c0a77f042e4f_DreamHost-howto-prod-descrips-full.jpeg',
      price: '12',
      colors: ['red', 'blue'],
      available: true,
      sizes: 'ml',
      priceSale: '100',
      newLabel: 'fgg',
      saleLabel: 'kk',
    },
  ];

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !dataFiltered.length;

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <ProductSearch
        query={debouncedQuery}
        results={searchResults}
        onSearch={handleSearch}
        loading={searchLoading}
        hrefItem={(id) => paths.product.details(id)}
      />
    </Stack>
  );

  const renderResults = (
    <ProductFiltersResult
      filters={filters}
      onFilters={handleFilters}
      //
      canReset={canReset}
      onResetFilters={handleResetFilters}
      results={dataFiltered.length}
    />
  );

  const renderNotFound = <EmptyContent filled title="No Data" sx={{ py: 10 }} />;

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

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {notFound && renderNotFound}

      <ProductList products={dataFiltered} />
    </Container>
  );
}
