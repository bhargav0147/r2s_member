import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import { Rating } from '@mui/material';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ProfilePostItem({ post }) {
  const { user } = useMockedUser();

  const renderHead = (
    <CardHeader
      disableTypography
      avatar={<Avatar src={post?.Member?.profile_picture} alt={post?.Member?.full_name} />}
      title={
        <Link color="inherit" variant="subtitle1">
          {post?.Member?.full_name}
        </Link>
      }
      subheader={
        <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
          {fDate(post.createdAt)}
        </Box>
      }
      // action={
      //   <IconButton>
      //     <Iconify icon="eva:more-vertical-fill" />
      //   </IconButton>
      // }
    />
  );

  const renderActions = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(2, 3, 3, 3),
      }}
    >
      <Rating name="read-only" value={post?.rating} readOnly />

      <Box sx={{ flexGrow: 1 }} />
    </Stack>
  );

  return (
    <Card>
      {renderHead}

      <Typography
        variant="body2"
        sx={{
          p: (theme) => theme.spacing(3, 3, 2, 3),
        }}
      >
        {post?.comment}
      </Typography>

      {renderActions}
    </Card>
  );
}

ProfilePostItem.propTypes = {
  post: PropTypes.object,
};
