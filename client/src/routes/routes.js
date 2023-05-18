import AddArtist from "../pages/AddArtist";
import Artists from "../pages/Artists";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import MainRoot from "../pages/MainRoot";
import ArtistDetail from "../pages/ArtistDetail";

export const ROUTES = [
    {
        path:'/',
        element:<MainRoot/>,
        children:[
            {
                path:'/',
                element:<Home/>
            },
            {
                path:'/artists',
                element:<Artists/>
            },
            {
                path:'/artist/:id',
                element:<ArtistDetail/>
            },
            {
                path:'/add-artist',
                element:<AddArtist/>
            },
            {
                path:'*',
                element:<NotFound/>
            }
        ]
    }
]