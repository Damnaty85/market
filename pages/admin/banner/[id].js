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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
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

function BannerEdit({ params }) {
    const bannerId = params.id;
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
                    const { data } = await axios.get(`/api/admin/banners/${bannerId}`, {
                        headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS' });
                setValue('title', data.title);
                setValue('image', data.image);
                setValue('description', data.description);
                setValue('link', data.link);
                setValue('button_text', data.button_text);
                setValue('link_all_banner', data.link_all_banner);
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
            enqueueSnackbar('Картинка успешно обновлена', { variant: 'success' });
        } catch (err) {
            dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    };

    const submitHandler = async ({
        title,
        image,
        description,
        link,
        button_text,
        link_all_banner
      }) => {
        closeSnackbar();
        try {
            await axios.put(
                `/api/admin/banners/${bannerId}`, {
                    title,
                    image,
                    description,
                    link,
                    button_text,
                    link_all_banner
                },
                { headers: { authorization: `Bearer ${userInfo.token}` } }
            );
            dispatch({ type: 'UPDATE_SUCCESS' });
            enqueueSnackbar('Баннер успешно обновлен', { variant: 'success' });
        } catch (err) {
            dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    };
   return (
        <Layout title={`Редактирование баннера ${bannerId}`}>
            <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <SidePanelAdmin />
                </Grid>
                <Grid item md={9} xs={12}>
                    <Card>
                        <List>
                            <ListItem>
                                <Typography variant="h6">
                                    Редактирование продукта {bannerId}
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
                                                name="title"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: false,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="title"
                                                        label="Заголовок в баннере"
                                                        error={Boolean(errors.title)}
                                                        helperText={errors.title ? 'Название не обязательно' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller 
                                                name="button_text"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: false,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="button_text"
                                                        label="Текст кнопки"
                                                        error={Boolean(errors.button_text)}
                                                        helperText={errors.button_text ? 'Текст кнопки не обязателен' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller 
                                                name="link"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: false,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="link"
                                                        label="Ссылка на страницу"
                                                        error={Boolean(errors.link)}
                                                        helperText={errors.link ? '' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="link_all_banner"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: false,
                                                }}
                                                render={({ field }) => (
                                                    <FormControl fullWidth>
                                                        <InputLabel id="link_all_banner" sx={{backgroundColor: 'white', padding: '0 5px'}}>Сделать баннер ссылкой</InputLabel>
                                                        <Select
                                                            variant="outlined"
                                                            fullWidth
                                                            id="link_all_banner"
                                                            error={Boolean(errors.link_all_banner)}
                                                            helperText={
                                                            errors.link_all_banner
                                                                ? ''
                                                                : ''
                                                            }
                                                            {...field}
                                                        >
                                                            <MenuItem value={false}>Нет</MenuItem>
                                                            <MenuItem value={true}>Да</MenuItem>
                                                        </Select>
                                                    </FormControl>
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
                                                        label="Картинка"
                                                        error={Boolean(errors.image)}
                                                        helperText={errors.image ? 'Картинка обязательна' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Button variant="contained" component="label">
                                                Загрузить картинку
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
                                                        label="Описание"
                                                        error={Boolean(errors.description)}
                                                        helperText={
                                                        errors.description
                                                            ? 'Описание обязательно'
                                                            : ''
                                                        }
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Button variant="contained" type="submit" fullWidth color="primary" >Обновить</Button>
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

export default dynamic(() => Promise.resolve(BannerEdit), { ssr: false });