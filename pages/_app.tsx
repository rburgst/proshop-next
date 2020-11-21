import {AppProps} from "next/app";
import "../styles/globals.css";
import "../styles/bootstrap.min.css";
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import Footer from "../components/Footer";
import Header from "../components/Header";
import React from "react";
import {Provider} from "react-redux";
import {useStore} from "../frontend/store";

import {persistStore} from 'redux-persist'
import {PersistGate} from 'redux-persist/integration/react'

function MyApp({Component, pageProps}: AppProps) {
    const store = useStore(pageProps.initialReduxState)
    const persistor = persistStore(store, {}, function () {
        persistor.persist()
    })
    return (
        <Provider store={store}>
            <PersistGate loading={<div>loading</div>} persistor={persistor}>

                <Header/>
                <main className="py-3">
                    <Component {...pageProps} />
                </main>
                <Footer/>
            </PersistGate>
        </Provider>
    );
}

export default MyApp;
