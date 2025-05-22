import PropTypes from 'prop-types';

import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import Iconify from 'src/components/iconify';
import { useCheckoutContext } from 'src/sections/checkout/context';

// ----------------------------------------------------------------------

export default function CartIcon({ totalItems }) {
  const checkout = useCheckoutContext();
  return (
    <Box
      component={RouterLink}
      href={paths.product.checkout}
      onClick={
        () => {
          checkout.onGotoStep(0)
        }
      }
      sx={{
        right: 0,
        top: 112,
        zIndex: 999,
        display: 'flex',
        cursor: 'pointer',
        position: 'fixed',
        color: 'text.primary',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        bgcolor: 'background.paper',
        padding: (theme) => theme.spacing(1, 3, 1, 2),
        boxShadow: (theme) => theme.customShadows.dropdown,
        transition: (theme) => theme.transitions.create(['opacity']),
        '&:hover': { opacity: 0.72 },
      }}
    >
      <Badge showZero badgeContent={totalItems} color="error" max={99}>
        <Iconify icon="solar:cart-3-bold" width={24} />
      </Badge>
    </Box>
  );
}

CartIcon.propTypes = {
  totalItems: PropTypes.number,
};
