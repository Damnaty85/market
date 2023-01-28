import { Grid, List, Typography, ListItem, Card } from '@mui/material';
import Image from 'next/image';
import Layout from '../../components/Layout';
import Gastronomy from '../../models/Gastronomy';
import db from '../../utils/db';

export default function ProductScreen(props) {
    const { product } = props;

    if (!product) {
      return <div>Продукт не найден</div>;
    }

    return (
        <>
            <Layout title={product.name} description={product.description}>
                <div className='center'>
                    <Grid container spacing={2} sx={{marginTop: '40px'}}>
                        <Grid item xs={3}>
                            <Image src={product.image} alt={product.name} width={320} height={600}></Image>
                        </Grid>
                        <Grid item xs={6}>
                            <List>
                                <ListItem><Typography variant="h5">{product.name}</Typography></ListItem>
                                <ListItem><Typography>Вид: {product.category}</Typography></ListItem>
                                {product.country && <ListItem><Typography>Страна производства: {product.country}</Typography></ListItem>}
                                {product.brand && <ListItem><Typography>Брэнд: {product.brand}</Typography></ListItem>}
                                {product.composition && <ListItem><Typography>Состав: {product.composition}</Typography></ListItem>}
                                {product.product_date && <ListItem><Typography>Дата прозводства: {product.product_date}</Typography></ListItem>}
                                {product.shelf_life && <ListItem><Typography>Срок хранения: {product.shelf_life}</Typography></ListItem>}
                                {product.storage_rules && <ListItem><Typography>Правила хранения: {product.storage_rules}</Typography></ListItem>}
                                {product.weight && <ListItem><Typography>Вес: {product.weight}{product.weight_unit}</Typography></ListItem>}
                                {product.appearance && <ListItem><Typography>Внешний вид: {product.appearance}</Typography></ListItem>}
                                {product.color && <ListItem><Typography>Цвет: {product.color}</Typography></ListItem>}
                                {product.description && <ListItem>
                                    <Typography>Описание: {product.description}</Typography>
                                </ListItem>}
                            </List>
                        </Grid>
                        <Grid item xs={3}>
                            <Card>
                                <List>
                                    <ListItem>
                                        <Grid container>
                                            <Grid item xs={6}><Typography variant="h6">Цена</Typography></Grid>

                                            <Grid item xs={6}>
                                            {
                                                product.new_price > 1 ?
                                                    <div>
                                                        <Typography variant="h6"
                                                            sx={{
                                                                color: 'grey',
                                                                textDecoration: 'line-through',
                                                                marginBottom: '-10px'
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
                                                                    padding: '0 10px'
                                                            }}>{Math.ceil(100 - (product.price/product.new_price) * 100)}%</Typography>
                                                        </Typography>
                                                    </div>
                                                    : <Typography variant="h6" sx={{fontWeight: '600'}}>{product.price} руб.</Typography>
                                            }
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    {/* <ListItem>
                                        <Grid container>
                                            <Grid item xs={6}><Typography>Статус</Typography></Grid>
                                            <Grid item xs={6}>
                                                <Typography>
                                                    {product.countInStock > 0 ? 'В наличии' : 'Не в наличии'}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem> */}
                                    {/* <ListItem>
                                        <Button fullWidth variant="contained" color="primary" onClick={addToCartHandler}>Купить</Button>
                                    </ListItem> */}
                                </List>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
                {/* <Link href='/products'><Typography>К покупкам</Typography></Link> */}
            </Layout>
        </>
    )
}

export async function getServerSideProps(context) {
    const { params } = context;
    const { slug } = params;
    await db.connect();
    const product = await Gastronomy.findOne({ slug }).lean();
    await db.disconnect();
    return {
        props: {
            product: db.convertDocToObj(product),
        },
    };
}