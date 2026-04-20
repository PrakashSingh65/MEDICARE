import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Page/home";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            }
        ]
    }
])