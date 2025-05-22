import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import axiosInstance from 'src/utils/axios';
import { fCurrency, fShortenNumber } from 'src/utils/format-number';

import FormProvider from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';

import { styled } from '@mui/system';
import { enqueueSnackbar } from 'notistack';
import IncrementerButton from './common/incrementer-button';

// ----------------------------------------------------------------------

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: '100%',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  textOverflow: 'ellipsis',
  WebkitLineClamp: 3, // Limits the text to 3 lines
  lineClamp: 3, // Fallback for non-webkit browsers
  wordWrap: 'break-word', // Ensures long words wrap onto the next line
  wordBreak: 'break-all', // Fallback for non-webkit browsers
  overflow: 'hidden',
}));

export default function ProductDetailsSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  disabledActions,
  isService,
  avgrating,
  totalReviews,
  isProduct,
  ...other
}) {
  const router = useRouter();

  const {
    id,
    name,

    price,
    coverUrl,

    newLabel,
    available,
    priceSale,
    saleLabel,
    inventoryType,

    title,
    description,
  } = product;



  const existProduct = !!items?.length && items.map((item) => item.id).includes(id);

  const isMaxQuantity =
    !!items?.length &&
    items.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;

  const defaultValues = {
    id,
    name,
    coverUrl,
    available,
    price,
    // colors: colors[0],
    // size: sizes[4],
    quantity: available < 1 ? 0 : 1,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // this is onsubmit
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!existProduct) {
        onAddCart?.({
          ...data,
          colors: [values.colors],
          subTotal: data.price * data.quantity,
        });
      }
      onGotoStep?.(0);
      router.push(paths.product.checkout);
    } catch (error) {
      console.error(error);
    }
  });

  // this is handleCart service
  const handleAddCart = useCallback(() => {
    try {
      onAddCart?.({
        ...values,
        colors: [values.colors],
        subTotal: values.price * values.quantity,
      });
    } catch (error) {
      console.error(error);
    }
  }, [onAddCart, values]);

  // this is book service
  const handleBookService = async () => {
    try {
      const response = await axiosInstance.post(`/api/member/ecommerce/service/book/${id}`);
      if (response.status === 200) {
        enqueueSnackbar("Service Book Successfully!!", { variant: 'success' })
      }
    } catch (error) {
      console.log(error);
    }
  }

  const renderPrice = (
    <Box sx={{ typography: 'h5' }}>
      {priceSale && (
        <Box
          component="span"
          sx={{
            color: 'text.disabled',
            textDecoration: 'line-through',
            mr: 0.5,
          }}
        >
          {fCurrency(priceSale)}
        </Box>
      )}

      {fCurrency(price)}
    </Box>
  );

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Quantity
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={values.quantity}
          disabledDecrease={values.quantity <= 1}
          disabledIncrease={values.quantity >= available}
          onIncrease={() => setValue('quantity', values.quantity + 1)}
          onDecrease={() => setValue('quantity', values.quantity - 1)}
        />

        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
          Available: {available}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderActions = (
    <Stack direction="row" spacing={2}>
      <Button
        fullWidth
        disabled={isMaxQuantity || disabledActions}
        size="large"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon={isService ? "carbon:add-filled" : "solar:cart-plus-bold"} width={24} />}
        onClick={isProduct ? handleAddCart : handleBookService}
        sx={{ whiteSpace: 'nowrap' }}
      >
        {isService ? 'Book Now' : 'Add to Cart'}
      </Button>
      {/* SHARE NOW BUTTON HIDED */}
      {/*
      <Button fullWidth size="large" type="submit" variant="contained" disabled={disabledActions}>
        Share
      </Button> */}
    </Stack>
  );

  const renderSubDescription = (
    <StyledTypography variant="body2">
      {description}
    </StyledTypography>
  );

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        color: 'text.disabled',
        typography: 'body2',
      }}
    >
      <Rating size="small" value={avgrating} precision={0.1} readOnly sx={{ mr: 1 }} />
      {`(${fShortenNumber(totalReviews)} reviews)`}
    </Stack>
  );

  const renderLabels = (newLabel?.enabled || saleLabel?.enabled) && (
    <Stack direction="row" alignItems="center" spacing={1}>
      {newLabel.enabled && <Label color="info">{newLabel.content}</Label>}
      {saleLabel.enabled && <Label color="error">{saleLabel.content}</Label>}
    </Stack>
  );

  const renderInventoryType = (
    <Box
      component="span"
      sx={{
        typography: 'overline',
        color:
          (inventoryType === 'out of stock' && 'error.main') ||
          (inventoryType === 'low stock' && 'warning.main') ||
          'success.main',
      }}
    >
      {inventoryType}
    </Box>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          {renderLabels}

          {renderInventoryType}

          <Typography variant="h5">{title}</Typography>

          {isProduct && renderRating}

          {renderPrice}

          {renderSubDescription}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderQuantity}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderActions}
      </Stack>
    </FormProvider>
  );
}

ProductDetailsSummary.propTypes = {
  items: PropTypes.array,
  disabledActions: PropTypes.bool,
  onAddCart: PropTypes.func,
  onGotoStep: PropTypes.func,
  product: PropTypes.object,
  isService: PropTypes.bool,
  isProduct: PropTypes.bool,
  avgrating: PropTypes.number,
  totalReviews: PropTypes.number,
};
