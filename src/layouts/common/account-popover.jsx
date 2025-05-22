import { m } from 'framer-motion';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';

import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();

  const { logout, user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const popover = usePopover();

  const handleLogout = async () => {
    try {
      await logout();
      popover.onClose();
      router.replace('/auth/jwt/login');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={user?.profile_picture}
          alt={user?.full_name}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {user?.full_name?.charAt(0)?.toUpperCase()}
        </Avatar>
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography style={{ textTransform: 'capitalize' }} variant="subtitle2" noWrap>
            {user?.full_name}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email_id}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            router.replace('/my-business');
          }}
          sx={{ m: 1, fontWeight: 'fontWeightBold' }}
        >
          My Business
        </MenuItem>

        <MenuItem
          onClick={() => {
            router.replace('/manage-business');
          }}
          sx={{ m: 1, fontWeight: 'fontWeightBold' }}
        >
          Manage Business
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.replace('/my-order');
          }}
          sx={{ m: 1, fontWeight: 'fontWeightBold' }}
        >
          My Orders
        </MenuItem>

        <MenuItem
          onClick={() => {
            router.replace('/my-service');
          }}
          sx={{ m: 1, fontWeight: 'fontWeightBold' }}
        >
          My Services
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          Logout
        </MenuItem>
      </CustomPopover>
    </>
  );
}
