import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function AppTopInstalledCountries({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, }}>
          <Stack sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }} direction="row" alignItems="center" spacing={2}>
            <Stack direction="row" alignItems="center" flexGrow={1} sx={{ minWidth: 120 }}>
              <Typography variant="subtitle2" noWrap>
                Lavel
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" sx={{ minWidth: 80 }}>
              <Typography variant="subtitle2">Count</Typography>
            </Stack>
          </Stack>

          {list.map((lavel, i) => (
            <CountryItem key={i} lavel={lavel} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

AppTopInstalledCountries.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function CountryItem({ lavel }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack direction="row" alignItems="center" flexGrow={1} sx={{ minWidth: 120 }}>
        <Typography variant="subtitle2" noWrap>
          {lavel.level}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" sx={{ minWidth: 80 }}>
       
        <Typography variant="body2">{lavel.count}</Typography>
      </Stack>
    </Stack>
  );
}

CountryItem.propTypes = {
  country: PropTypes.object,
};
