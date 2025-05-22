import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

export default function UserEditView({ id }) {
  const settings = useSettingsContext();

  const currentUser = _userList.find((user) => user.id === id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <UserNewEditForm currentUser={currentUser} />
    </Container>
  );
}

UserEditView.propTypes = {
  id: PropTypes.string,
};
