import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import CloudModel from '../utils/cloudModel';

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`;

const CloudDetector = ({ videoRef, onCloudDetected, trainedAreas }) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [cloudModel, setCloudModel] = useState(null);

  useEffect(() => {
    const model = new CloudModel();
    setCloudModel(model);
  }, []);

  useEffect(() => {
    if (cloudModel && trainedAreas && trainedAreas.length > 0) {
      const features = trainedAreas.map(area => [
        area.x / 100,
        area.y / 100,
        area.width / 100,
        area.height / 100,
        (area.x + area.width / 2) / 100  // center x
      ]);
      const labels = trainedAreas.map(() => [1]);  // All areas are positive examples

      // Add some negative examples
      for (let i = 0; i < trainedAreas.length; i++) {
        features.push([Math.random(), Math.random(), 0.1, 0.1, Math.random()]);
        labels.push([0]);
      }

      cloudModel.train(features, labels);
    }
  }, [cloudModel, trainedAreas]);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      setContext(ctx);
    }
  }, []);

  useEffect(() => {
    if (!videoRef.current || !context || !cloudModel) return;

    const detectClouds = () => {
      const video = videoRef.current.getInternalPlayer();
      if (!video || video.readyState < 2) return;

      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let cloudSections = [];

      for (let y = 0; y < canvas.height; y += 10) {
        for (let x = 0; x < canvas.width; x += 10) {
          const i = (y * canvas.width + x) * 4;
          const r = data[i] / 255;
          const g = data[i + 1] / 255;
          const b = data[i + 2] / 255;
          const brightness = (r + g + b) / 3;

          const features = [
            x / canvas.width,
            y / canvas.height,
            0.1,  // width (10 pixels)
            0.1,  // height (10 pixels)
            brightness
          ];

          const prediction = cloudModel.predict(features);
          if (prediction > 0.5) {
            cloudSections.push({
              x: (x / canvas.width) * 100,
              y: (y / canvas.height) * 100,
              width: 10,
              height: 10
            });
          }
        }
      }

      onCloudDetected(cloudSections);
    };

    const intervalId = setInterval(detectClouds, 100);

    return () => clearInterval(intervalId);
  }, [videoRef, context, cloudModel, onCloudDetected]);

  return <Canvas ref={canvasRef} />;
};

export default CloudDetector;