import { AppBar, Box, Toolbar, Typography, Badge, IconButton, List, ListItem, Menu, MenuItem, Avatar, ThemeProvider, createTheme } from '@mui/material'
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
import dynamic from 'next/dynamic';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create('width'),
    width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const navLinks = [
    {
        name: "Товары",
        path: "/products",
        parent: true
    },
    {
        name: "Гастрономия",
        path: "/gastronomy",
        parent: false
    },
    {
        name: "Подарки",
        path: "/services",
        parent: false
    },
    {
        name: "Акции",
        path: "/action",
        parent: false
    },
    {
        name: "Контакты",
        path: "/contacts",
        parent: false
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

function Layout({title, description, children}) {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const { cart, userInfo } = state;
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElSection, setAnchorElSection] = useState(null);

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

    const handleClickSubsection = (event) => {
        setAnchorElSection(event.currentTarget);
    };
    
      const handleCloseSubsection = () => {
        setAnchorElSection(null);
    };

    const loginClickHandler = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const menuCloseHandler = (e, redirect) => {
        setAnchorEl(null);
        if (redirect) {
            router.push(redirect)
        }
    };

    const mainMenuCloseHandler = () => {
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
            main: '#EEEEEE',
          },
        },
    });

    return (
        <ThemeProvider theme={mainTheme}>
            <Head>
                <title>{title ? `${title} - магазина Особый случай` : `Особый случай`}</title>
                {description && <meta name="description" content={description}></meta>}
            </Head>
            <AppBar position='static'>
                <Toolbar sx={{ justifyContent: 'space-between' }} >
                    <Box display={'flex'} alignItems={'center'}>
                        <Link href='/'>
                            <Typography sx={{
                                    fontWeight: '700',
                                    fontFamily: 'Monotype Corsiva',
                                    fontStyle: 'italic',
                                    fontSize: '40px',
                                    color: 'rgb(148, 109, 70)',
                                    textShadow: '6px 3px 5px rgba(0, 0, 0, 0.15)',
                                }}>
                                    Особый
                                </Typography> 
                                <Typography sx={{
                                    fontWeight: '700',
                                    fontFamily: 'Monotype Corsiva',
                                    fontStyle: 'italic',
                                    fontSize: '40px',
                                    color: 'rgb(148, 109, 70)',
                                    marginTop: '-32px',
                                    marginLeft: '50px',
                                    textShadow: '6px 3px 5px rgba(0, 0, 0, 0.15)',
                                }}>
                                    случай
                                </Typography>
                        </Link>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <List sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            {navLinks.map((item) => (
                                item.parent ? 
                                    <>
                                        <ListItem 
                                            key={item.name} 
                                            onMouseOver={handleClickSubsection}
                                            aria-controls="basic-menu" 
                                            aria-haspopup="true"  
                                        >
                                                <Typography>{item.name}</Typography>
                                        </ListItem>
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorElSection}
                                            open={Boolean(anchorElSection)} 
                                            onClose={handleCloseSubsection}
                                            MenuListProps={{ onMouseLeave: handleCloseSubsection }}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                        >
                                            <MenuItem key={item.name} onClick={(e) => menuCloseHandler(e, `${item.path}`)} sx={{padding: '0.5em 4em 0.5em 0.5em'}}>
                                                {item.name}
                                            </MenuItem>
                                            {categories.map((category) => (
                                                <MenuItem 
                                                    key={category} 
                                                    onClick={(e) => menuCloseHandler(e, `/search?category=${category}`)}
                                                    sx={{padding: '0.5em 4em 0.5em 0.5em'}}
                                                >
                                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </>
                                :   <ListItem key={item.name}>
                                        <Link href={`${item.path}`}><Typography>{item.name}</Typography></Link>
                                    </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <form onSubmit={submitHandler}>
                            <Search >
                            <IconButton type="submit" aria-label="search" >
                                <SearchIcon sx={{fill: 'rgb(148, 109, 70)'}}/>
                            </IconButton>
                                <StyledInputBase
                                    placeholder="Поиск…"
                                    inputProps={{ 'aria-label': 'search' }}
                                    onChange={queryChangeHandler}
                                />
                            </Search>
                        </form>
                        <Link href="/cart">
                            <IconButton sx={{color: 'rgb(148, 109, 70)'}}>
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
                                <IconButton 
                                    aria-controls="simple-menu" 
                                    aria-haspopup="true"         
                                    onClick={loginClickHandler}
                                >
                                    <Avatar {...stringAvatar(userInfo.name)} sx={{ width: 24, height: 24 }}/>
                                </IconButton>
                                <Menu 
                                    id="simple-menu" 
                                    anchorEl={anchorEl} 
                                    keepMounted 
                                    open={Boolean(anchorEl)} 
                                    onClose={mainMenuCloseHandler}
                                    PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                            '&:before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem><Typography variant='h6'>{userInfo.name}</Typography></MenuItem>
                                    <MenuItem onClick={(e) => menuCloseHandler(e, '/profile')} >Профиль</MenuItem>
                                    <MenuItem onClick={(e) => menuCloseHandler(e, '/order-history')}>
                                        История заказа
                                    </MenuItem>
                                    {userInfo.isAdmin && (
                                        <MenuItem onClick={(e) => menuCloseHandler(e, '/admin/dashboard') }>
                                            Панель админа
                                        </MenuItem>
                                    )}
                                    <MenuItem onClick={logoutClickHandler}>Выйти</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Link href="/login" passHref>
                                <IconButton  sx={{color: 'black'}}>
                                    <AccountCircleIcon></AccountCircleIcon>
                                </IconButton>
                            </Link>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <div style={{marginTop: '20px', minHeight: '100vh'}}>{children}</div>
            <footer>
                <Typography>All rights reserved. Ultimate Digital Agency Morkovka</Typography>
            </footer>
        </ThemeProvider>
    )
}

export default dynamic(() => Promise.resolve(Layout), { ssr: false });