import React from "react";
import { createBrowserRouter } from "react-router-dom";
import UploadImage from "./UploadImage";
import LayOut from "../components/layout";
import ImageListing from "./ImageListing";
import Canvas from "./Canvas";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LayOut />,
    children: [
      {
        path: "",
        element: <UploadImage />,
      },
      {
        path: "collection",
        element: <ImageListing />,
      },
      {
        path: "canvas",
        element: <Canvas />,
      },
    ],
  },
]);
export default router;
