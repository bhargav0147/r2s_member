import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

export default function AlertDialog() {
  const dialog = useBoolean();

  return (
    <>
      <Button color="info" variant="outlined" onClick={dialog.onTrue}>
        Open alert dialog
      </Button>

      <Dialog open={dialog.value} onClose={dialog.onFalse}>
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
    </>
  );
}
