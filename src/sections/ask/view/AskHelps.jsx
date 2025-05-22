import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { _socials } from 'src/_mock';

import Iconify from 'src/components/iconify';

import ProfilePostItem from 'src/sections/user/profile-post-item';
import { Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemText, Switch, TextField, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import Label from 'src/components/label';
import axiosInstance from 'src/utils/axios';
import { useParams, useRouter } from 'src/routes/hooks';
import { enqueueSnackbar } from 'notistack';
import { set } from 'lodash';
// ----------------------------------------------------------------------

export default function AskHelps() {

  let askId = useParams()
  const navigate = useNavigate();

  const location = useLocation();
  // const data = location.state?.data?.ask;
  const isself = location.state?.isself;


  const [data, setData] = useState({})
  const [response, setResponse] = useState()


  const getAskbyId = async () => {
    try {
      let id = askId.id;
      const response = await axiosInstance.get(`/api/member/ask/${id}`);
      setData(response.data.data.ask);

      console.log("deep", response.data?.data.ask);
      setResponse(response.data.data.response);
      console.log(response);

    } catch (error) {
      console.log(error.message);
    }
  };

  //   useEffect(()=>{
  // console.log("this is data 1",data1)
  //   },[data1])

  const changeStatus = async (status) => {
    try {
      let id = askId.id;
      const response = await axiosInstance.put(`/api/member/ask/${id}`, {
        status: status
      });
      // setData(response.data.data.ask);
      // setResponse(response.data.data.response);
      if (response.status == 200) {
        handleClose()
        if (status === "CANCEL") {
          enqueueSnackbar(" Query delete successfully")
          navigate(-1)
        }
        else {
          getAskbyId();
          enqueueSnackbar(" Query solved successfully")
        }
      }

    } catch (error) {
      console.log(error.message);
      enqueueSnackbar("Please try again!", {
        variant: 'error'
      })
    }
  };


  useEffect(() => {
    console.log(askId.id);
  }, [askId])

  const date = new Date(data.created_at);
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getMonth()];
  const formattedDate = `${day} ${month} ${year}`;

  let [comment, setComment] = useState("");



  const handleCommentSubmit = async () => {
    // Validate the comment field
    if (!comment.trim()) {
      enqueueSnackbar("Comment is required!", { variant: 'warning' });
      return;
    }

    try {
      const response = await axiosInstance.post('/api/member/ask/reponse/add', {
        askId: askId.id,
        description: comment,
      });
      getAskbyId();
      setComment(""); // Clear the input after successful submission
      enqueueSnackbar('Successfully added your request!', { variant: 'success' });
    } catch (error) {
      console.error("Server error:", error.message);
      enqueueSnackbar("An error occurred while processing your request. Please try again later.", { variant: 'error' });
    }
  };

  let formatedate = (creatat) => {
    const date = new Date(creatat);
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    return (`${day} ${month} ${year}`);
  }

  const handleCommentChange = (el) => {
    setComment(el.target.value);
  };


  const [open, setOpen] = useState(false);
  const [deleteconfirm, setDeleteconfirm] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteconfirm(false)
  };


  const renderSocials = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Card>
        <Box sx={{ display: { xs: "block", sm: "flex" }, justifyContent: "space-between" }}>
          <CardHeader title={`Title : ${data.title}`} sx={{ pb: 1 }} />
          <Box pt={{ xs: 0, sm: 3 }}>
            {isself && <Box sx={{ px: 2, py: { xs: 1, sm: 0 } }}>
              <Button
                size="small"
                color="error"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={() => setDeleteconfirm(true)}
              >
                Remove
              </Button>
            </Box>}
            <Dialog
              open={deleteconfirm}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Is Your Query Resolved?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this question?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button variant='contained' color="error" onClick={handleClose}>Disagree</Button>
                <Button variant='contained' color="success" onClick={() => changeStatus("CANCEL")} autoFocus>
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
        <Typography sx={{ color: "black", fontWeight: "600", pl: 3 }}>
          {`Descriptiopn : ${data.description}`}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ px: 3, pb: 2, display: { xs: "block", sm: "flex" } }}>
          <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
            <Typography variant='body2' sx={{ pt: 1 }}>Name : {data?.createdBy?.full_name}</Typography>
            <Typography variant='body2' sx={{ pt: 1 }}>Mobile No : {data?.createdBy?.Contact_no}</Typography>
            <Typography variant='body2' sx={{ pt: 1 }}> {formattedDate}</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "start", sm: "end" }, justifyContent: "end", width: { xs: "100%", sm: "50%" }, py: { xs: 1, sm: 0 } }}>
            <Label
              variant="soft"
              color={
                (data?.status === 'completed' && 'success') ||
                (data?.status === "PENDING" && 'warning') ||
                (data?.status === 'cancelled' && 'error') ||
                'default'
              }
              sx={{ width: "80px" }}
            >
              {data.status}
            </Label>
          </Box>
        </Box>
      </Card>
      {isself && <Card sx={{ py: 1, px: 3, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "10px" }}>
        <Typography>If solve your problems </Typography>
        <Switch variant="success" disabled={data.status === "SOLVED"} checked={data.status === "SOLVED"} color="success" onChange={() => handleClickOpen()} />
      </Card>}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Is Your Query Resolved?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            We hope your query has been addressed to your satisfaction. Please confirm if your issue has been resolved.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color="error" onClick={handleClose}>Disagree</Button>
          <Button variant='contained' color="success" onClick={() => changeStatus("SOLVED")} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      {!isself && <Card>
        <CardHeader title={`Add Commnet`} />

        <Stack spacing={2} sx={{ p: 3 }}>
          <InputBase
            onChange={handleCommentChange}
            value={comment}
            multiline
            fullWidth
            rows={4}
            placeholder="Share what you are thinking here..."
            sx={{ p: 2, mb: 1, borderRadius: 1, border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`, }}
          />
          <Box textAlign="end">
            <Button
              variant="contained"
              onClick={handleCommentSubmit}
              disabled={!comment.trim()} // Disable button if comment is empty
            >
              Post
            </Button>
          </Box>
        </Stack>
      </Card>}

    </Box>
  );

  useEffect(() => {
    getAskbyId()
  }, [])
  return (
    <Grid container spacing={3} sx={{ p: 5 }}>
      <Grid xs={12} md={6}>
        <Stack spacing={3}>

          {renderSocials}
        </Stack>
      </Grid>

      <Grid xs={12} md={6}>
        <Stack spacing={3} sx={{ display: "flex", flexDirection: "column" }}>
          {response?.map((el, i) => (
            <Card sx={{ p: 3 }} key={i}>
              <Box sx={{ display: { xs: "block", sm: "flex" }, justifyContent: "space-between", pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: "center", gap: 2 }}>
                  <Avatar alt="Cindy Baker" src={el?.respondedBy?.profile_picture} />
                  {/* <Typography variant='h6' sx={{ pl: 1 }}>{el?.respondedBy?.full_name}</Typography> */}
                  <ListItemText
                    primary={el?.respondedBy?.full_name}
                    secondary={
                      formatedate(el?.createdAt)}
                    primaryTypographyProps={{ typography: 'body2' }}
                    secondaryTypographyProps={{
                      component: 'span',
                      color: 'text.disabled',
                    }}
                  />
                </Box>

              </Box>
              <Divider />
              <Box sx={{ pl: { xs: 0, sm: 6 }, pt: 2, }}>
                <Typography variant='body1' color="#919EAB">{el?.description}</Typography>
              </Box>
            </Card>
          ))}

        </Stack>
      </Grid>
    </Grid>
  );
}

AskHelps.propTypes = {
  info: PropTypes.object,
  posts: PropTypes.array,
};
