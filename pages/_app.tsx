import { AppProps } from "next/app";
import "../styles/globals.css";
import "../styles/bootstrap.min.css";
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import Footer from "../components/Footer";
import Header from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <main className="py-3">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default MyApp;
