import Layout from "../components/Layout";
import { Box, Button, Typography, Tabs, Tab } from "@mui/material";
import db from "../utils/db";
import Banner from "../models/Banner";
import Product from "../models/Product";
import ProductItem from "../components/ProductItem";
import axios from 'axios';
import { useContext, useRef, useState } from 'react';
import { Store } from '../utils/Store';
import { useSnackbar } from 'notistack';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from "swiper";
import 'swiper/css';
// import 'swiper/css/pagination';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Link from "next/link"
import Image from "next/image";


function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export default function Home(props) {
	const swiperRef = useRef();
	const swiperBannerRef = useRef();

	const [value, setValue] = useState(0);
	
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const { popularProducts, newProducts, actionProducts , banners } = props;

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
				banners.length > 0 ? 
					<>
						<Swiper
							className="banner__slider"
							spaceBetween={0}
							slidesPerView={1}
							navigation
							speed={1500}
							autoplay={{
								delay: 5000,
								disableOnInteraction: false,
							}}
							loop={true}
							modules={[Autoplay, Pagination, Navigation]}
							pagination={{ clickable: true }}
							scrollbar={{ draggable: true }}
							style={{marginBottom: '40px'}}
							onBeforeInit={(swiper) => {
								swiperBannerRef.current = swiper;
							}}
						>
							{banners.map((banner) => (
								<SwiperSlide key={banner._id}>
									<div className="banner__slide">
										{banner.link_all_banner && <Link className="banner__link" href={banner.link}></Link>}
										<div className="banner__title">
											<Typography variant="h3" sx={{color: 'white'}}>{banner.title}</Typography>
										</div>
										<div className="banner__description">
											<Typography variant="h4" sx={{color: 'white'}}>{banner.description}</Typography>
										</div>
										{
											!banner.link_all_banner &&
											<Link href={banner.link}>
												<Button variant="outlined" sx={{color: 'white', borderColor: 'white'}}>{banner.button_text}</Button>
											</Link>
										}
										<div className="banner__image">
											<Image src={banner.image} alt={banner.title} width="1920" height='600'></Image>
										</div>
									</div>
								</SwiperSlide>
							))}
							{
								banners.length > 1 &&
								<div style={{width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'flex-end'}}>
									<Button onClick={() => swiperBannerRef.current?.slidePrev()}><ArrowBackIosNewIcon/></Button>
									<Button onClick={() => swiperBannerRef.current?.slideNext()}><ArrowForwardIosIcon/></Button>
								</div>
							}
						</Swiper>
					</>
				: ''
			}
			<div className="center">
				<Box sx={{ width: '100%' }}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
							{newProducts && <Tab label="Акционные товары" {...a11yProps(0)} />}
							{newProducts && <Tab label="Новые товары" {...a11yProps(1)} />}
							{popularProducts && <Tab label="Популярные товары" {...a11yProps(2)} />}
						</Tabs>
					</Box>
					{newProducts &&
						<TabPanel value={value} index={0}>
							<Swiper
								autoHeight={true}
								spaceBetween={20}
								slidesPerView={4}
								navigation
								autoplay
								pagination={{ clickable: true }}
								scrollbar={{ draggable: true }}
								modules={[Autoplay, Pagination, Navigation]}
								style={{padding: '30px 0'}}
							>
								{actionProducts.map((product) => (
									<SwiperSlide key={product._id}>
										<ProductItem
											product={product}
											addToCartHandler={addToCartHandler}
										/>
									</SwiperSlide>
								))}
							</Swiper>
						</TabPanel>
					}
					{newProducts && 
						<TabPanel value={value} index={1}>
							<Swiper
								autoHeight={true}
								spaceBetween={20}
								slidesPerView={4}
								navigation
								speed={1500}
								autoplay={{
									delay: 3000,
									disableOnInteraction: false,
								}}
								pagination={{ clickable: true }}
								scrollbar={{ draggable: true }}
								style={{padding: '30px 0'}}
								modules={[Autoplay, Pagination, Navigation]}
								onBeforeInit={(swiper) => {
									swiperRef.current = swiper;
								}}
							>
								{newProducts.map((product) => (
									<SwiperSlide key={product._id}>
										<ProductItem
											product={product}
											addToCartHandler={addToCartHandler}
										/>
									</SwiperSlide>
								))}
								{
									newProducts.length > 4 &&
									<div style={{width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'flex-end'}}>
										<Button onClick={() => swiperRef.current?.slidePrev()}><ArrowBackIosNewIcon/></Button>
										<Button onClick={() => swiperRef.current?.slideNext()}><ArrowForwardIosIcon/></Button>
									</div>
								}
							</Swiper>
						</TabPanel>
					}
					{popularProducts && 
						<TabPanel value={value} index={2}>
							<Swiper
								autoHeight={true}
								spaceBetween={20}
								slidesPerView={4}
								navigation
								autoplay
								pagination={{ clickable: true }}
								scrollbar={{ draggable: true }}
								modules={[Autoplay, Pagination, Navigation]}
								style={{padding: '30px 0'}}
							>
								{popularProducts.map((product) => (
									<SwiperSlide key={product._id}>
										<ProductItem
											product={product}
											addToCartHandler={addToCartHandler}
										/>
									</SwiperSlide>
								))}
							</Swiper>
						</TabPanel>
					}
				</Box>
			</div>
		</Layout>
	)
}


export async function getServerSideProps() {
	await db.connect();
	const banners = await Banner.find({}).lean();
	const popularProducts = await Product.find({ popular: true }, '').lean().limit();
	const newProducts = await Product.find({ new_products: true }, '').lean().limit();
	const actionProducts = await Product.find({new_price: { $gte: 1}}, '').lean();	
	await db.disconnect();
	return {
		props: {
			banners: banners.map(db.convertDocToObj),
			popularProducts: popularProducts.map(db.convertDocToObj),
			actionProducts: actionProducts.map(db.convertDocToObj),
			newProducts: newProducts.map(db.convertDocToObj),
		},
	};
}