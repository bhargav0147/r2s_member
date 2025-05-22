import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';


import { fCurrency } from 'src/utils/format-number';

import { alpha, Button, InputBase, Modal, Rating } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Scrollbar from 'src/components/scrollbar';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function OrderDetailsItems({
  items,
  taxes,
  shipping,
  discount,
  subTotal,
  totalAmount,
  isMyOrder,
  orderStatus
}) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [productId, setProductId] = useState('');
  const fileRef = useRef(null);

  const handleReview = async () => {
    try {
      const { data } = await axiosInstance.post(`/api/member/feedback/business/add/${productId}`, {
        comment,
        rating,
        type: 'product',
      });
      if (data.success) {
        setRating(0),
          setComment(""),
          handleCloseModal(),
          enqueueSnackbar('Review submitted successfully', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
    }
  };

  console.log(shipping, "this is a shipping fee");

  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ my: 3, textAlign: 'right', typography: 'body2' }}
    >
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>{fCurrency(subTotal) || '-'}</Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Shipping</Box>
        <Box
          sx={{
            width: 160,
            ...(shipping && { color: 'success.main' }),
          }}
        >
          {shipping ? `+ ${fCurrency(shipping)}` : '0'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Discount</Box>
        <Box
          sx={{
            width: 160,
            ...(discount && { color: 'error.main' }),
          }}
        >
          {discount ? `- ${fCurrency(discount)}` : '-'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Taxes</Box>
        <Box sx={{ width: 160 }}>{taxes ? fCurrency(taxes) : '-'}</Box>
      </Stack>

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <Box>Total</Box>
        <Box sx={{ width: 160 }}>{fCurrency(totalAmount) || '-'}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Card>
      <CardHeader
        title="Details"

      />

      <Stack
        sx={{
          px: 3,
        }}
      >
        <Scrollbar>
          {items?.map((item) => (
            <Stack direction="column">
              <Stack
                key={item.id}
                direction="row"
                alignItems="center"
                sx={{
                  py: 3,
                  minWidth: 640,
                  borderBottom: (theme) => `dashed 2px ${theme.palette.background.neutral}`,
                  textDecoration: 'none',
                  color: "inherit"
                }}
              >
                <Avatar src={item?.product?.pictures[0]?.image_url} variant="rounded" sx={{ width: 48, height: 48, mr: 2 }} as={Link} to={`/product/${item?.product?.id}`} />
                <ListItemText
                  as={Link}
                  sx={
                    {
                      textDecoration: 'none',
                      color: 'inherit'

                    }
                  }
                  to={`/product/${item?.product?.id}`}
                  primary={item?.product?.title}
                  // secondary={item?.product?.description}
                  primaryTypographyProps={{
                    typography: 'body2',
                  }}
                  secondaryTypographyProps={{
                    component: 'span',
                    color: 'text.disabled',
                    mt: 0.5,
                  }}
                />
                <Box sx={{ width: 110, textAlign: 'right', typography: 'subtitle2' }}>
                  {fCurrency(item.product.price)}
                </Box>
                <Box sx={{ typography: 'body2' }}>x{item.quantity}</Box>
                {
                  (isMyOrder && orderStatus === 'DELIVERED') && <Button
                    variant="outlined"
                    onClick={(event) => {
                      event.stopPropagation();
                      setProductId(item?.product?.id)
                      setIsModalOpen(true);
                    }}
                    sx={{
                      marginLeft: '50px',
                      backgroundColor: 'green',
                      color: 'white',
                      fontWeight: 'normal'
                    }}
                  >
                    Add Review
                  </Button>}
              </Stack>
            </Stack>
          ))}
        </Scrollbar>

        {renderTotal}
      </Stack>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '10px',
          }}
        >
          <Card sx={{ p: 3 }}>
            <InputBase
              multiline
              fullWidth
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your valuable feedback..."
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 1,
                border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
              }}
            />

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Rating
                name="read-only"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />

              <Button variant="contained" onClick={handleReview}>
                Submit
              </Button>
            </Stack>

            <input ref={fileRef} type="file" style={{ display: 'none' }} />
          </Card>
        </Box>
      </Modal>

    </Card>
  );
}

OrderDetailsItems.propTypes = {
  discount: PropTypes.number,
  items: PropTypes.array,
  shipping: PropTypes.number,
  subTotal: PropTypes.number,
  taxes: PropTypes.number,
  totalAmount: PropTypes.number,
  isMyOrder: PropTypes.bool,
  orderStatus: PropTypes.string
};
