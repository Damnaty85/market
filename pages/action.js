import Layout from "../components/Layout";
import db from '../utils/db';
import Product from '../models/Product';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import ProductItem from "../components/ProductItem";
import { Grid, Typography } from "@mui/material";
import { useSnackbar } from 'notistack';
import Gastronomy from "../models/Gastronomy";
import GroceryProduct from "../components/GastronomyProduct";

export default function ProductsScreen(props) {
	const { state, dispatch } = useContext(Store);
	const { products, gastronomy } = props;
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
        <Layout title='Акции в нашем магазине'> 
            <div className="center">
                <Typography variant="h4">Акции</Typography>
                <Grid container spacing={3} sx={{marginTop: '20px'}}>
                    {products.map((product) => (
                        <Grid item md={3} key={product._id}>
                            <ProductItem product={product} addToCartHandler={addToCartHandler}/>
                        </Grid>
                    ))}
					{gastronomy.map((product) => (
                        <Grid item md={3} key={product._id}>
                            <GroceryProduct product={product}/>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </Layout>
    )
}

export async function getServerSideProps() {
	await db.connect();
	const products = await Product.find({new_price: { $gte: 1}}, '').lean();
	const gastronomy = await Gastronomy.find({new_price: { $gte: 1}}, '').lean();
	await db.disconnect();
	return {
		props: {
			products: products.map(db.convertDocToObj),
			gastronomy: gastronomy.map(db.convertDocToObj),
		},
	};
}