import { Grid, List, Typography, ListItem, Card, Button } from '@mui/material';
import Image from 'next/image';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import db from '../../utils/db';
import axios from 'axios';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';

export default function ProductScreen(props) {
    const { product } = props;
    const { state, dispatch } = useContext(Store);
    const router = useRouter();

    if (!product) {
      return <div>Продукт не найден</div>;
    }

    const addToCartHandler = async () => {
        const existItem = state.cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;

        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock <= quantity) {
            window.alert('Простите. Товар закончился');
            return;
        }
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

        router.push('/cart');
    };

    return (
        <Layout title={product.name} description={product.description}>
            <div className='center'>
                <Grid container spacing={2} sx={{marginTop: '40px'}}>
                    <Grid item xs={3}>
                        <Image src={product.image} alt={product.name} width={320} height={600}></Image>
                    </Grid>
                    <Grid item xs={6}>
                        <List>
                            <ListItem><Typography variant="h5">{product.name}</Typography></ListItem>
                            <ListItem><Typography>Вид: {product.category}</Typography></ListItem>
                            {product.brand && <ListItem><Typography>Бренд: {product.brand}</Typography></ListItem>}
                            {product.volume && <ListItem><Typography>Обьем, л: {product.volume}</Typography></ListItem>}
                            {product.percentage && <ListItem><Typography>Алкоголь,%: {product.percentage}</Typography></ListItem>}
                            {product.sort && <ListItem><Typography>Сорт винограда: {product.sort}</Typography></ListItem>}
                            {product.type_product && <ListItem><Typography>Тип: {product.type_product}</Typography></ListItem>}
                            {product.country && <ListItem><Typography>Страна: {product.country}</Typography></ListItem>}
                            {product.shugar && <ListItem><Typography>Сахар: {product.shugar}</Typography></ListItem>}
                            <ListItem>
                                <Typography>Описание: {product.description}</Typography>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <List>
                                <ListItem>
                                    <Grid container>
                                        <Grid item xs={6}><Typography variant="h6">Цена</Typography></Grid>

                                        <Grid item xs={6}>
                                        {
                                            product.new_price > 1 ?
                                                <div>
                                                    <Typography variant="h6"
                                                        sx={{
                                                            color: 'grey',
                                                            textDecoration: 'line-through',
                                                            marginBottom: '-10px'
                                                        }}
                                                    >
                                                        {product.price} руб.
                                                    </Typography>
                                                    <Typography variant="h6" sx={{display: 'flex', fontWeight: '600'}}>
                                                        {product.new_price} руб.
                                                        <Typography
                                                            variant="span"
                                                            sx={{
                                                                display: 'flex',
                                                                marginLeft: '10px', 
                                                                alignItems: 'center', 
                                                                backgroundColor: '#d32f2f', 
                                                                borderRadius: '30px',
                                                                color: 'white',
                                                                fontSize: '12px',
                                                                lineHeight: '12px',
                                                                height: '20px',
                                                                padding: '0 10px'
                                                        }}>{Math.ceil(100 - (product.price/product.new_price) * 100)}%</Typography>
                                                    </Typography>
                                                </div>
                                                : <Typography variant="h6" sx={{fontWeight: '600'}}>{product.price} руб.</Typography>
                                        }
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                {/* <ListItem>
                                    <Grid container>
                                        <Grid item xs={6}><Typography>Статус</Typography></Grid>
                                        <Grid item xs={6}>
                                            <Typography>
                                                {product.countInStock > 0 ? 'В наличии' : 'Не в наличии'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem> */}
                                <ListItem>
                                    <Button fullWidth variant="contained" color="primary" onClick={addToCartHandler}>Купить</Button>
                                </ListItem>
                            </List>
                        </Card>
                    </Grid>
                </Grid>
                {/* <Link href='/products'><Typography>К покупкам</Typography></Link> */}
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const { params } = context;
    const { slug } = params;
    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();
    return {
        props: {
            product: db.convertDocToObj(product),
        },
    };
}