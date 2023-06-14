import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
const UploadImage = () => {
  const navigate = useNavigate();
  const handleImageLoad = (e) => {
    //Call API to upload image
    let formData = new FormData();
    formData.append("image", e.target.files[0]);
    console.log("formData", process.env.REACT_APP_API);
    axios
      .post("http://localhost:8000/api/v1/image-collection/", formData)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    navigate("/collection");
  };
  return (
    <>
      <section className="HomePage">
        <div className="container">
          <div className="Comman_title">
            <h3 className="Sub_Head">Start From Here</h3>
            <h2 className="Main_hed">
              <b> Upload Your </b> image
            </h2>
          </div>
          <form className="Uploader_wrapper">
            {<h2 className="title">Upload Image</h2>}
            <input
              type="file"
              autoComplete="on"
              className="input_file"
              required
              name="uploadPhoto"
              accept="image/*"
              onChange={handleImageLoad}
            />
          </form>
        </div>
      </section>
    </>
  );
};
export default UploadImage;
