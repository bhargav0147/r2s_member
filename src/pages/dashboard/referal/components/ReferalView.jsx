import { useState } from 'react';
import { FaCopy } from 'react-icons/fa';

import { Alert, LoadingButton } from '@mui/lab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';

import MembershipView from '../../membership/components/MembershipView';
// ----------------------------------------------------------------------

export default function ReferalView() {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const shareLink = () => {
    // Replace this URL with the link you want to share
    const linkToShare = `https://member.return2success.com/auth/jwt/register?ref=${user?.referal_id}`;
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

  const [copied, setCopied] = useState(false);
  function copyLink() {
    setCopied(true);
    const link = `https://member.return2success.com/auth/jwt/register?ref=${user?.referal_id}`;
    navigator.clipboard.writeText(link);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Referral"
        links={[{ name: 'Dashboard', href: paths.findBusiness }, { name: 'Referral' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {user?.is_premium ? (
        <Card
          sx={{
            mt: 5,
            width: 1,
            borderRadius: 2,
            border: (theme) => `solid 1px ${theme.palette.divider}`,
            backgroundColor: '#fff',
            p: 3,
            width: '80%',
            '@media screen and (max-width: 600px)': {
              width: '100%',
              p: 2,
            },
          }}
        >
          <Typography variant="h4" gutterBottom>
            How to use referral?
          </Typography>

          <ol style={{ color: '#637381', fontSize: '0.93rem' }}>
            <li style={{ marginBottom: 10 }}>
              <strong>Master Referral Earnings:</strong> For each new user directly referred through
              your referral link, known as a 'Master Referral', you will earn INR 500.
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong>Multi-Level Referral System:</strong>
              <ul>
                <li>
                  <strong>Level 1 Referral:</strong> Earn INR 100 for each new member referred by
                  your Master Referral.
                </li>
                <li>
                  <strong>Level 2 Referral:</strong> Earn INR 100 for each new member referred by a
                  Level 1 Referral.
                </li>
                <li>
                  <strong>Level 3 Referral:</strong> Earn INR 100 for each new member referred by a
                  Level 2 Referral.
                </li>
                <li>
                  <strong>Level 4 Referral:</strong> Earn INR 100 for each new member referred by a
                  Level 3 Referral.
                </li>
              </ul>
            </li>

          </ol>

          <Stack
            flexWrap="wrap"
            direction="row"
            justifyContent="space-between"
            just
            sx={{ mt: 5 }}
          >
            <Alert
              severity={copied ? 'success' : 'info'}
              style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
            >
              {`https://member.return2success.com/auth/jwt/register?ref=${user?.referal_id}`}
              <IconButton onClick={copyLink} size="small" aria-label="delete">
                <FaCopy />
              </IconButton>
            </Alert>

            <LoadingButton
              sx={{ m: 1, mr: 0 }}
              variant="contained"
              loading={false}
              onClick={shareLink}
            >
              Refer Link
            </LoadingButton>
          </Stack>
        </Card>
      ) : (
        <MembershipView />
      )}
    </Container>
  );
}
