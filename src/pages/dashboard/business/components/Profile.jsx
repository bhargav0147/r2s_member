import { useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useReactToPrint } from 'react-to-print';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { _userFeeds } from 'src/_mock';
import { useAuthContext } from 'src/auth/hooks';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import ProfileCover from 'src/sections/user/profile-cover';
import ProfileGallery from 'src/sections/user/profile-gallery';
import ProfileHome from 'src/sections/user/profile-home';

const TABS = [
  {
    value: 'profile',
    label: 'Profile',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  // {
  //   value: 'followers',
  //   label: 'Followers',
  //   icon: <Iconify icon="solar:heart-bold" width={24} />,
  // },
  // {
  //   value: 'friends',
  //   label: 'Friends',
  //   icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
  // },
  {
    value: 'gallery',
    label: 'Gallery',
    icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
  },
];

const Profile = () => {
  const settings = useSettingsContext();
  const { user } = useAuthContext();

  const { id } = useParams();

  const business_profile = user?.Business_Profile[0];


  const [currentTab, setCurrentTab] = useState('profile');

  const handleChangeTab = useCallback((event, newValue) => setCurrentTab(newValue), []);

  const pdfRef = useRef();
  const downloadPDF = useReactToPrint({
    content: () => pdfRef.current,
  });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="My Business"
        links={[
          { name: 'Dashboard', href: paths.findBusiness },
          { name: 'My Business', href: paths.myBusiness },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          role={
            business_profile?.Bussiness_type === 'Others'
              ? business_profile?.otherType
              : business_profile?.Bussiness_type?.split('_')?.join(' ')
          }
          name={business_profile?.bussiness_name}
          avatarUrl={user?.profile_picture}
          coverUrl={
            business_profile?.business_cover_image ||
            'https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_4.jpg'
          }
          id={id}
          memberId={user?.memberid}
          is_premium={user?.is_premium}
          downloadPDF={downloadPDF}
          pdfRef={pdfRef}
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'profile' && (
        <ProfileHome
          pdfRef={pdfRef}
          info={business_profile}
          user={{
            name: user?.full_name,
            role: user?.Job_title,
            profilePhoto: user?.profile_picture,
            contact: user?.Contact_no
          }}
          posts={_userFeeds}
          id={id}
          email={user?.email_id}
        />
      )}

      {/* {currentTab === 'followers' && <ProfileFollowers followers={_userFollowers} />}

      {currentTab === 'friends' && (
        <ProfileFriends
          friends={_userFriends}
          searchFriends={searchFriends}
          onSearchFriends={handleSearchFriends}
        />
      )} */}

      {currentTab === 'gallery' && <ProfileGallery businessProfile={business_profile} />}
    </Container>
  );
};

export default Profile;
