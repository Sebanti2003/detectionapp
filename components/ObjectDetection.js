"use client";
// import Webcam from "react-webcam";
// import { useState, useEffect, useRef } from "react";
// import { load as loadCocoSsd } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
// let detechinterval;
// export const ObjectDetection = () => {
//   const webcamRef = useRef(null);
//   const [loading, setLoading] = useState(false);
//   const canvasRef = useRef(null);

//   const showWebcam = () => {
//     if (
//       webcamRef.current !== null &&
//       webcamRef.current.video?.readystate === 4
//     ) {
//       const myvideowidth = webcamRef.current.video.videoWidth;
//       const myvideoheight = webcamRef.current.video.videoHeight;
//       webcamRef.current.video.width = myvideowidth;
//       webcamRef.current.video.height = myvideoheight;
//     }
//   };

//   const runcoco = async () => {
//     console.log("running coco");
//     const net = await loadCocoSsd();
//     detechinterval = setInterval(() => {
//       runobjectdetection(net);
//     },10);
//   };
//   async function runobjectdetection(net){
//     try {
//       if (
//         canvasRef.current &&
//         webcamRef.current !== null &&
//         webcamRef.current.video?.readystate === 4
//       ) {
//         console.log("camera");
//         canvasRef.current.width = webcamRef.current.video.videoWidth;
//         canvasRef.current.height = webcamRef.current.video.videoHeight;
//         const objecting = await net.detect(
//           webcamRef.current.video,
//           undefined,
//           0.6
//         );
//         console.log(objecting);
//

//         //     })

//     //     }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     runcoco();
//     showWebcam();
//   }, [runcoco]);
//   return (
//     <div className="text-center">
//       <h1>Object Detection</h1>
//       <div className="flex justify-center items-center relative gradient p-1.5 rounded-md">
//         <Webcam
//           ref={webcamRef}
//           className="rounded-md lg:h-[720px]  w-full"
//           muted
//         />
//         <canvas
//           ref={canvasRef}
//           className="absolute top-0 left-0 z-[9999] w-full lg:h-[720px] "
//         />
//       </div>
//     </div>
//   );
// };
import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { load as loadCocoSsd } from "@tensorflow-models/coco-ssd";
import { throttle } from "lodash";
const ObjectDetection = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  let detectInterval;

  const showWebcam = () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const { videoWidth, videoHeight } = webcamRef.current.video;
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
    }
  };

  const runObjectDetection = async (net) => {
    if (
      canvasRef.current &&
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const { videoWidth, videoHeight } = video;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      const objects = await net.detect(video);
      console.log(objects);
      const context = canvasRef.current.getContext("2d");
      const renderpredictions = (object, context) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        const font = "16px sans serif";
        context.font = font;
        context.textBaseline = "top";
        object.forEach((prediction) => {
          const x = prediction.bbox[0];
          const y = prediction.bbox[1];
          const width = prediction.bbox[2];
          const height = prediction.bbox[3];
          const isperson = prediction.class === "person";
          if (isperson) {
            context.strokeStyle = "red";
            context.lineWidth = "4";
            context.strokeRect(x, y, width, height);
            context.fillStyle = `rgba(255,0,0,0.2)`;
            context.fillRect(x, y, width, height);
            context.fillStyle = "#FF0000";
            const textwidth = context.measureText(prediction.class).width;
            const texthieght = parseInt(font, 10);
            context.fillRect(x, y, textwidth + 4, texthieght + 4);
            context.fillStyle = "#000000";
            context.fillText(prediction.class, x, y);
            const audio = new Audio(
              "https://res.cloudinary.com/dyj6lkekg/video/upload/v1628005952/al.mp3"
            );
            audio.play();
          } else {
            context.strokeStyle = "green";
            context.lineWidth = "4";
            context.strokeRect(x, y, width, height);
            context.fillStyle = `rgba(255,0,0,0.2)`;
            context.fillRect(x, y, width, height);
            context.fillStyle = "#FF0000";
            const textwidth = context.measureText(prediction.class).width;
            const texthieght = parseInt(font, 10);
            context.fillRect(x, y, textwidth + 4, texthieght + 4);
            context.fillStyle = "#000000";
            context.fillText(prediction.class, x, y);
          }
        });
      };
      renderpredictions(objects, context);
    }
  };

  const runCoco = async () => {
    setLoading(true);
    const net = await loadCocoSsd();
    setLoading(false);
    detectInterval = setInterval(() => {
      runObjectDetection(net);
    }, 100); // Adjust the interval as needed, e.g., 100ms
  };

  useEffect(() => {
    runCoco();
    showWebcam();
    return () => clearInterval(detectInterval);
  }, []);

  return (
    <div className="text-center">
      <h1>Object Detection</h1>
      <div className="flex justify-center items-center relative gradient p-1.5 rounded-md">
        <Webcam
          ref={webcamRef}
          className="rounded-md lg:h-[720px] w-full"
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 z-[9999] w-full lg:h-[720px]"
        />
      </div>
    </div>
  );
};

export default ObjectDetection;
