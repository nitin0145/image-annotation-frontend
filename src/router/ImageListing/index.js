import React, { useState, useEffect } from "react";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ImageListing = () => {
  const [imageList, setImageList] = useState([]);
  const getAllImages = () => {
    axios
      .get("http://localhost:8000/api/v1/image-collection")
      .then(function (response) {
        console.log(response);
        setImageList(response?.data.sort((a, b) => b.id - a.id));
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllImages();
  }, []);

  return (
    <>
      <section className="CollectionPage">
        <div className="container">
          <div className="Comman_title">
            <h3 className="Sub_Head">Analyzing Collection</h3>
            <h2 className="Main_hed">
              <b> Your All Images </b>
              Collection
            </h2>
          </div>
          <div className="row">
            {imageList?.length > 0 ?imageList?.map((item, index) => {
              return (
                <div key={index} className="col">
                  <Card imageData={item} />
                </div>
              );
            }):
            // no data found message
              <h2>No Data Found</h2>
            }
          </div>
        </div>
      </section>
    </>
  );
};
export default ImageListing;

export const Card = ({ imageData }) => {
  const navigate = useNavigate();
  
  const handleViewImage = (imageData) => {
    navigate("/canvas", {
      state: { imageData: imageData },
    });
  };

  const convertFileSize = (fileSize) => {
    const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let l = 0,
      n = parseInt(fileSize, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
  };

  
  return (
    <div className="Course_card">
      <div className="Card_top">
        <img src={imageData?.imageBase64} alt={"Img"} />
      </div>
      <div className="Card_bottom">
        <h3> Image Name : {imageData?.name}</h3>
        <p>
          <span>Image Size : {convertFileSize(imageData?.file_size)}</span>
          <span className="With_border">
            {" "}
            Image Type : {imageData?.file_type}
          </span>
        </p>
        <div className="GO_on_btn" onClick={()=>handleViewImage(imageData)}>
          <span> Go To canvas </span>
          <BsFillArrowRightCircleFill className="icon" />
        </div>
      </div>
    </div>
  );
};
