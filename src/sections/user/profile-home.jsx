import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

// import CardOverflow from '@mui/material/CardOverflow';

import { Avatar, Rating } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { fNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

import { useSnackbar } from 'notistack';
import { MdPhone } from 'react-icons/md';
import { useQuery } from 'react-query';
import axiosInstance from 'src/utils/axios';
import ProfilePostItem from './profile-post-item';

// ----------------------------------------------------------------------

export default function ProfileHome({ info, id, email, pdfRef, isProfile, user, getBusinessDetails, averageRating }) {
  const fileRef = useRef(null);

  const { enqueueSnackbar } = useSnackbar();


  const theme = useTheme();

  const address = info?.addresses?.length ? info?.addresses[0] : null;


  const renderFollows = (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        <Stack width={1}>
          {fNumber(averageRating)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Ratings
          </Box>
        </Stack>

        <Stack width={1}>
          {fNumber(info?.BusinessFeedback?.length)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Total Reviews
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  const renderAbout = (
    <Card>
      <CardHeader title="About" />

      <CardHeader
        avatar={<Avatar alt={user?.name || user?.full_name} src={user?.profilePhoto || user?.profile_picture} />}
        title={user?.name || user?.full_name}
        subheader={user?.role}
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ typography: 'body2' }}>{info?.description}</Box>

        {address ? (
          <Stack direction="row" spacing={2}>
            <Iconify icon="mingcute:location-fill" width={24} />
            <Box sx={{ typography: 'body2' }}>
              <Link variant="subtitle2" color="inherit">
                {address?.address_line_1 && `${address?.address_line_1}, `}
                {address?.address_line_2 && `${address?.address_line_2}, `}
                {address?.area && `${address?.area}, `}
                {address?.city}, {address?.state}, India, {address?.pincode}
              </Link>
            </Box>
          </Stack>
        ) : null}

        <Stack direction="row" sx={{ typography: 'body2', justifyContent: "start", alignItems: "center", fontWeight: "semiBold" }} >
          <Box mr={2}>
            <MdPhone size={24} />
          </Box>
          {info?.Member?.Contact_no || user?.contact}
        </Stack>
        <Stack direction="row" sx={{ typography: 'body2' }}>
          <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
          {email || info?.Member?.email_id}
        </Stack>

        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-business-center" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {info?.role} {`business hours `}
            <Link variant="subtitle2" color="inherit">
              {info?.business_hour}
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const getReviews = async () => {
    const { data } = await axiosInstance.get(
      `/api/member/feedback/business?type=bussiness&id=${id || info?.id}&page=1&perpage=10`
    );
    return data?.data;
  };

  const {
    data: reviews,
    isLoading,
    error,
    refetch,
  } = useQuery(`review${id || info?.id}`, getReviews, {
    staleTime: 60000,
    cacheTime: 3600000,
  });

  const handleReview = async () => {
    try {
      const { data } = await axiosInstance.post(`/api/member/feedback/business/add/${id}`, {
        comment,
        rating,
        type: 'bussiness',
      });
      if (data.success) {
        getBusinessDetails();
        setRating(0),
          setComment(""),
          refetch();
        enqueueSnackbar('Review submitted successfully', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
    }
  };

  const [errors, setErrors] = useState({});

  const renderPostInput = (
    <Card sx={{ p: 3 }}>
      <InputBase
        multiline
        fullWidth
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your valuable feedback..."
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 1,
          border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
        }}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Rating
          name="read-only"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />

        <Button onClick={handleReview} variant="contained">
          Submit
        </Button>
      </Stack>

      <input ref={fileRef} type="file" style={{ display: 'none' }} />
    </Card>
  );

  const renderSocials = (
    <Card>
      <CardHeader title="Social" />
      <Stack spacing={2} sx={{ p: 3 }}>
        {info?.Social_Link?.facebook ? (
          <Stack spacing={2} direction="row" sx={{ wordBreak: 'break-all', typography: 'body2' }}>
            <Iconify
              icon="eva:facebook-fill"
              width={24}
              sx={{
                flexShrink: 0,
                color: '#1877F2',
              }}
            />
            <Link
              target="_blank"
              component={RouterLink}
              href={info?.Social_Link?.facebook}
              color="inherit"
            >
              {info?.Social_Link?.facebook}
            </Link>
          </Stack>
        ) : null}

        {info?.Social_Link?.instagram ? (
          <Stack spacing={2} direction="row" sx={{ wordBreak: 'break-all', typography: 'body2' }}>
            <Iconify
              icon="ant-design:instagram-filled"
              width={24}
              sx={{
                flexShrink: 0,
                color: '#DF3E30',
              }}
            />
            <Link
              target="_blank"
              component={RouterLink}
              href={info?.Social_Link?.instagram}
              color="inherit"
            >
              {info?.Social_Link?.instagram}
            </Link>
          </Stack>
        ) : null}

        {info?.Social_Link?.linkedin ? (
          <Stack spacing={2} direction="row" sx={{ wordBreak: 'break-all', typography: 'body2' }}>
            <Iconify
              icon="eva:linkedin-fill"
              width={24}
              sx={{
                flexShrink: 0,
                color: '#006097',
              }}
            />
            <Link
              target="_blank"
              component={RouterLink}
              href={info?.Social_Link?.linkedin}
              color="inherit"
            >
              {info?.Social_Link?.linkedin}
            </Link>
          </Stack>
        ) : null}

        {info?.Social_Link?.twitter ? (
          <Stack spacing={2} direction="row" sx={{ wordBreak: 'break-all', typography: 'body2' }}>
            <Iconify
              icon="eva:twitter-fill"
              width={24}
              sx={{
                flexShrink: 0,
                color: '#1C9CEA',
              }}
            />
            <Link
              target="_blank"
              component={RouterLink}
              href={info?.Social_Link?.twitter}
              color="inherit"
            >
              {info?.Social_Link?.twitter}
            </Link>
          </Stack>
        ) : null}

        {info?.Social_Link?.youtube ? (
          <Stack spacing={2} direction="row" sx={{ wordBreak: 'break-all', typography: 'body2' }}>
            <Iconify
              icon="mdi:youtube"
              width={24}
              sx={{
                flexShrink: 0,
                color: '#CD201F',
              }}
            />
            <Link
              component={RouterLink}
              target="_blank"
              href={info?.Social_Link?.youtube}
              color="inherit"
            >
              {info?.Social_Link?.youtube}
            </Link>
          </Stack>
        ) : null}
      </Stack>
    </Card>
  );

  const BusinessCard = (
    <Box
      sx={{ mt: -10, display: 'none' }}
    // sx={{
    //   minHeight: 400,
    //   ...bgGradient({
    //     color: alpha(theme.palette.primary.darker, 0.8),
    //     imgUrl:
    //       info?.business_cover_image ||
    //       'https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_4.jpg',
    //   }),
    //   height: 1,
    // }}
    >
      <Card ref={pdfRef} sx={{ maxWidth: 500, mx: 'auto', mt: 10 }}>
        <Stack sx={{ p: 3, pb: 2 }} alignItems="center">
          <img
            width={220}
            src={theme.palette.mode === 'dark' ? '/logo/logo-dark.png' : '/logo/logo.png'}
            alt="logo"
          />
        </Stack>

        <CardHeader
          avatar={<Avatar alt={info?.bussiness_name} src={info?.business_logo} />}
          title={info?.bussiness_name}
          subheader={info?.Bussiness_type}
          sx={{ mb: 3 }}
        />
        <Divider />
        <CardHeader
          avatar={<Avatar alt={user?.name} src={user?.profilePhoto} />}
          title={user?.name}
          subheader={user?.role}
        />

        <Stack spacing={2} sx={{ p: 3 }}>
          <Box sx={{ typography: 'body2' }}>{info?.description}</Box>

          {address ? (
            <Stack direction="row" spacing={2}>
              <Iconify icon="mingcute:location-fill" width={24} />

              <Box sx={{ typography: 'body2' }}>
                {`at `}
                <Link variant="subtitle2" color="inherit">
                  {address?.area ? `${address?.area}, ` : ''} {address?.city}, {address?.state},
                  India, {address?.pincode}
                </Link>
              </Box>
            </Stack>
          ) : null}

          {address?.address_line_1 ? (
            <Stack direction="row" spacing={2}>
              <Iconify icon="mingcute:location-fill" width={24} />

              <Box sx={{ typography: 'body2' }}>
                {`primary address `}
                <Link variant="subtitle2" color="inherit">
                  {address?.address_line_1}
                </Link>
              </Box>
            </Stack>
          ) : null}

          {address?.address_line_2 ? (
            <Stack direction="row" spacing={2}>
              <Iconify icon="mingcute:location-fill" width={24} />

              <Box sx={{ typography: 'body2' }}>
                {`primary address `}
                <Link variant="subtitle2" color="inherit">
                  {address?.address_line_2}
                </Link>
              </Box>
            </Stack>
          ) : null}

          <Stack direction="row" sx={{ typography: 'body2' }}>
            <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
            {email || info?.Member?.email_id}
          </Stack>

          <Stack direction="row" spacing={2}>
            <Iconify icon="ic:round-business-center" width={24} />

            <Box sx={{ typography: 'body2' }}>
              {info?.role} {`business hours `}
              <Link variant="subtitle2" color="inherit">
                {info?.business_hour}
              </Link>
            </Box>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Stack spacing={3}>
          {renderFollows}

          {renderAbout}

          {info?.Social_Link?.instagram ||
            info?.Social_Link?.linkedin ||
            info?.Social_Link?.twitter ||
            info?.Social_Link?.youtube ||
            info?.Social_Link?.facebook
            ? renderSocials
            : null}

          {!id ? BusinessCard : null}
        </Stack>
      </Grid>

      <Grid xs={12} md={8}>
        <Stack spacing={3}>
          {(id && (user.memberid !== id)) ? renderPostInput : null}

          {reviews?.map((post) => (
            <ProfilePostItem key={post.id} post={post} />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}

ProfileHome.propTypes = {
  info: PropTypes.object,
  posts: PropTypes.array,
  id: PropTypes.string,
  email: PropTypes.string,
  user: PropTypes.object
};
