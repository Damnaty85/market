import Layout from "../components/Layout";
import { Button, Typography } from "@mui/material";
import db from "../utils/db";
import Product from "../models/Product";
import ProductItem from "../components/ProductItem";
import axios from 'axios';
import { useContext, useRef } from 'react';
import { Store } from '../utils/Store';
import { useSnackbar } from 'notistack';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Home(props) {
	const swiperRef = useRef();
	const { popularProducts, newProducts } = props;

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
		<Layout>
			{
				newProducts.length > 0 ? 
					<>
						<Typography variant="h5" sx={{marginBottom: '20px'}}>Новые товары</Typography>
						<Swiper
							spaceBetween={20}
							slidesPerView={4}
							navigation
							autoplay
							pagination={{ clickable: true }}
							scrollbar={{ draggable: true }}
							style={{padding: '30px 0'}}
							modules={[Navigation]}
							onBeforeInit={(swiper) => {
								swiperRef.current = swiper;
							}}
						>
							{newProducts.map((product) => (
								<SwiperSlide key={product.name}>
									<ProductItem
										product={product}
										addToCartHandler={addToCartHandler}
									/>
								</SwiperSlide>
							))}
							<div style={{width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'flex-end'}}>
								<Button onClick={() => swiperRef.current?.slidePrev()}><ArrowBackIosNewIcon/></Button>
								<Button onClick={() => swiperRef.current?.slideNext()}><ArrowForwardIosIcon/></Button>
							</div>
						</Swiper>
					</>
				: ''
			}
			{
				popularProducts.length > 0 ? 
					<>
						<Typography variant="h5" sx={{marginBottom: '20px'}}>Популярные товары</Typography>
						<Swiper
							spaceBetween={20}
							slidesPerView={4}
							navigation
							autoplay
							pagination={{ clickable: true }}
							scrollbar={{ draggable: true }}
							style={{padding: '30px 0'}}
						>
							{popularProducts.map((product) => (
								<SwiperSlide key={product.name}>
									<ProductItem
										product={product}
										addToCartHandler={addToCartHandler}
									/>
								</SwiperSlide>
							))}
						</Swiper>
					</>
				: ''
			}
		</Layout>
	)
}


export async function getServerSideProps() {
	await db.connect();
	const popularProducts = await Product.find({ popular: true }, '').lean().limit();
	const newProducts = await Product.find({ new_products: true }, '').lean().limit();	
	await db.disconnect();
	return {
		props: {
			popularProducts: popularProducts.map(db.convertDocToObj),
			newProducts: newProducts.map(db.convertDocToObj),
		},
	};
}