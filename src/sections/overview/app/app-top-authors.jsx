import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';


import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function AppTopAuthors({ title, subheader, list, ...other }) {
  // const { data } = list
  console.log("list====>>>>", list);



  return (
    <Card {...other}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <CardHeader title="Level" />
        <CardHeader title="Total Referal" />
      </Box>

      <Stack spacing={0} sx={{ px: 3 }}>
        {list?.map((author, index) => (
          <AuthorItem key={author.id} author={author} index={index} />
        ))}
      </Stack>
    </Card>
  );
}

AppTopAuthors.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function AuthorItem({ author, index }) {
  console.log(author);

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 1, width: '100%' }}>
      {/* <Avatar alt={author.name} src={author.avatarUrl} /> */}

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: '100%' }}>
        <Iconify
          icon="solar:cup-star-bold"
          sx={{
            p: 1,
            width: 40,
            height: 40,
            borderRadius: '50%',
            color: 'primary.main',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            ...(index === 1 && {
              color: 'info.main',
              bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
            }),
            ...(index === 2 && {
              color: 'warning.main',
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            }),
            ...(index === 3 && {
              color: 'error.main',
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            }),
          }}
        />
        <Typography variant="subtitle2">{index === 0 ? "Master" : index}</Typography>

      </Box>
      <Typography
        sx={{
          mt: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100px',
        }}
        variant="subtitle2"
      >
        {author}
      </Typography>


    </Stack>
  );
}

AuthorItem.propTypes = {
  author: PropTypes.object,
  index: PropTypes.number,
};
