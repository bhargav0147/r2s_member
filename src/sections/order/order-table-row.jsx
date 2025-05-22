import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import Label from 'src/components/label';
// ----------------------------------------------------------------------

export default function OrderTableRow({ row, onViewRow, isOrder, isMyOrder, isSupport }) {
  const { status, orderStatus } = row;
  // onClick={() => {
  //   // if (isOrder || isMyOrder) {
  //     navigate('/order/details/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1');
  //   // }
  // }}

  // for nevigation link
  let singleOrderNavigationLink;

  if (isOrder) {
    singleOrderNavigationLink = `/order-history/${row?.id}`
  }
  if (isMyOrder) {
    singleOrderNavigationLink = `/my-order/${row?.id}`
  }

  const renderPrimary = (
    <TableRow
      hover
      to={singleOrderNavigationLink || "#"}
      as={Link}
      sx={{ textDecoration: 'none' }}
    >
      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
          }}
        >
          {
            isSupport ? row?.title : `₹ ${row?.amount}`
          }

        </Box>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(row?.created_at || row?.orderDate || ''), 'dd MMM yyyy')}
          secondary={format(new Date(row?.created_at || row?.orderDate || ''), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>
        {isOrder || isMyOrder ? (
          row?.orderId
        ) : isSupport ? row?.description : row?.paid_at ? (
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
        ) : (
          '-----'
        )}
        { }
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            ((orderStatus === 'approve' || status === 'approved' || row?.supportStatus === "APPROVED") && 'success') ||
            ((status === 'pending' || orderStatus === 'PENDING' || row?.supportStatus === 'PENDING') && 'warning') ||
            (status === 'rejected' && 'error') ||
            'default'
          }
        >
          {row.status || orderStatus || row?.supportStatus}
        </Label>
      </TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
}

OrderTableRow.propTypes = {
  onViewRow: PropTypes.func,
  row: PropTypes.object,
};
