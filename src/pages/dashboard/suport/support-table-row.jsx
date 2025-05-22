import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import Label from 'src/components/label';
// ----------------------------------------------------------------------

export default function SupportTableRow({ row, }) {
  const { status } = row;


  const renderPrimary = (
    <TableRow
      hover
      as={Link}
      sx={{ textDecoration: 'none' }}
    >


      <TableCell>
        <ListItemText
          primary={format(new Date(row?.created_at || ''), 'dd MMM yyyy')}
          secondary={format(new Date(row?.created_at || ''), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>
        <Box
          sx={{
            cursor: 'pointer',
          }}
        >
          {
            row?.title
          }
        </Box>
      </TableCell>

      <TableCell>
        {row?.description || ''}
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            ((status === 'SOLVED' || row?.supportStatus === "SOLVED") && 'success') ||
            ((status === 'PENDING' || row?.supportStatus === 'PENDING') && 'warning') ||
            ((status === 'REJECTED' || row?.supportStatus === 'REJECTED') && 'error') ||
            'default'
          }
        >
          {row.status || row?.supportStatus}
        </Label>
      </TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
}

SupportTableRow.propTypes = {

  row: PropTypes.object,
};
