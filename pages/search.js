import {
    Box,
    Button,
    FormControl,
    Grid,
    List,
    ListItem,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import CancelIcon from '@mui/icons-material//Cancel';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../components/Layout';
import db from '../utils/db';
import Product from '../models/Product';
import ProductItem from '../components/ProductItem';
import { Store } from '../utils/Store';
import axios from 'axios';
 
const PAGE_SIZE = 100;
 
const prices = [
    {
        name: '1 руб. to 80 руб.',
        value: '1-80',
    },
    {
        name: '81 руб. to 200 руб.',
        value: '81-200',
    },
    {
        name: '201 руб. to 1000 руб.',
        value: '201-1000',
    },
];
 
export default function Search(props) {
    const router = useRouter();
    const {
        query = 'all',
        category = 'all',
        brand = 'all',
        price = 'all',
        rating = 'all',
        sort = 'featured',
    } = router.query;
    
    const { products, countProducts, categories, brands } = props;
 
    const filterSearch = ({
        page,
        category,
        brand,
        sort,
        min,
        max,
        searchQuery,
        price,
        rating,
    }) => {
        const path = router.pathname;
        const { query } = router;
        if (page) query.page = page;
        if (searchQuery) query.searchQuery = searchQuery;
        if (sort) query.sort = sort;
        if (category) query.category = category;
        if (brand) query.brand = brand;
        if (price) query.price = price;
        if (rating) query.rating = rating;
        if (min) query.min ? query.min : query.min === 0 ? 0 : min;
        if (max) query.max ? query.max : query.max === 0 ? 0 : max;
 
        router.push({
            pathname: path,
            query: query,
        });
    };
    const categoryHandler = (e) => {
        filterSearch({ category: e.target.value });
    };
    // const pageHandler = (e, page) => {
    //   filterSearch({ page });
    // };
    const brandHandler = (e) => {
        filterSearch({ brand: e.target.value });
    };
    const sortHandler = (e) => {
        filterSearch({ sort: e.target.value });
    };
    const priceHandler = (e) => {
        filterSearch({ price: e.target.value });
    };
 
    const { state, dispatch } = useContext(Store);
    const addToCartHandler = async (product) => {
        const existItem = state.cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            window.alert('Простите. Продукт закончился');
            return;
        }
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
        router.push('/cart');
    };

    return (
        <Layout title="Search">
            <div class="center">
                <Grid container spacing={1}>
                    <Grid item md={3}>
                        <List>
                            <ListItem>
                                <Box sx={{width: '100%'}}>
                                    <Typography>Категории</Typography>
                                    <Select fullWidth value={category} onChange={categoryHandler}>
                                        <MenuItem value="all">Все</MenuItem>
                                        {categories &&
                                            categories.map((category) => (
                                                <MenuItem key={category} value={category}>
                                                    {category}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </Box>
                            </ListItem>
                            <ListItem>
                                <Box sx={{width: '100%'}}>
                                    <Typography>Брэнд</Typography>
                                    <Select value={brand} onChange={brandHandler} fullWidth>
                                        <MenuItem value="all">Все</MenuItem>
                                        {brands &&
                                            brands.map((brand) => (
                                                <MenuItem key={brand} value={brand}>
                                                    {brand}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </Box>
                            </ListItem>
                            <ListItem>
                                <Box sx={{width: '100%'}}>
                                    <Typography>Цена</Typography>
                                    <Select value={price} onChange={priceHandler} fullWidth>
                                        <MenuItem value="all">Все</MenuItem>
                                        {prices.map((price) => (
                                                <MenuItem key={price.value} value={price.value}>
                                                    {price.name}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </Box>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item md={9}>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item> 
                                <Typography> Найдено товаров {' '} {products.length === 0 ? 'No' : countProducts}</Typography>
                                <Typography>
                                    {query !== 'all' && query !== '' && ' ' + query}
                                    {category !== 'all' && ' : ' + category}
                                    {brand !== 'all' && ' : ' + brand}
                                    {price !== 'all' && ' : Цена ' + price}
                                    {rating !== 'all' && ' : Рейтинг ' + rating + ' & up'}

                                    {(query !== 'all' && query !== '') ||
                                        category !== 'all' ||
                                        brand !== 'all' ||
                                        rating !== 'all' ||
                                        price !== 'all' ? (
                                        <Button onClick={() => router.push('/search')}>
                                            <CancelIcon />
                                        </Button>
                                    ) : null}
                                </Typography>
                            </Grid>
                            <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                                <Typography sx={{marginRight: '20px'}}>Сортировать</Typography>
                                <FormControl variant="standard">
                                    <Select value={sort} onChange={sortHandler}>
                                        <MenuItem value="featured">Рекомендуемые</MenuItem>
                                        <MenuItem value="lowest">Цена: по возрастанию</MenuItem>
                                        <MenuItem value="highest">Цена: по убыванию</MenuItem>
                                        <MenuItem value="toprated">Количество отзывов</MenuItem>
                                        <MenuItem value="newest">Новые поступления</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3} sx={{marginTop: '10px'}}>
                            {products.map((product) => (
                                <Grid item md={4} key={product.name}>
                                    <ProductItem
                                        product={product}
                                        addToCartHandler={addToCartHandler}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </Layout>
    );
}
 
export async function getServerSideProps({ query }) {
    await db.connect();
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const brand = query.brand || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const sort = query.sort || '';
    const searchQuery = query.query || '';
 
    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const brandFilter = brand && brand !== 'all' ? { brand } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    // 10-50
    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
 
    const order =
      sort === 'featured'
        ? { featured: -1 }
        : sort === 'lowest'
        ? { price: 1 }
        : sort === 'highest'
        ? { price: -1 }
        : sort === 'toprated'
        ? { rating: -1 }
        : sort === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };
 
    const categories = await Product.find().distinct('category');
    const brands = await Product.find().distinct('brand');
    const productDocs = await Product.find(
      {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...brandFilter,
        ...ratingFilter,
      },
      '-reviews'
    )
      .sort(order)
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .lean();
 
    const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...brandFilter,
        ...ratingFilter,
    });
    await db.disconnect();
 
    const products = productDocs.map(db.convertDocToObj);
 
    return {
        props: {
            products,
            countProducts,
            page,
            pages: Math.ceil(countProducts / pageSize),
            categories,
            brands,
        },
    };
}