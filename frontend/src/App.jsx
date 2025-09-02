import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layouts/AppLayout/AppLayout';
import Home from './pages/Home/Home';
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StoreContextProvider from './context/storeContext';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';

const router = createBrowserRouter([{
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "/order",
        element: <PlaceOrder />
      },
      {
        path: "/verify",
        element: <Verify/>
      },
      {
        path: "/myorders",
        element: <MyOrders />
      }
    ]
}]);

const App = () => {
  const client = new QueryClient;
  return (
    <QueryClientProvider client={client}>
      <StoreContextProvider>
        <RouterProvider router={router}/>
      </StoreContextProvider>
    </QueryClientProvider>
  )
}

export default App
