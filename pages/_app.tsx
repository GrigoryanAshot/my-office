import { Provider } from "react-redux";
import store from "@/redux/store"; // Make sure this path is correct
import "../public/css/nav.css";
import type { AppProps } from 'next/app';
// trigger rebuild
export default function MyApp({ Component, pageProps }: AppProps) {
  return ( 
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
