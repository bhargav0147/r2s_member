import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import axiosInstance from 'src/utils/axios';

import { countries } from 'src/assets/data';

import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AddressNewForm({ open, onClose, refetch }) {
  const NewAddressSchema = Yup.object().shape({
    name: Yup.string().required('Fullname is required'),
    phone: Yup.string().required('Phone number is required'),
    address_line_1: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    pincode: Yup.string().required('Zip code is required'),
    // not required
    type: Yup.string(),
    primary: Yup.boolean(),
  });

  const defaultValues = {
    name: '',
    city: '',
    state: '',
    address_line_1: '',
    pincode: '',
    phone: '',
    type: 'HOME',
    country: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axiosInstance.post('/api/member/ecommerce/address/add', data);
      console.log(response.data);
      refetch();
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>New address</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <RHFRadioGroup
              row
              name="type"
              options={[
                { label: 'Home', value: 'HOME' },
                { label: 'Office', value: 'OFFICE' },
              ]}
            />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Full Name" />

              <RHFTextField name="phone" label="Phone Number" />
            </Box>

            <RHFTextField name="address_line_1" label="Address" />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name="city" label="Town / City" />

              <RHFTextField name="state" label="State" />

              <RHFTextField name="pincode" label="Zip/Code" />
            </Box>

            <RHFAutocomplete
              name="country"
              label="Country"
              options={countries.map((country) => country.label)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => {
                const { code, label, phone } = countries.filter(
                  (country) => country.label === option
                )[0];

                if (!label) {
                  return null;
                }

                return (
                  <li {...props} key={label}>
                    <Iconify
                      key={label}
                      icon={`circle-flags:${code.toLowerCase()}`}
                      width={28}
                      sx={{ mr: 1 }}
                    />
                    {label} ({code}) +{phone}
                  </li>
                );
              }}
            />

            {/* <RHFCheckbox name="primary" label="Use this address as default." /> */}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Deliver to this Address
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

AddressNewForm.propTypes = {
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  open: PropTypes.bool,
};
