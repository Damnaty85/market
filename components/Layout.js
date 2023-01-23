import { AppBar, Box, Container, Toolbar, Typography, Badge, IconButton, Drawer, List, ListItem, Divider, ListItemText, TextField, Menu, MenuItem, Avatar, ThemeProvider, createTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Head from 'next/head'
import Link from 'next/link';
import React, { useContext, useState, useEffect } from 'react'
import { Store } from '../utils/Store';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { getError } from '../utils/error';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { brown } from '@mui/material/colors';

const navLinks = [
    {
        name: "Товары",
        path: "/products",
    },
    {
        name: "Бакалея",
        path: "/grocery",
    },
    {
        name: "Услуги",
        path: "/services",
    },
    {
        name: "Акции",
        path: "/action",
    },
    {
        name: "Контакты",
        path: "/contacts",
    },
];

function stringToColor(string) {
    let hash = 0;
    let i;
  
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
  
    return color;
}
  
function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}`,
    };
}

export default function Layout({title, description, children}) {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const { cart, userInfo } = state;
    
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const sidebarOpenHandler = () => {
        setSidebarVisible(true)
    }

    const sidebarCloseHandler = () => {
        setSidebarVisible(false)
    }

    const [categories, setCategories] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`/api/products/categories`);
            setCategories(data);
        } catch (err) {
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    };

    const [query, setQuery] = useState('');
    const queryChangeHandler = (e) => {
        setQuery(e.target.value);
    };
    const submitHandler = (e) => {
        e.preventDefault();
        router.push(`/search?query=${query}`);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const [anchorEl, setAnchorEl] = useState(null);

    const loginClickHandler = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const loginMenuCloseHandler = (e, redirect) => {
        setAnchorEl(null);
        if (redirect) {
            router.push(redirect)
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const logoutClickHandler = () => {
        setAnchorEl(null);
        dispatch({ type: 'USER_LOGOUT' });
        Cookies.remove('userInfo');
        Cookies.remove('cartItems');
        router.push('/');
    };

    const mainTheme = createTheme({
        palette: {
          primary: {
            main: brown[600],
          },
        },
    });

    return (
        <ThemeProvider theme={mainTheme}>
            <Head>
                <title>{title ? `${title} - Винный магазин` : `Винный магазин`}</title>
                {description && <meta name="description" content={description}></meta>}
            </Head>
            <AppBar position='static'>
                <Toolbar sx={{ justifyContent: 'space-between' }} >
                    <Box display={'flex'} alignItems={'center'}>
                        <IconButton edge="start" aria-label='open drawer' onClick={sidebarOpenHandler}>
                            <MenuIcon sx={{fill: 'white'}}></MenuIcon>
                        </IconButton>
                        <Link href='/'>
                            <Typography>Винный магазин</Typography>
                        </Link>
                    </Box>
                    <Drawer anchor='top' open={sidebarVisible} onClick={sidebarCloseHandler}>
                        <List>
                            <ListItem>
                                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                                    <Typography>Категории</Typography>
                                    <IconButton aria-label='close' onClick={sidebarCloseHandler}>
                                        <CancelIcon></CancelIcon>
                                    </IconButton>
                                </Box>
                            </ListItem>
                            <Divider light/>
                            {categories.map((category) => (
                                <Link key={category} href={`/search?category=${category}`}>
                                    <ListItem button component="a" onClick={sidebarCloseHandler}>
                                        <ListItemText primary={category}></ListItemText>
                                    </ListItem>
                                </Link>
                            ))}
                        </List>
                    </Drawer>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <List sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            {navLinks.map((item) => (
                                <ListItem key={item.name}>
                                        <Link href={`${item.path}`}><Typography>{item.name}</Typography></Link>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <form onSubmit={submitHandler} style={{ display: 'flex' }}>
                            <TextField name="query" label="Поиск товаров" onChange={queryChangeHandler} size="small"/>
                            <IconButton type="submit" aria-label="search" >
                                <SearchIcon sx={{fill: 'white'}}/>
                            </IconButton>
                        </form>
                        <Link href="/cart">
                            <IconButton sx={{color: 'white'}}>
                                {
                                    cart.cartItems.length > 0 
                                    ?   <Badge color="secondary" badgeContent={cart.cartItems.length}>
                                            <ShoppingCartIcon></ShoppingCartIcon>
                                        </Badge>
                                    :   <ShoppingCartIcon></ShoppingCartIcon>
                                }
                            </IconButton>
                        </Link>
                        {userInfo ? (
                            <>
                                <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={loginClickHandler}>
                                    <Avatar {...stringAvatar(userInfo.name)} sx={{ width: 24, height: 24 }}/>
                                </IconButton>
                                <Menu 
                                    id="simple-menu" 
                                    anchorEl={anchorEl} 
                                    keepMounted 
                                    open={Boolean(anchorEl)} 
                                    onClose={handleClose}
                                >
                                    <MenuItem><Typography variant='h6'>{userInfo.name}</Typography></MenuItem>
                                    <MenuItem onClick={(e) => loginMenuCloseHandler(e, '/profile')} >Профиль</MenuItem>
                                    <MenuItem onClick={(e) => loginMenuCloseHandler(e, '/order-history')}>
                                        История заказа
                                    </MenuItem>
                                    {userInfo.isAdmin && (
                                        <MenuItem onClick={(e) => loginMenuCloseHandler(e, '/admin/dashboard') }>
                                            Панель админа
                                        </MenuItem>
                                    )}
                                    <MenuItem onClick={logoutClickHandler}>Выйти</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Link href="/login" passHref>
                                <IconButton  sx={{color: 'white'}}>
                                    <AccountCircleIcon></AccountCircleIcon>
                                </IconButton>
                            </Link>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Container maxWidth="xl" sx={{marginTop: '20px', minHeight: '100vh'}}>{children}</Container>
            <footer>
                <Typography>All rights reserved. Ultimate Digital Agency Morkovka</Typography>
            </footer>
        </ThemeProvider>
    )
}