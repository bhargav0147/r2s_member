import { LoadingButton } from "@mui/lab";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";

export default function ReferallDialog({ dialog, handlePayment, referallCode, setReferallCode, errorMsg, }) {


  const [loading, setLoading] = useState(false)


  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <div>
      <Dialog open={dialog.value} onClose={dialog.onFalse}>
        <DialogTitle>Referral Code</DialogTitle>

        <DialogContent>
          <Typography sx={{ mb: 3 }}>
            Save 50% on Membership with Referral Code
          </Typography>

          {!!errorMsg && (
            <Alert sx={{ mb: 2 }} severity="error">
              {errorMsg}
            </Alert>
          )}
          <TextField
            autoFocus
            fullWidth
            type="text"
            margin="dense"
            variant="outlined"
            label="Enter Referral Code"
            value={referallCode}
            onChange={(event) => setReferallCode(event.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => {
            setReferallCode('')
            dialog.onFalse()
          }} variant="outlined" color="inherit">
            Cancel
          </Button>
          <LoadingButton color="inherit" loading={loading} onClick={() => {
            setLoading(true)
            if (!referallCode || referallCode.trim() === "") {
              enqueueSnackbar("Please enter a referral code.", {
                variant: 'warning'
              });
              setLoading(false)
              return
            }
            handlePayment()
            setLoading(false)
          }} variant="contained">
            Use Code
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

ReferallDialog.propTypes = {
  dialog: PropTypes.object,
  handlePayment: PropTypes.func,
  referallCode: PropTypes.string,
  setReferallCode: PropTypes.func,
  errorMsg: PropTypes.string,
}
