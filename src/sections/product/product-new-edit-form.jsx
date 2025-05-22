import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { useParams, useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import axiosInstance, { endpoints } from 'src/utils/axios';

import FormProvider, { RHFTextField, RHFUpload } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function ProductNewEditForm({ currentProduct, isService }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();



  const [includeTaxes, setIncludeTaxes] = useState(false);

  const NewProductSchema = Yup.object().shape({
    title: Yup.string().required('Name is required'),
    images: Yup.array().min(1, 'Images is required'),
    // tags: Yup.array().min(2, 'Must have at least 2 tags'),
    // category: Yup.string().required('Category is required'),
    price: !isService ? Yup.number().min(0, 'Price should not be $0.00').lessThan(Yup.ref('originalPrice'), 'Price should be lower than original price') : Yup.number().moreThan(0, 'Price should not be $0.00'),
    description: Yup.string().required('Description is required'),
    // not required
    // taxes: Yup.number(),
    // newLabel: Yup.object().shape({
    //   enabled: Yup.boolean(),
    //   content: Yup.string(),
    // }),
    // saleLabel: Yup.object().shape({
    //   enabled: Yup.boolean(),
    //   content: Yup.string(),
    // }),
  });






  const defaultValues = useMemo(
    () => ({
      title: currentProduct?.title || '',
      description: currentProduct?.description || '',
      subDescription: currentProduct?.subDescription || '',
      images: currentProduct?.images || [],
      originalprice: currentProduct?.originalPrice || 0,
      //
      // code: currentProduct?.code || '',
      // sku: currentProduct?.sku || '',
      price: currentProduct?.price || 0,
      // quantity: currentProduct?.quantity || 0,
      // priceSale: currentProduct?.priceSale || 0,
      // tags: currentProduct?.tags || [],
      // taxes: currentProduct?.taxes || 0,
      // gender: currentProduct?.gender || '',
      // category: currentProduct?.category || '',
      // colors: currentProduct?.colors || [],
      // sizes: currentProduct?.sizes || [],
      // newLabel: currentProduct?.newLabel || { enabled: false, content: '' },
      // saleLabel: currentProduct?.saleLabel || { enabled: false, content: '' },
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });


  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue('taxes', 0);
    } else {
      setValue('taxes', currentProduct?.taxes || 0);
    }

  }, [currentProduct?.taxes, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (data) => {


    try {
      const cloudinaryResponses = [];

      for (const image of data.images) {
        const form = new FormData();
        form.append('file', image);
        form.append('upload_preset', 'bymtctem');
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dfznwn1fr/image/upload',
          form
        );
        cloudinaryResponses.push(response.data);
      }

      const imagesData = cloudinaryResponses.map((response) => ({
        link: response.url,
        key: response.public_id,
      }));

      let response;
      if (!id && isService) {
        response = await axiosInstance.post('/api/member/ecommerce/service/add', {
          images: imagesData,
          title: data?.title,
          description: data?.description,
          price: data?.price,
          taxes: data?.taxes,
        });
        queryClient.invalidateQueries('services');
      } else if (!id && !isService) {
        response = await axiosInstance.post('/api/member/ecommerce/product/add', {
          images: imagesData,
          title: data?.title,
          description: data?.description,
          price: data?.price,
          taxes: data?.taxes,
          originalPrice: data?.originalPrice,
        });
        queryClient.invalidateQueries('products');
      } else if (id && isService) {
        response = await axiosInstance.put(`/api/member/ecommerce/service/${id}`, {
          images: imagesData,
          title: data?.title,
          description: data?.description,
          price: data?.price,
          taxes: data?.taxes,
        });
        queryClient.invalidateQueries('services');
      } else if (id && !isService) {
        response = await axiosInstance.put(`/api/member/ecommerce/product/${id}`, {
          images: imagesData,
          title: data?.title,
          description: data?.description,
          price: data?.price,
          taxes: data?.taxes,
          originalPrice: data?.originalPrice,
        });
        queryClient.invalidateQueries('products');
      }

      reset();
      enqueueSnackbar(id ? 'Update success!' : 'Add success!');

      router.push('/ecommerce');

    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  const handleChangeIncludeTaxes = useCallback((event) => {
    setIncludeTaxes(event.target.checked);
  }, []);


  useEffect(() => {
    if (id) {
      fetchSingleData();
    }
  }, [id]);


  const fetchSingleData = async () => {


    let Response;

    try {

      if (isService) {
        Response = await axiosInstance.get(endpoints.getSingleService(id));
        setValue('title', Response.data?.data?.title || "")
        setValue('description', Response.data?.data?.description || "")
        setValue('price', Response.data?.data?.price || "")

        const imagePaths = Response.data?.data?.pictures.map((image) => image?.image_url)
        setValue('images', imagePaths || [])
      } else {
        Response = await axiosInstance.get(endpoints.getSingleProduct(id));
        setValue('title', Response.data?.data?.title || "")
        setValue('description', Response.data?.data?.description || "")
        setValue('price', Response.data?.data?.price || "")
        setValue('originalPrice', Response.data?.data?.originalPrice || "")
        const imagePaths = Response.data?.data?.pictures.map((image) => image?.image_url)
        setValue('images', imagePaths || [])
      }

    } catch (error) {
      console.log(error)
    }
  }


  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="title" label="Name" />

            <RHFTextField name="description" label="Description" multiline rows={4} />

            {/* <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <RHFEditor simple name="subDescription" />
            </Stack> */}

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Images</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
              // onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              {/* <RHFTextField name="code" label="Product Code" /> */}

              {/* <RHFTextField name="sku" label="Product SKU" /> */}

              {/* <RHFTextField
                name="quantity"
                label="Quantity"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              /> */}

              {/* <RHFSelect native name="category" label="Category" InputLabelProps={{ shrink: true }}>
                {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                  <optgroup key={category.group} label={category.group}>
                    {category.classify.map((classify) => (
                      <option key={classify} value={classify}>
                        {classify}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </RHFSelect>

              <RHFMultiSelect
                checkbox
                name="colors"
                label="Colors"
                options={PRODUCT_COLOR_NAME_OPTIONS}
              /> */}

              {/* <RHFMultiSelect checkbox name="sizes" label="Sizes" options={PRODUCT_SIZE_OPTIONS} /> */}
            </Box>
            {/*
            <RHFAutocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            /> */}

            {/* <Stack spacing={1}>
              <Typography variant="subtitle2">Gender</Typography>
              <RHFMultiCheckbox row name="gender" spacing={2} options={PRODUCT_GENDER_OPTIONS} />
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} /> */}

            {/* <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="saleLabel.content"
                label="Sale Label"
                fullWidth
                disabled={!values.saleLabel.enabled}
              />
            </Stack> */}

            {/* <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="newLabel.content"
                label="New Label"
                fullWidth
                disabled={!values.newLabel.enabled}
              />
            </Stack> */}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Pricing
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Price related inputs
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Pricing" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {/* <RHFTextField
              name="price"
              label="Regular Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            /> */}


            {!isService ? <RHFTextField
              name="originalPrice"
              label="Original Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      ₹
                    </Box>
                  </InputAdornment>
                ),
              }}
            /> : null}

            <RHFTextField
              name="price"
              label="Sale Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      ₹
                    </Box>
                  </InputAdornment>
                ),
              }}
            />



            {/* <FormControlLabel
              control={<Switch checked={includeTaxes} onChange={handleChangeIncludeTaxes} />}
              label="Price includes taxes"
            /> */}

            {/* {!includeTaxes && (
              <RHFTextField
                name="taxes"
                label="Tax (%)"
                placeholder="0.00"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        %
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )} */}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>

          {id ? (!isService ? 'Update Product' : 'Update Service') : (isService ? 'Create Service' : 'Create Product')}


        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {/* {renderProperties} */}

        {renderPricing}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
