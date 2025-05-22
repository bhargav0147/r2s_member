import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Label from 'src/components/label';

import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function ServiceTableRow({ row, onViewRow, isService, isMyService, buyer, seller, getService }) {
  // const { status, orderStatus } = row;
  // onClick={() => {
  //   // if (isOrder || isMyOrder) {
  //     navigate('/order/details/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1');
  //   // }
  // }}

  // for nevigation link
  let singleOrderNavigationLink;

  // if (isService) {
  //   singleOrderNavigationLink = `/service-history/${row?.id}`
  // }
  // if (isMyService) {
  //   singleOrderNavigationLink = `/my-service/${row?.id}`
  // }

  const [loading, setLoading] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isRejectDialogOpen, setRejectDialogOpen] = useState(false);

  const handleApproveClick = () => {
    // Add your approval logic here
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  function getStatusColor(status) {
    if (status === 'APPROVED') {
      return 'success';
    }
    if (status === 'REJECTED') {
      return 'error';
    }
    return 'warning';
  }

  const handleConfirm = async (status) => {
    try {
      const response = await axiosInstance.patch(`/api/member/ecommerce/service/booking/${row.bookingId}/status`, { status });

      if (response.status === 200) {
        setConfirmDialogOpen(false);
        setRejectDialogOpen(false);
        getService();
        enqueueSnackbar(response.data.message, {
          variant: 'success'
        })
      }
    } catch (error) {
      console.log(error);
    }
  };


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
            `${row?.title}`
          }

        </Box>
      </TableCell>



      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
          }}
        >
          {
            `₹ ${row?.price}`
          }

        </Box>
      </TableCell>

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
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
          }}
        >
          {
            isService ? buyer.full_name : seller.bussiness_name
          }

        </Box>
      </TableCell>

      {isService &&
        <TableCell>
          <Box
            onClick={onViewRow}
            sx={{
              cursor: 'pointer',
            }}
          >
            {
              `${buyer?.Contact_no}`
            }

          </Box>
        </TableCell>
      }

      <TableCell>
        <Label variant="soft" color={getStatusColor(row.status)}>
          {row.status}
        </Label>
      </TableCell>
      {
        isService && < TableCell >
          <Button
            disabled={row.status !== 'PENDING'}
            color="success"
            variant="contained"
            sx={{ mr: 2 }}
            onClick={handleApproveClick}
          >
            Approve
          </Button>

          {/* Input for Transaction ID */}

          <ConfirmDialog
            open={isConfirmDialogOpen}
            onClose={handleConfirmDialogClose}
            title='Are you sure to approve?'
            content={
              <>
                {/* {!!errorMsg && (
                <Alert sx={{ mb: 2 }} severity="error">
                  {errorMsg}
                </Alert>
              )} */}

                {/* <Textfield onChange={handleInputChange} label="Outlined" variant="outlined" /> */}
                {/* {!isRegister && !isPromotion && (
                <input
                  style={{
                    width: '100%',
                    height: 45,
                    padding: 10,
                    borderRadius: 2,
                    borderColor: 'gray',
                  }}
                  onChange={handleInputChange}
                  type="text"
                />
              )} */}
              </>
            }
            action={
              <LoadingButton
                loading={loading}
                variant="contained"
                color="success"
                onClick={() => handleConfirm('APPROVED')}
              >
                Approve
              </LoadingButton>
            }
          />
          <Button
            disabled={row.status !== 'PENDING'}
            onClick={() => setRejectDialogOpen(true)}
            color="error"
            variant="contained"
          >
            Reject
          </Button>

          <ConfirmDialog
            open={isRejectDialogOpen}
            onClose={() => {
              setRejectDialogOpen(false);
            }}
            title='Are you sure to reject?'
            // content={
            //   <>
            //     {!!errorMsg && (
            //       <Alert sx={{ mb: 2 }} severity="error">
            //         {errorMsg}
            //       </Alert>
            //     )}

            //     {/* <Textfield
            //       onChange={handleInputChange}
            //       id="outlined-password-input"
            //       label="Outlined"
            //       variant="outlined"
            //     /> */}
            //     {!isRegister && (
            //       <input
            //         style={{ width: '100%', height: 45, padding: 10, borderRadius: 2 }}
            //         onChange={handleInputChange}
            //         type="text"
            //       />
            //     )}
            //   </>
            // }
            action={
              <LoadingButton
                loading={loading}
                variant="contained"
                color="error"
                onClick={() => handleConfirm('REJECTED')}
              >
                Reject
              </LoadingButton>
            }
          />
        </TableCell>
      }
    </TableRow >
  );

  return <>{renderPrimary}</>;
}

ServiceTableRow.propTypes = {
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  buyer: PropTypes.object,
  seller: PropTypes.object,
  isMyService: PropTypes.bool,
  isService: PropTypes.bool,
  getService: PropTypes.func
};
