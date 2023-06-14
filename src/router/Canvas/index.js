import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Canvas = () => {
  const location = useLocation();
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(null);
  const [keyPoints, setKeyPoints] = useState([]);
  const [selectedPointIndices, setSelectedPointIndices] = useState([]);
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);

  const [distance, setDistance] = useState(0);
  const [fileObject, setFileObject] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const handleKeyPointChange = (updatedKeyPoints) => {
    let formData = new FormData();
    formData.append("id", location.state.imageData?._id);
    formData.append("key_points", JSON.stringify(updatedKeyPoints));
    axios
      .put(`http://localhost:8000/api/v1/update-key-points/`, formData)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log("location", location);
    if (location?.state) {
      const base64Url = location.state.imageData?.imageBase64;
      //Convert base64 base64Url to blob and then blob to file.
      fetch(base64Url)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "image.jpg", {
            type: "image/jpeg",
            lastModified: new Date().getTime(),
          });
          setFileObject(file);
          const reader = new FileReader();
          reader.onload = function (e) {
            const image = new Image();
            image.onload = function () {
              setImageLoaded(image);
            };
            image.src = e.target.result;
          };
          reader.readAsDataURL(file);
        });
    }
  }, []);

  useEffect(() => {
    if (imageLoaded) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(imageLoaded, 0, 0);

      // Draw key points
      context.fillStyle = "red";
      keyPoints.forEach((point, index) => {
        context.beginPath();
        context.arc(point.x, point.y, 6, 0, 2 * Math.PI);
        context.fill();

        if (index === selectedPointIndex) {
          context.strokeStyle = "blue";
          context.lineWidth = 2;
          context.stroke();
        }
      });

      // Draw line and calculate distance
      if (
        selectedPointIndex !== null &&
        selectedPointIndex < keyPoints.length
      ) {
        const pointA = keyPoints[selectedPointIndex];
        const pointB = keyPoints[selectedPointIndex + 1] || keyPoints[0];
        const dx = pointB.x - pointA.x;
        const dy = pointB.y - pointA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        setDistance(distance);

        // Draw line
        context.strokeStyle = "white";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(pointA.x, pointA.y);
        context.lineTo(pointB.x, pointB.y);
        context.stroke();

        // Draw distance text
        const textX = (pointA.x + pointB.x) / 2;
        const textY = (pointA.y + pointB.y) / 2;
        context.fillStyle = "white";
        context.font = "16px Arial";
        context.fillText(`${distance.toFixed(2)} px`, textX, textY);
      } else {
        setDistance(0);
      }
    }
  }, [imageLoaded, keyPoints, selectedPointIndex]);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const newPoint = { x, y };
    const updatedKeyPoints = [...keyPoints, newPoint];
    console.log("keyPoints", newPoint, updatedKeyPoints, keyPoints);
    //Call API to add key points
    handleKeyPointChange(updatedKeyPoints);
    setKeyPoints([...keyPoints, newPoint]);
  };
  const handleSelectPoint = (index) => {
    setSelectedPointIndex(index);
  };

  const handleRemoveSelectedPoint = () => {
    if (selectedPointIndex !== null && selectedPointIndex < keyPoints.length) {
      const updatedKeyPoints = [...keyPoints];
      updatedKeyPoints.splice(selectedPointIndex, 1);
      setKeyPoints(updatedKeyPoints);
      setSelectedPointIndex(null);
      handleKeyPointChange(updatedKeyPoints);
    }
  };

  const handleReset = () =>{
    setKeyPoints([]);
    setSelectedPointIndex(null);
    setDistance(0);
  }
  const handleMouseUp =()=> {
    setIsDragging(false);
  }

  const handleMoveSelectedPoint = (event)=> {
    setIsDragging(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const selectedPoint = keyPoints[selectedPointIndex];
    const offsetX = x - selectedPoint.x;
    const offsetY = y - selectedPoint.y;
    setDragOffset({ x: offsetX, y: offsetY });
  }

  const handleMouseMove = (event)=> {
    if (isDragging && selectedPointIndex !== null && selectedPointIndex < keyPoints.length) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const updatedKeyPoints = [...keyPoints];
      updatedKeyPoints[selectedPointIndex] = { x: x - dragOffset.x, y: y - dragOffset.y };
      setKeyPoints(updatedKeyPoints);
    }
  }
  return (
    <>
      <section className="CanvasPage">
        <div className="container">
          <div className="Comman_title">
            <h3 className="Sub_Head">view On Canvas</h3>
            <h2 className="Main_hed">
              <b> Mapping Your </b>
              Picture
            </h2>
          </div>
          <div className="Canvas_cover">
            {console.log("imageLoaded?.width", imageLoaded?.width)}
            <canvas
              ref={canvasRef}
              className="canvas"
              width={imageLoaded?.width}
              height={imageLoaded?.height}
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            ></canvas>
          </div>
          <div className="Btn_Row">
            {keyPoints.length > 0 && (
              <>
                <button
                  className="Btn_round"
                  onClick={handleRemoveSelectedPoint}
                  disabled={selectedPointIndex === null}
                >
                  Remove Selected Point
                </button>
                <button
                  className="Btn_round"
                  onClick={handleMoveSelectedPoint}
                  disabled={selectedPointIndex === null}
                >
                  Move Selected Point
                </button>
                <button className="Btn_round" onClick={handleReset}>
                  Reset
                </button>
              </>
            )}
          </div>
          <div className="Btn_Row">
            {keyPoints.map((point, index) => (
              <button
                className={`Btn_canvas ${
                  index === selectedPointIndex ? "active" : ""
                }`}
                key={index}
                onClick={() => handleSelectPoint(index)}
              >
                Point {index + 1}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
export default Canvas;
