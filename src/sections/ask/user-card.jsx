import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';

import { _socials } from 'src/_mock';
import { AvatarShape } from 'src/assets/illustrations';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { width } from '@mui/system';
import { useRouter } from 'src/routes/hooks';
import { useNavigate } from 'react-router';

// ----------------------------------------------------------------------

export default function UserCard({ ask , isself }) {
  const theme = useTheme();

  const { id, title, description, status, isDeleted, created_at, responses, createdBy } = ask;
  const { full_name, Contact_no } = createdBy

  const router = useNavigate();

  const handleClickItem = () => {
    const   data = {ask};

    // console.log(isself , "this is sekf check")
    isself ?     router(`/myask/${id}`, { state: { data, isself : isself } }) :    router(`/ask/${id}`, { state: { data } });
  };

  return (
    <Box  onClick={() => handleClickItem()}>

      <Card sx={{ textAlign: 'start', p: "24px" }}>
        <ListItemText
          sx={{ mb: 1 }}
          // primary={name}
          primary={`Title : ${title}`}
          primaryTypographyProps={{ typography: 'subtitle1' }}
          secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
        />
        <Typography
          sx={{
            fontSize: "14px", color: "#637381", mb: 2,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            lineClamp: 2,
          }}
        >
          {`Description : ${description}`}
        </Typography>


        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          sx={{ py: 3, typography: 'subtitle1', justifyContent: "space-between" }}
        >
          <Box sx={{ textAlign: "start" }}>
            <Box sx={{ display: "flex", pb: '2px' }}>
              <Iconify icon="material-symbols-light:person" />
              <Typography sx={{ fontSize: "14px", color: "637381", pl: 1 }}> {full_name}</Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Iconify icon="ic:round-phone" width="19px" />
             <Typography sx={{ fontSize: "14px", color: "637381", pl: 1 }}>{Contact_no}</Typography>
            </Box>
          </Box>
          <Box sx={{ display:"flex",justifyContent:"end",alignItems:"end" }}>
            {/* <Typography sx={{ fontSize: "14px", color: "637381", pb: 1 }}>response : {responses}</Typography> */}
            <Label
              variant="soft"
              color={
                (status === 'completed' && 'success') ||
                (status === "PENDING" && 'warning') ||
                (status === 'cancelled' && 'error') ||
                'default'
              }
              sx={{ width: "80px" }}
            >
              {status}
            </Label>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

UserCard.propTypes = {
  user: PropTypes.object,
};
