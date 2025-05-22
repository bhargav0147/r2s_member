import PropTypes from 'prop-types';
import { useState } from 'react';
import { IoIosGlobe, IoMdDownload, IoMdShareAlt } from 'react-icons/io';
import { MdPhone } from 'react-icons/md';

import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

export default function ProfileCover({
  name,
  avatarUrl,
  role,
  coverUrl,
  id,
  memberId,
  is_premium,
  info,

  downloadPDF,
  pdfRef,
}) {
  const theme = useTheme();

  const shareLink = () => {
    // Replace this URL with the link you want to share
    const linkToShare = `/member/${memberId}`;
    const message = `Some thing`;

    // Use the Web Share API to share the link
    if (navigator.share) {
      navigator
        .share({
          title: 'Share this link',
          text: message,
          url: linkToShare,
        })
        .then(() => console.log('Link shared successfully'))
        .catch((error) => console.error('Error sharing link:', error));
    }
  };

  function redirectToContact() {
    const telUri = `tel:+91${info?.Contact_no}`;
    window.location.href = telUri;
  }
  function redirectToWebsite() {
    window.open(info?.website_link, '_blank');
  }

  const [loading, setLoading] = useState(false);


  return (
    <>
      <Box
        sx={{
          ...bgGradient({
            color: alpha(theme.palette.primary.darker, 0.8),
            imgUrl: coverUrl,
          }),
          height: 1,
          color: 'common.white',
        }}
      >
        <Stack
          sx={{
            justifyContent: { xs: 'space-between', md: 'end' },
            position: 'absolute',
            width: '100%',
          }}
          direction="row"
          p={2}
          gap={2}
        >
          {id ? (
            <>
              <Button onClick={redirectToContact} startIcon={<MdPhone />} variant="outlined">
                Contact
              </Button>

              {info?.website_link ? (
                <Button
                  onClick={redirectToWebsite}
                  endIcon={<IoIosGlobe />}
                  variant="contained"
                  color="secondary"
                >
                  Website
                </Button>
              ) : null}
            </>
          ) : is_premium ? (
            <>
              <LoadingButton
                loading={loading}
                onClick={downloadPDF}
                startIcon={<IoMdDownload />}
                variant="outlined"
              >
                Download
              </LoadingButton>
              <Button
                onClick={shareLink}
                endIcon={<IoMdShareAlt />}
                variant="contained"
                color="secondary"
              >
                Share
              </Button>
            </>
          ) : null}
        </Stack>

        {/* <PrintTemplate pdfRef={pdfRef} /> */}

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            left: { md: 24 },
            bottom: { md: 24 },
            zIndex: { md: 10 },
            pt: { xs: 6, md: 0 },
            position: { md: 'absolute' },
          }}
        >
          <Avatar
            src={avatarUrl}
            alt={name}
            sx={{
              mx: 'auto',
              width: { xs: 64, md: 128 },
              height: { xs: 64, md: 128 },
              border: `solid 2px ${theme.palette.common.white}`,
            }}
          />

          <ListItemText
            sx={{
              mt: 3,
              ml: { md: 3 },
              textAlign: { xs: 'center', md: 'unset' },
            }}
            primary={name}
            secondary={role}
            primaryTypographyProps={{
              typography: 'h4',
            }}
            secondaryTypographyProps={{
              mt: 0.5,
              color: 'inherit',
              component: 'span',
              typography: 'body2',
              sx: { opacity: 0.48 },
            }}
          />
        </Stack>
      </Box>
    </>
  );
}

ProfileCover.propTypes = {
  avatarUrl: PropTypes.string,
  coverUrl: PropTypes.string,
  name: PropTypes.string,
  role: PropTypes.string,
  info: PropTypes.object,
  id: PropTypes.string,
  memberId: PropTypes.string,
  is_premium: PropTypes.bool,
  downloadPDF: PropTypes.func
};
