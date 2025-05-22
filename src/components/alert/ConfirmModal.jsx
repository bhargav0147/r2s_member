import * as React from 'react';

import Slide from '@mui/material/Slide';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function ConfirmModal({
  title,
  description,
  open,
  handleClickOpen,
  handleClose,
  handleConfirm,
  isLoading
}) {
  return (
    <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={isLoading} color="error" onClick={handleClose}>
            Disagree
          </Button>
          <LoadingButton loading={isLoading} color="success" onClick={handleConfirm}>
            Agree
          </LoadingButton>
        </DialogActions>
      </Dialog>
  );
}
