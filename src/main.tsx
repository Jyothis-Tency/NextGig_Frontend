import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import App from "./App.tsx";
import "./index.css";
import store from "./redux/store.ts";
import { SocketProvider } from "./Context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Toaster richColors position="top-center" />
    <SocketProvider>
      <App />
    </SocketProvider>
  </Provider>
);
