import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';


// ----------------------------------------------------------------------

export default function ProductReviewItem({ review }) {
  const { name, rating, comment, created_at, Member } = review;

  const renderInfo = (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'row',
        md: 'column',
      }}
      sx={{
        width: { md: 240 },
        textAlign: { md: 'center' },
      }}
    >
      <Avatar
        src={Member.profile_picture}
        sx={{
          width: { xs: 48, md: 64 },
          height: { xs: 48, md: 64 },
        }}
      />

      <ListItemText
        primary={Member.full_name}
        secondary={fDate(created_at)}
        primaryTypographyProps={{
          noWrap: true,
          typography: 'subtitle2',
          mb: 0.5,
        }}
        secondaryTypographyProps={{
          noWrap: true,
          typography: 'caption',
          component: 'span',
        }}
      />
    </Stack>
  );

  const renderContent = (
    <Stack spacing={1} flexGrow={1}>
      <Rating size="small" value={rating} precision={0.1} readOnly />
      <Typography variant="body2">{comment}</Typography>
    </Stack>
  );

  return (
    <Stack
      spacing={2}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{ mt: 5, px: { xs: 2.5, md: 0 }, justifyContent: 'center', alignItems: 'start' }}
    >
      {renderInfo}
      {renderContent}
    </Stack>
  );
}

ProductReviewItem.propTypes = {
  review: PropTypes.object,
};
