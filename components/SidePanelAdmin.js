import { Card, List, ListItem, ListItemText } from '@mui/material'
import Link from 'next/link'
import React from 'react'

const panelElements = [
    {
        link: '/admin/dashboard', 
        name: 'Панель админа'
    },
    {
        link: '/admin/orders', 
        name: 'Заказы'
    },
    {
        link: '/admin/products', 
        name: 'Товары'
    },
    {
        link: '/admin/gastronomy', 
        name: 'Гастрономия'
    },
    {
        link: '/admin/banners', 
        name: 'Банеры'
    }
]

export default function SidePanelAdmin() {
    return (
        <Card>
            <List>
                {
                    panelElements.map((element) => (
                        <Link href={element.link} key={element.name}>
                            <ListItem button component="a">
                                <ListItemText primary={element.name}></ListItemText>
                            </ListItem>
                        </Link>
                    ))
                }
            </List>
        </Card>
    )
}
