import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';

import { Fab } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
import Label from 'src/components/label';

import { styled } from '@mui/system';
import { useLocation } from 'react-router';
import { useCheckoutContext } from '../checkout/context';

// ----------------------------------------------------------------------
const StyledBox = styled(Box)(({ theme }) => ({
  color: theme.palette.text.disabled,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  textOverflow: 'ellipsis',
  WebkitLineClamp: 3, // Limits the text to 3 lines
  lineClamp: 3, // Fallback for non-webkit browsers
  wordWrap: 'break-word', // Ensures long words wrap onto the next line
  wordBreak: 'break-all',
}));
export default function ProductItem({ product, isProduct, isService }) {
  const { onAddToCart } = useCheckoutContext();
  const { enqueueSnackbar } = useSnackbar();
  const {
    id,
    Bussiness_type,
    business_cover_image,
    business_logo,
    bussiness_name,
    rating,
    short_description,
    title,
    price,
    description,
    pictures,
    bussiness_id,
    Bussiness
  } = product;

  const location = useLocation();
  const { pathname } = location;


  const linkTo = isProduct
    ? paths.product.details(id)
    : isService
      ? '/service/' + id
      : paths.business.details(id);

  const handleAddCart = async () => {
    const newProduct = {
      id,
      title,
      price,
      description,
      quantity: 1,
      bussiness_id,
      shippingFee: Number(Bussiness.shippingFee),
      image:
        pictures[0]?.image_url ||
        'https://archive.org/download/no-photo-available/no-photo-available.png',
    };


    try {
      onAddToCart(newProduct);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message || error?.response?.data?.message, { variant: 'error' });
    }
  };

  const renderLabels = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={1}
      sx={{ position: 'absolute', zIndex: 9, top: 16, right: 16, left: 16 }}
    >
      <Label style={{ color: '#fff' }} variant="filled" color="warning">
        <Stack direction="row" alignItems="center" spacing>
          <FaStar />
          {rating}
        </Stack>
      </Label>
    </Stack>
  );

  const renderImg = (
    <Box sx={{ position: 'relative', p: 1 }}>
      <Link
        component={RouterLink}
        href={linkTo}
        color="inherit"
        variant="subtitle2"
        sx={{
          '&:hover': {
            textDecoration: 'none',
          },
        }}
        noWrap
      >
        <Image
          alt={bussiness_name}
          src={
            (isProduct || isService ? pictures[0]?.image_url : business_cover_image) ||
            'https://archive.org/download/no-photo-available/no-photo-available.png'
          }
          ratio="1/1"
          sx={{
            borderRadius: 1.5,
          }}
        />
      </Link>

      {isProduct && (
        <Fab
          color="warning"
          size="medium"
          className="add-cart-btn"
          onClick={handleAddCart}
          sx={{
            right: 16,
            bottom: 16,
            zIndex: 9,
            opacity: 0,
            position: 'absolute',
            transition: (theme) =>
              theme.transitions.create('all', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          <Iconify icon="solar:cart-plus-bold" width={24} />
        </Fab>
      )}
    </Box>
  );

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2, whiteSpace: 'wrap', textWrap: 'wrap' }}>
      <Stack direction="row" alignItems="center" gap={1}>
        <Avatar
          src={business_logo}
          alt={bussiness_name}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {bussiness_name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Box>
          <Box color="inherit" sx={{ fontSize: '18px', textWrap: 'wrap' }}>
            {bussiness_name || title}
          </Box>
          <small>
            {Bussiness_type === 'Others'
              ? product?.otherType
              : Bussiness_type?.split('_')?.join(' ') || `Rs. ${price}`}
          </small>
        </Box>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          <StyledBox component="span" >
            {short_description || description || '...'}
          </StyledBox>
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Card
      sx={{
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      {(pathname === '/find-product') && renderLabels}

      {renderImg}
      <Link
        component={RouterLink}
        href={linkTo}
        color="inherit"
        variant="subtitle2"
        sx={{
          '&:hover': {
            textDecoration: 'none',
          },
        }}
        noWrap
      >
        {renderContent}
      </Link>
    </Card>
  );
}

ProductItem.propTypes = {
  product: PropTypes.object,
};
