import { Card, CardActionArea, CardActions, CardContent, Typography } from "@mui/material"
import Image from "next/image";
import Link from "next/link"
import React from 'react';

export default function GroceryProduct({ product }) {
    return (
        <Card sx={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
            <Link href={`/gastronomy/${product.slug}`}>
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
                    <Image src={product.image} alt={product.name} height="250" width="400" style={{padding: '1em'}}></Image>
                    <CardContent>
                        <Typography variant="h5" sx={{fontSize: '18px'}}>{product.name}</Typography>
                        <Typography sx={{fontSize: '14px', opacity: '0.7'}}>{product.country} {product.brand}</Typography>
                        <Typography sx={{fontSize: '14px', opacity: '0.7'}}>{product.weight}{product.weight_unit}</Typography>
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
                                }}>
                                    {Math.ceil(100 - (product.price/product.new_price) * 100)}% | экономия {product.price-product.new_price} руб.
                                </Typography>
                            </Typography>
                        </div>
                        : <Typography variant="h6" sx={{fontWeight: '600', marginTop: 'auto'}}>{product.price} руб.</Typography>
                }
            </CardActions>
        </Card>
    )
}