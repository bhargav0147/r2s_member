import { forwardRef } from 'react';

import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function TransitionsDialog() {
  const dialog = useBoolean();

  return (
    <div>
      <Button variant="outlined" color="success" onClick={dialog.onTrue}>
        Transitions Dialogs
      </Button>

      <Dialog
        keepMounted
        open={dialog.value}
        TransitionComponent={Transition}
        onClose={dialog.onFalse}
      >
        <DialogTitle>{`Is Your Query Resolved?`}</DialogTitle>

        <DialogContent sx={{ color: 'text.secondary' }}>
        We hope your query has been addressed to your satisfaction. Please confirm if your issue has been resolved.
        </DialogContent>

        <DialogActions>
          <Button variant='contained'  color="error" onClick={dialog.onFalse}>
            Disagree
          </Button>
          <Button variant='contained' color="success" onClick={dialog.onFalse} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
