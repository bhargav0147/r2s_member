import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

import axios, { endpoints } from 'src/utils/axios';

import { _userFeeds } from 'src/_mock';
import { useAuthContext } from 'src/auth/hooks';

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

const PersonProfileView = () => {
  const settings = useSettingsContext();
  const { user } = useAuthContext();

  const { id } = useParams();
  const [details, setDetails] = useState({
    Business_Profile: [],
  });

  const [alldata, setAllData] = useState({})


  const getBusinessDetails = async () => {
    try {
      const { data } = await axios.get(endpoints.sharedProfile(id));

      setDetails(data?.data?.results);
      setAllData(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBusinessDetails();
  }, [id]);

  const business_profile = user?.Business_Profile[0];

  const [currentTab, setCurrentTab] = useState('profile');

  const handleChangeTab = useCallback((event, newValue) => setCurrentTab(newValue), []);

  const createFeedback = async (formData) => {
    try {
      const { data } = await axios.post(endpoints?.createFeedback);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          role={
            details?.Business_Profile[0]?.Bussiness_type === 'Others'
              ? details?.Business_Profile[0]?.otherType
              : details?.Business_Profile[0]?.Bussiness_type?.split('_')?.join(' ')
          }
          name={details?.Business_Profile[0]?.bussiness_name}
          avatarUrl={details?.profile_picture}
          coverUrl={
            details?.Business_Profile[0]?.business_cover_image
          }
          id={id}
          info={details.Business_Profile[0]}
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
          isProfile
          email={details?.email_id}
          info={details?.Business_Profile[0]}
          createFeedback={createFeedback}
          posts={_userFeeds}
          id={id}
          user={{ ...details, contact: details.Contact_no }}
          averageRating={alldata.averageRating}
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

      {currentTab === 'gallery' && (
        <ProfileGallery businessProfile={details?.Business_Profile[0]} />
      )}
    </Container>
  );
};

export default PersonProfileView;
