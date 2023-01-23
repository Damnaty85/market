// import { useEffect, useState } from 'react';
import '../styles/globals.css'
import { StoreProvider } from '../utils/Store';
import { SnackbarProvider } from 'notistack';
// import { Router } from 'next/router';
// import { CircularProgress } from '@mui/material';

export default function App({ Component, pageProps }) {
	// const [loading, setLoading] = useState(false);

	// useEffect(() => {
	// 	const start = () => {
	// 		console.log("start");	
	// 		setLoading(true);
	// 	};
	// 	const end = () => {
	// 		console.log("findished");
	// 		setLoading(false);
	// 	};
		
	// 	Router.events.on("routeChangeStart", start);
	// 	Router.events.on("routeChangeComplete", end);	
	// 	Router.events.on("routeChangeError", end);
	// 	return () => {
	// 		Router.events.off("routeChangeStart", start);
	// 		Router.events.off("routeChangeComplete", end);
	// 		Router.events.off("routeChangeError", end);
	// 	};
	// }, []);

    return <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
				<StoreProvider>
					<Component {...pageProps}/>
				</StoreProvider>
			</SnackbarProvider>
}
