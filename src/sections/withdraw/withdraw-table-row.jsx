import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import Label from 'src/components/label';
// ----------------------------------------------------------------------

export default function WithdrawTableRow({ row }) {
  const { status } = row;
  // onClick={() => {
  //   // if (isOrder || isMyOrder) {
  //     navigate('/order/details/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1');
  //   // }
  // }}

  // for nevigation link
  let singleOrderNavigationLink;



  const renderPrimary = (
    <TableRow
      hover
      to={singleOrderNavigationLink || "#"}
      as={Link}
      sx={{ textDecoration: 'none' }}
    >
      <TableCell>
        <Box
          sx={{
            cursor: 'pointer',
          }}
        >
          {
            `₹ ${row?.amount}`
          }

        </Box>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(row?.created_at), 'dd MMM yyyy')}
          secondary={format(new Date(row?.created_at), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(row?.paid_at), 'dd MMM yyyy')}
          secondary={format(new Date(row?.paid_at), 'p')}
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
            ` ${row?.transction_id}`
          }

        </Box>
      </TableCell>


      <TableCell>
        <Label
          variant="soft"
          color={
            ((status === 'approved') && 'success') ||
            ((status === 'pending') && 'warning') ||
            (status === 'rejected' && 'error') ||
            'default'
          }
        >
          {row.status}
        </Label>
      </TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
}

WithdrawTableRow.propTypes = {
  row: PropTypes.object,
};
