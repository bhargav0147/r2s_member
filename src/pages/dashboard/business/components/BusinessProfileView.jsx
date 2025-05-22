import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

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



const BusinessProfileView = () => {


  const [filterDay, setFilterDay] = useState("all")
  const settings = useSettingsContext();
  const { user } = useAuthContext();

  const { id } = useParams();
  const [details, setDetails] = useState({});




  const getBusinessDetails = async () => {
    try {
      const { data } = await axios.get(endpoints.business?.fetchDetails(id));
      setDetails(data?.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBusinessDetails();
    console.log(details)
  }, [id]);

  const business_profile = user?.Business_Profile[0];

  const [currentTab, setCurrentTab] = useState('profile');

  const handleChangeTab = useCallback((event, newValue) => setCurrentTab(newValue), []);

  const createFeedback = async (formData) => {
    try {
      const { data } = await axios.post(endpoints?.createFeedback);

      if (data?.data?.success) {

        getBusinessDetails()

      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>

      {/* header */}
      <CustomBreadcrumbs
        heading="Business Details"
        links={[
          { name: 'Dashboard', href: paths.findBusiness },
          { name: 'Find Business', href: paths.findBusiness },
          { name: details?.bussiness_name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* business card */}


      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          role={
            details?.result?.Bussiness_type === 'Others'
              ? details?.result?.otherType
              : details?.result?.Bussiness_type?.split('_')?.join(' ')
          }
          name={details?.result?.bussiness_name}
          avatarUrl={details?.result?.business_logo}
          coverUrl={
            details?.result?.business_cover_image ||
            'https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_4.jpg'
          }
          id={id}
          info={details}
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
          info={details?.result}
          user={{
            name: details?.result?.Member?.full_name,
            role: details?.result?.Member?.Job_title,
            profilePhoto: details?.result?.Member?.profile_picture,
          }}
          createFeedback={createFeedback}
          posts={_userFeeds}
          id={id}
          getBusinessDetails={getBusinessDetails}
          averageRating={details?.averageRating}
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

      {currentTab === 'gallery' && <ProfileGallery businessProfile={details?.result} />}
    </Container>
  );
};

export default BusinessProfileView;
