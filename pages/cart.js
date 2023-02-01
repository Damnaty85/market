import React, { useContext } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Grid, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, Typography, Card, List, ListItem, Button } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';

function CartScreen() {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;

    const updateCartHandler = async (item, quantity) => {
        
        const { data } = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
    };
    
    const removeItemHandler = (item) => {
        dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    };

    const checkoutHandler = () => {
        router.push('/shipping');
    };

    return (
        <Layout title="Корзина">
            <div className='center'>
                <Typography variant="h4">Корзина</Typography>
                {cartItems.length === 0 ? (
                    <div>Корзина пустая. <Link href="/">К покупкам</Link></div>
                ) : (
                    <Grid container spacing={1}>
                        <Grid item md={9} xs={12}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Товар</TableCell>
                                            <TableCell align="right">Количество</TableCell>
                                            <TableCell align="right">Цена</TableCell>
                                            <TableCell align="right">Цена без акции</TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cartItems.map((item) => (
                                            <TableRow key={item._id}>
                                                <TableCell>
                                                    <Link href={`/product/${item.slug}`} style={{display: 'flex', alignItems: 'center'}}>
                                                            <Image src={item.image} alt={item.name} width={50} height={50}></Image>
                                                            <Typography>{item.name}</Typography>
                                                    </Link>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Select value={item.quantity} onChange={(evt) =>updateCartHandler(item, evt.target.value)}>
                                                        {[...Array(item.countInStock).keys()].map((x) => (
                                                            <MenuItem key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </TableCell>
                                                <TableCell align="right">{item.new_price ? item.new_price : item.price} руб.</TableCell>
                                                <TableCell align="right">{item.price} руб.</TableCell>
                                                <TableCell align="right">
                                                    <Button variant="contained" color="secondary" onClick={() => removeItemHandler(item)}>x</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <Card>
                                <List>
                                    <ListItem>
                                        <Typography>
                                            Итого ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '} items) : {cartItems.reduce((a, c) => a + c.quantity * (c.new_price ? c.new_price : c.price), 0)} руб.
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Button variant="contained" color="primary" fullWidth onClick={checkoutHandler}>К оплате</Button>
                                    </ListItem>
                                </List>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </div>
        </Layout>
    );
}


export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });