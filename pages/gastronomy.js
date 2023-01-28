import Layout from "../components/Layout";
import db from '../utils/db';
import Gastronomy from "../models/Gastronomy";
// import axios from 'axios';
// import { useContext } from 'react';
// import { Store } from '../utils/Store';
// import ProductItem from "../components/ProductItem";
import { Grid, Typography } from "@mui/material";
import GroceryProduct from "../components/GastronomyProduct";
// import { useSnackbar } from 'notistack';

export default function ServicesScreen(props) {
    const { gastronomy } = props;

    return (
        <Layout title='Гастрономия'> 
            <div className="center">
                <Typography variant="h4">Гастрономия</Typography>
                <Grid container spacing={3} sx={{marginTop: '20px'}}>
                    {gastronomy.map((product) => (
                        <Grid item md={3} key={product._id}>
                            <GroceryProduct product={product}/>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </Layout>
    )
}

export async function getServerSideProps() {
	await db.connect();
	const gastronomy = await Gastronomy.find({}).lean();
	await db.disconnect();
	return {
		props: {
			gastronomy: gastronomy.map(db.convertDocToObj),
		},
	};
}