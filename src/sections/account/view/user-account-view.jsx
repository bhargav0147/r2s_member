import { useCallback, useState } from 'react';

import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';
import MembershipView from 'src/pages/dashboard/membership/components/MembershipView';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import ProfileGallery from '../../user/profile-gallery';
import AccountAddress from '../account-address';
import AccountBankDetail from '../account-bank-detail';
import AccountChangePassword from '../account-change-password';
import AccountGeneral from '../account-general';
import AccountShippingFee from '../account-shipping-fee';
import AccountSocialLinks from '../account-social-links';
import BussinessGeneral from '../business-genral';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'business',
    label: 'Business',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'bank',
    label: 'Bank Detail',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'Address',
    label: 'Address',
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  },
  {
    value: 'social',
    label: 'Social links',
    icon: <Iconify icon="solar:share-bold" width={24} />,
  },
  {
    value: 'gallery',
    label: 'Gallery',
    icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
  },
  {
    value: 'security',
    label: 'Security',
    icon: <Iconify icon="ic:round-vpn-key" width={22} />,
  },
  {
    value: 'Shipping',
    label: 'Shipping',
    icon: <Iconify icon="solar:bill-list-bold" width={22} />,
  },
];

// ----------------------------------------------------------------------

export default function AccountView() {
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const { user } = useAuthContext();



  const businessProfile = user?.Business_Profile[0];
  const Bank_Detail = user?.Bank_Detail[0];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Manage Business"
        links={[
          { name: 'Dashboard', href: paths.findBusiness },
          { name: 'Manage Business', href: paths.manageBusiness },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {user?.is_premium ? (
        <>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>

          {currentTab === 'general' && <AccountGeneral />}
          {currentTab === 'business' && <BussinessGeneral />}
          {currentTab === 'bank' && <AccountBankDetail Bank_Detail={Bank_Detail} />}

          {currentTab === 'Address' && (
            <AccountAddress
              personalAdress={user?.addresses[0]}
              businessAddress={user?.Business_Profile[0]?.addresses}
            />
          )}

          {currentTab === 'social' && (
            <AccountSocialLinks socialLinks={businessProfile?.Social_Link} />
          )}

          {currentTab === 'security' && <AccountChangePassword />}
          {currentTab === 'Shipping' && <AccountShippingFee />}
          {currentTab === 'gallery' && <ProfileGallery businessProfile={businessProfile} isManageBusiness />}
        </>
      ) : (
        <MembershipView />
      )}
    </Container>
  );
}
