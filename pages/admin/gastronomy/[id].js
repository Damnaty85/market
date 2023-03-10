import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useContext, useReducer } from 'react';
import {
    Grid,
    List,
    ListItem,
    Typography,
    Card,
    Button,
    TextField,
    CircularProgress,
} from '@mui/material';
import { getError } from '../../../utils/error';
import { Store } from '../../../utils/Store';
import Layout from '../../../components/Layout';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import SidePanelAdmin from '../../../components/SidePanelAdmin';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true, errorUpdate: '' };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false, errorUpdate: '' };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false, errorUpdate: action.payload };
        case 'UPLOAD_REQUEST':
            return { ...state, loadingUpload: true, errorUpload: '' };
        case 'UPLOAD_SUCCESS':
            return {
                ...state,
                loadingUpload: false,
                errorUpload: '',
            };
        case 'UPLOAD_FAIL':
            return { ...state, loadingUpload: false, errorUpload: action.payload };
        default:
            return state;
    }
}

function ProductEdit({ params }) {
    const productId = params.id;
    const { state } = useContext(Store);
    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
     });
    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue,
    } = useForm();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const { userInfo } = state;

    useEffect(() => {
        if (!userInfo) {
        return router.push('/login');
        } else {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                    const { data } = await axios.get(`/api/admin/gastronomy/${productId}`, {
                        headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS' });
                setValue('name', data.name);
                setValue('slug', data.slug);
                setValue('category', data.category);
                setValue('image', data.image);
                setValue('price', data.price);
                setValue('new_price', data.new_price);
                setValue('brand', data.brand);
                setValue('countInStock', data.countInStock);
                setValue('description', data.description);
                setValue('composition', data.composition);
                setValue('shelf_life', data.shelf_life);
                setValue('storage_rules', data.storage_rules);
                setValue('weight', data.weight);
                setValue('weight_unit', data.weight_unit);
                setValue('country', data.country);
                setValue('weight_unit', data.weight_unit);
                setValue('appearance', data.appearance);
                setValue('color', data.color);
                setValue('product_date', data.product_date);
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
        }
    }, []);

    const uploadHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        
        try {
            dispatch({ type: 'UPLOAD_REQUEST' });
            const { data } = await axios.post('/api/admin/upload', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${userInfo.token}`,
                },
            });
          
            dispatch({ type: 'UPLOAD_SUCCESS' });
            setValue('image', data.secure_url);
            enqueueSnackbar('???????????????? ?????????????? ??????????????????', { variant: 'success' });
        } catch (err) {
            dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    };

    const submitHandler = async ({
        name,
        slug,
        category,
        image,
        price,
        new_price,
        brand,
        countInStock,
        description,
        composition,
        shelf_life,
        storage_rules,
        weight,
        weight_unit,
        country,
        appearance,
        color,
        product_date
      }) => {
        closeSnackbar();
        try {
            await axios.put(
                `/api/admin/gastronomy/${productId}`, {
                    name,
                    slug,
                    category,
                    image,
                    price,
                    new_price,
                    brand,
                    countInStock,
                    description,
                    composition,
                    shelf_life,
                    storage_rules,
                    weight,
                    weight_unit,
                    country,
                    appearance,
                    color,
                    product_date
                },
                { headers: { authorization: `Bearer ${userInfo.token}` } }
            );
            dispatch({ type: 'UPDATE_SUCCESS' });
            enqueueSnackbar('?????????? ?????????????? ????????????????', { variant: 'success' });
        } catch (err) {
            dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    };
   return (
        <Layout title={`???????????????????????????? ???????????????? ${productId}`}>
            <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <SidePanelAdmin />
                </Grid>
                <Grid item md={9} xs={12}>
                    <Card>
                        <List>
                            <ListItem>
                                <Typography variant="h6">
                                    ???????????????????????????? ???????????????? {productId}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                {loading && <CircularProgress></CircularProgress>}
                                {error && (
                                    <Typography>{error}</Typography>
                                )}
                            </ListItem>
                            <ListItem>
                                <form onSubmit={handleSubmit(submitHandler)} style={{width: '100%'}}>
                                    <List>
                                        <ListItem>
                                            <Controller 
                                                name="name"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="name"
                                                        label="???????????????? ????????????"
                                                        error={Boolean(errors.name)}
                                                        helperText={errors.name ? '???????????????? ??????????????????????' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="slug"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="slug"
                                                        label="???????????????????? ??????"
                                                        error={Boolean(errors.slug)}
                                                        helperText={errors.slug ? '???????????????????? ?????? ??????????????????????' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="price"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="price"
                                                        label="????????"
                                                        error={Boolean(errors.price)}
                                                        helperText={errors.price ? '???????? ??????????????????????' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="new_price"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: false,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="new_price"
                                                        label="?????????????????? ????????"
                                                        error={Boolean(errors.new_price)}
                                                        helperText={errors.new_price ? '?????????????????? ???????? ??????????????????????' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="category"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="category"
                                                        label="??????????????????"
                                                        error={Boolean(errors.category)}
                                                        helperText={
                                                        errors.category ? '?????????????????? ??????????????????????' : ''
                                                        }
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <div style={{display: 'flex'}}>
                                            <ListItem>
                                                <Controller
                                                    name="weight"
                                                    control={control}
                                                    defaultValue=""
                                                    rules={{
                                                        required: false,
                                                    }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            variant="outlined"
                                                            fullWidth
                                                            id="weight"
                                                            label="??????"
                                                            error={Boolean(errors.weight)}
                                                            helperText={
                                                            errors.weight ? '?????? ??????????????????????' : ''
                                                            }
                                                            {...field}
                                                        ></TextField>
                                                    )}
                                                ></Controller>
                                            </ListItem>
                                            <ListItem>
                                                <Controller
                                                    name="weight_unit"
                                                    control={control}
                                                    defaultValue=""
                                                    rules={{
                                                        required: false,
                                                    }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            variant="outlined"
                                                            fullWidth
                                                            id="weight_unit"
                                                            label="?????????????? ?????????????????? ????????"
                                                            error={Boolean(errors.weight_unit)}
                                                            helperText={
                                                            errors.weight_unit ? '?????????????? ?????????????????? ???????? ??????????????????????' : ''
                                                            }
                                                            {...field}
                                                        ></TextField>
                                                    )}
                                                ></Controller>
                                            </ListItem>
                                        </div>
                                        <ListItem>
                                            <Controller
                                                name="color"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: false,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="color"
                                                        label="????????"
                                                        error={Boolean(errors.color)}
                                                        helperText={
                                                        errors.color ? '???????? ??????????????????????' : ''
                                                        }
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="composition"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: false,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="composition"
                                                        label="???????????? ????????????????"
                                                        error={Boolean(errors.composition)}
                                                        helperText={
                                                        errors.composition ? '???????????? ???????????????? ??????????????????????' : ''
                                                        }
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="shelf_life"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: false,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="shelf_life"
                                                        label="???????? ???????????????? ????????????????"
                                                        error={Boolean(errors.shelf_life)}
                                                        helperText={
                                                        errors.shelf_life ? '???????? ???????????????? ???????????????? ??????????????????????' : ''
                                                        }
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="product_date"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: false,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="product_date"
                                                        label="???????? ???????????????????????? ????????????????"
                                                        error={Boolean(errors.product_date)}
                                                        helperText={
                                                        errors.product_date ? '???????? ???????????????????????? ???????????????? ??????????????????????' : ''
                                                        }
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="appearance"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: false,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="appearance"
                                                        label="?????????????? ?????? ????????????????"
                                                        error={Boolean(errors.appearance)}
                                                        helperText={
                                                        errors.appearance ? '?????????????? ?????? ???????????????? ??????????????????????' : ''
                                                        }
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="storage_rules"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: false,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="storage_rules"
                                                        label="?????????????? ???????????????? ????????????????"
                                                        error={Boolean(errors.storage_rules)}
                                                        helperText={
                                                        errors.sort ? '?????????????? ???????????????? ???????????????? ??????????????????????' : ''
                                                        }
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="country"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: false,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="country"
                                                        label="???????????? ??????????????????????????"
                                                        error={Boolean(errors.country)}
                                                        helperText={
                                                        errors.country ? '???????????? ?????????????????????????? ??????????????????????' : ''
                                                        }
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="brand"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: false,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="brand"
                                                        label="??????????"
                                                        error={Boolean(errors.brand)}
                                                        helperText={errors.brand ? '?????????? ??????????????????????' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="countInStock"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="countInStock"
                                                        label="???????????????????? ???? ????????????"
                                                        error={Boolean(errors.countInStock)}
                                                        helperText={
                                                        errors.countInStock
                                                            ? '???????????????????? ??????????????????????'
                                                            : ''
                                                        }
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="image"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="image"
                                                        label="????????????????"
                                                        error={Boolean(errors.image)}
                                                        helperText={errors.image ? '???????????????? ??????????????????????' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Button variant="contained" component="label">
                                                ?????????????????? ????????????????
                                                <input type="file" onChange={uploadHandler} hidden />
                                            </Button>
                                            {loadingUpload && <CircularProgress />}
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="description"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        multiline
                                                        id="description"
                                                        label="????????????????"
                                                        error={Boolean(errors.description)}
                                                        helperText={
                                                        errors.description
                                                            ? '???????????????? ??????????????????????'
                                                            : ''
                                                        }
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Button variant="contained" type="submit" fullWidth color="primary" >????????????????</Button>
                                            {loadingUpdate && <CircularProgress />}
                                        </ListItem>
                                    </List>
                                </form>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}

export async function getServerSideProps({ params }) {
    return {
        props: { params },
    };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });