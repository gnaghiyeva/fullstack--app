import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTES } from "./routes/routes";
import { ArtistContextProvider } from "./context/ArtistContext";

const routes = createBrowserRouter(ROUTES)

function App() {
  return (
    <>
    <ArtistContextProvider>

    <RouterProvider router={routes}>

    </RouterProvider>
    </ArtistContextProvider>
    </>
  );
}

export default App;
