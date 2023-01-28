import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useEffect, useContext, useReducer } from 'react';
import {
    CircularProgress,
    Grid,
    List,
    ListItem,
    Typography,
    Card,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';
import Layout from '../../components/Layout';
import { useSnackbar } from 'notistack';
import SidePanelAdmin from '../../components/SidePanelAdmin';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, products: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true };
        case 'CREATE_SUCCESS':
            return { ...state, loadingCreate: false };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true };
        case 'DELETE_SUCCESS':
            return { ...state, loadingDelete: false, successDelete: true };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
        state;
    }
}

function AdminDashboard() {
    const { state } = useContext(Store);
    const router = useRouter();
    const { userInfo } = state;

    const [
            { loading, error, products, loadingCreate, successDelete, loadingDelete },
            dispatch,
        ] = useReducer(reducer, {
        loading: true,
        products: [],
        error: '',
    });

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        }
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/admin/gastronomy`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
          } else {
            fetchData();
          }
    }, [successDelete]);

    const { enqueueSnackbar } = useSnackbar();
   
    const createHandler = async () => {
        if (!window.confirm('Создать новый товар?')) {
            return;
        }
        
        try {
            dispatch({ type: 'CREATE_REQUEST' });
            const { data } = await axios.post(
                `/api/admin/gastronomy`,
                {}, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({ type: 'CREATE_SUCCESS' });
            enqueueSnackbar('Товар успешно создан', { variant: 'success' });
            router.push(`/admin/gastronomy/${data.product._id}`);
        } catch (err) {
            dispatch({ type: 'CREATE_FAIL' });
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    };
   
     const deleteHandler = async (productId) => {
        if (!window.confirm('Вы уверены что хотите удалить товар?')) {
            return;
        }
     
        try {
            dispatch({ type: 'DELETE_REQUEST' });
            await axios.delete(`/api/admin/gastronomy/${productId}`, {
                headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch({ type: 'DELETE_SUCCESS' });
            enqueueSnackbar('Товар удален', { variant: 'success' });
        } catch (err) {
            dispatch({ type: 'DELETE_FAIL' });
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
   };

   return (
        <Layout title="Администрирование товаров">
            <div className='center'>
                <Grid container spacing={1}>
                    <Grid item md={3} xs={12}>
                        <SidePanelAdmin />
                    </Grid>
                    <Grid item md={9} xs={12}>
                        <Card>
                            <List>
                                <ListItem>
                                <Grid container alignItems="center">
                                    <Grid item xs={6}>
                                        <Typography variant="h6">
                                            Товары
                                        </Typography>
                                        {loadingDelete && <CircularProgress />}
                                    </Grid>
                                    <Grid align="right" item xs={6}>
                                        <Button
                                            onClick={createHandler}
                                            color="success"
                                            variant="contained"
                                        >
                                            Добавить новый товар                                    
                                        </Button>
                                        {loadingCreate && <CircularProgress />}
                                    </Grid>
                                </Grid>
                                </ListItem>
                                <ListItem>
                                    {loading ? (
                                        <CircularProgress />
                                    ) : error ? (
                                        <Typography>{error}</Typography>
                                    ) : (
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>ID</TableCell>
                                                        <TableCell>ИМЯ</TableCell>
                                                        <TableCell>ЦЕНА</TableCell>
                                                        <TableCell>АКЦИЯ</TableCell>
                                                        <TableCell>КАТЕГОРИЯ</TableCell>
                                                        <TableCell>ВЕС</TableCell>
                                                        <TableCell sx={{width: '255px'}}></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {products.map((product) => (
                                                        <TableRow key={product._id}>
                                                            <TableCell>
                                                                {product._id.substring(20, 24)}
                                                            </TableCell>
                                                            <TableCell>{product.name}</TableCell>
                                                            <TableCell>{product.price} руб.</TableCell>
                                                            <TableCell>{product.new_price} руб.</TableCell>
                                                            <TableCell>{product.category}</TableCell>
                                                            <TableCell>{product.weight}{product.weight_unit}</TableCell>
                                                            <TableCell sx={{width: '255px'}}>
                                                                <Link href={`/admin/gastronomy/${product._id}`}>
                                                                    <Button size="small" variant="contained">Редактировать</Button>
                                                                </Link>{' '} 
                                                                <Button size="small" variant="outlined" color="error" onClick={() => deleteHandler(product._id)}>Удалить</Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </ListItem>
                            </List>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });