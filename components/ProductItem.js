import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from "@mui/material"
import Link from "next/link"
import React from 'react';

export default function ProductItem({ product, addToCartHandler }) {
    return (
        <Card sx={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
            <Link href={`/product/${product.slug}`}>
                <CardActionArea>
                    {
                        product.new_price > 1 &&
                            <Typography 
                                variant="span"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center', 
                                    backgroundColor: '#d32f2f', 
                                    borderRadius: '30px',
                                    color: 'white',
                                    fontSize: '16px',
                                    lineHeight: '12px',
                                    height: '25px',
                                    padding: '0 10px',
                                    position: 'absolute',
                                    top: '10px',
                                    left: '10px',
                                    boxShadow: 1
                                }}
                            >
                                Акция
                            </Typography>
                    }
                    <CardMedia sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }} height="250" component="img" image={product.image} title={product.name}></CardMedia>
                    <CardContent>
                        <Typography variant="h5" sx={{fontSize: '18px'}}>{product.name}</Typography>
                        <Typography sx={{fontSize: '14px', opacity: '0.7'}}>{product.country}, {product.brand}</Typography>
                        <Typography sx={{fontSize: '14px', opacity: '0.7'}}>{product.category} {product.shugar}, {product.volume}%</Typography>
                    </CardContent>
                </CardActionArea>
            </Link>
            <CardActions 
                sx={{ 
                    padding: "1em", 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-end',
                    height: '100%'
                }}>
                {
                    product.new_price > 1 ?
                        <div>
                            <Typography variant="h6"
                                sx={{
                                    color: 'grey',
                                    textDecoration: 'line-through',
                                    marginBottom: '-10px',
                                    fontSize: '16px'
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
                                        padding: '0 10px',
                                        boxShadow: 1
                                }}>{Math.ceil(100 - (product.price/product.new_price) * 100)}%</Typography>
                            </Typography>
                        </div>
                        : <Typography variant="h6" sx={{fontWeight: '600', marginTop: 'auto'}}>{product.price} руб.</Typography>
                }
                <Button variant="outlined" color="primary" onClick={() => addToCartHandler(product)}>Купить</Button>
            </CardActions>
        </Card>
    )
}