import Layout from "../components/Layout";
import db from '../utils/db';
import Gastronomy from "../models/Gastronomy";
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import ProductItem from "../components/ProductItem";
import { Grid, Typography } from "@mui/material";
import { useSnackbar } from 'notistack';

export default function ServicesScreen(props) {
    const { gastronomy } = props;
	const { state, dispatch } = useContext(Store);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	
	const addToCartHandler = async (product) => {
        closeSnackbar();
		const existItem = state.cart.cartItems.find((x) => x._id === product._id);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/${product._id}`);
		
		if (data.countInStock < quantity) {
			enqueueSnackbar('Извините, товар закончился', { variant: 'error' });
			return;
		}
			dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
			enqueueSnackbar('Товар успешно добален в корзину', { variant: 'success' });
	};
    return (
        <Layout title='Гастрономия'> 
            <div className="center">
                <Typography variant="h4">Гастрономия</Typography>
                <Grid container spacing={3} sx={{marginTop: '20px'}}>
                    {gastronomy.map((product) => (
                        <Grid item md={3} key={product._id}>
                            <ProductItem product={product} addToCartHandler={addToCartHandler}/>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </Layout>
    )
}

export async function getServerSideProps() {
	await db.connect();
	const gastronomy = await Gastronomy.find({}).lean();
	await db.disconnect();
	return {
		props: {
			gastronomy: gastronomy.map(db.convertDocToObj),
		},
	};
}