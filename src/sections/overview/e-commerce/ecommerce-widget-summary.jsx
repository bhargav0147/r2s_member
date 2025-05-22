import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';


// ----------------------------------------------------------------------

export default function EcommerceWidgetSummary({ title, percent, total, chart, sx, ...other }) {

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          {title}
        </Typography>

        <Typography variant="h3" gutterBottom>
          {fNumber(total)}
        </Typography>

        {/* {renderTrending} */}
      </Box>

   
    </Card>
  );
}

EcommerceWidgetSummary.propTypes = {
  chart: PropTypes.object,
  percent: PropTypes.number,
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
};
