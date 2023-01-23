import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from "@mui/material"
import Link from "next/link"
import React from 'react';

export default function ProductItem({ product, addToCartHandler }) {
    return (
        <Card>
            <Link href={`/product/${product.slug}`}>
                <CardActionArea>
                    <CardMedia sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }} height="250" component="img" image={product.image} title={product.name}></CardMedia>
                    <CardContent>
                        <Typography>{product.name}</Typography>
                    </CardContent>
                </CardActionArea>
            </Link>
            <CardActions sx={{ padding: "1em", display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="h6">{product.price} руб.</Typography>
                <Button variant="outlined" color="primary" onClick={() => addToCartHandler(product)}>Купить</Button>
            </CardActions>
        </Card>
    )
}