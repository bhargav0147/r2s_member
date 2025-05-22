import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Divider, IconButton, MenuItem } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Stack } from '@mui/system';

import { fCurrency } from 'src/utils/format-number';

import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData, TablePaginationCustom, TableSkeleton } from 'src/components/table';

// ----------------------------------------------------------------------

export default function EcommerceBestSalesman({
  title,
  subheader,
  tableData,
  tableLabels,
  handleDeletefn,
  isLoading,
  isService,
  isProduct,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  dense,
  onChangeDense,
  ...other
}) {


  return (
    <Card {...other}>
      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 640 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {isLoading &&
                [...Array(5)].map((i, index) => <TableSkeleton key={index} sx={{ height: 60 }} />)}
              {tableData?.map((row, i) => (
                <EcommerceBestSalesmanRow
                  isService={isService}
                  isProduct={isProduct}
                  handleDeletefn={handleDeletefn}
                  key={row.id}
                  row={row}
                  SrNo={i + 1}
                />
              ))}

              <TableNoData notFound={!tableData?.length && !isLoading} />
            </TableBody>
          </Table>
        </Scrollbar>
        <TablePaginationCustom
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          //
          dense={dense}
          onChangeDense={onChangeDense}
        />
      </TableContainer>
    </Card>
  );
}

EcommerceBestSalesman.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
  handleDeletefn: PropTypes.func,
  isLoading: PropTypes.bool,
  isService: PropTypes.bool,
  isProduct: PropTypes.bool,
  count: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  dense: PropTypes.bool,
  onChangeDense: PropTypes.func,
};

// ----------------------------------------------------------------------

function EcommerceBestSalesmanRow({ row, handleDeletefn, isService, isProduct, SrNo }) {

  const popover = usePopover();
  return (
    <>
      <TableRow>


        <TableCell>{SrNo}</TableCell>

        <TableCell>
          {isService || isProduct ? (
            <Stack direction='row' alignItems='center' gap={2}>
              <Avatar src={row?.pictures[0]?.image_url} alt={row?.title} variant="rounded">
                {/* <AssignmentIcon /> */}
              </Avatar>

              {row?.title}
            </Stack>
          ) : (
            <Stack direction='row' alignItems='center' gap={2}>
              <Avatar
                alt={row?.Member?.full_name}
                src={row?.Member?.profile_picture}
                sx={{ mr: 2 }}
              />
              {row?.Member?.full_name}
            </Stack>
          )}
        </TableCell>

        {isService || isProduct ? null :
          (<TableCell>{row?.Member?.Contact_no}</TableCell>)
        }

        <TableCell>{isService || isProduct ? row?.description : row?.id}</TableCell>

        <TableCell align="right">
          ₹{fCurrency((isService || isProduct ? row?.price : row?.amount) || 0)}
        </TableCell>

        {isService || isProduct ? (
          <TableCell align="right" sx={{ pr: 1 }}>
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        ) : (
          <TableCell align="right">
            <Label
              variant="soft"
              color={
                (row?.status === 'pending' && 'warning') ||
                (row.status === 'approved' && 'info') ||
                'error'
              }
            >
              {row?.status}
            </Label>
          </TableCell>
        )}

      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          component={Link}
          to={isService ? `/add-service/${row?.id}` : `/add-product/${row?.id}`}
          sx={{ textDecoration: 'none' }}
          onClick={popover.onClose}
        >
          <Iconify icon="bxs:edit" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            handleDeletefn(row?.id, isService ? 'service' : isProduct ? 'product' : '');
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}

EcommerceBestSalesmanRow.propTypes = {
  row: PropTypes.object,
  handleDeletefn: PropTypes.func,
  isService: PropTypes.bool,
  isProduct: PropTypes.bool,
  SrNo: PropTypes.number
};
