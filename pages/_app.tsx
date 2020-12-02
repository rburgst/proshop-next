import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/solid'
import '../styles/globals.css'
import '../styles/bootstrap.min.css'

import { AppProps } from 'next/app'
import React from 'react'
import { Container } from 'react-bootstrap'
import { useStore } from 'react-redux'
import { Persistor, persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import Footer from '../components/Footer'
import Header from '../components/Header'
import { wrapper } from '../frontend/store'

function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore()
  // @ts-ignore we put it in the config before
  const persistor: Persistor = store.__persistor
  return (
    <PersistGate persistor={persistor} loading={<div>Loading</div>}>
      <Header />
      <main className="py-3">
        <Container>
          <Component {...pageProps} />
        </Container>
      </main>
      <Footer />
    </PersistGate>
  )
}

export default wrapper.withRedux(MyApp)
