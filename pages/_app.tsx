import { Provider } from "react-redux";
import store from "@/redux/store"; // Make sure this path is correct


export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}