import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';

// ----------------------------------------------------------------------

export default function TablePaginationCustom({
  dense,
  onChangeDense,
  rowsPerPageOptions = [5, 10, 25],
  sx,
  ...other
}) {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        {...other}
        sx={{
          borderTopColor: 'transparent',
        }}
      />


    </Box>
  );
}

TablePaginationCustom.propTypes = {
  onChangeDense: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object,
};
