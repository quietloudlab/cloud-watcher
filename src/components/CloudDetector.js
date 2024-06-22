import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
`;

const CloudDetector = ({ videoRef, onCloudDetected }) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      setContext(ctx);
    }
  }, []);

  useEffect(() => {
    if (!videoRef.current || !context) return;

    const detectClouds = () => {
      const video = videoRef.current.getInternalPlayer();
      if (!video || video.readyState < 2) return; // Check if video is ready

      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let cloudSections = [];

      // Simple thresholding for white/bright areas
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) {
          const x = (i / 4) % canvas.width;
          const y = Math.floor((i / 4) / canvas.width);
          cloudSections.push({ x, y, width: 5, height: 5 });
        }
      }

      // Merge nearby sections (simplified)
      const mergedSections = cloudSections.reduce((acc, section) => {
        const existing = acc.find(s => 
          Math.abs(s.x - section.x) < 20 && Math.abs(s.y - section.y) < 20
        );
        if (existing) {
          existing.width = Math.max(existing.width, section.x - existing.x + 5);
          existing.height = Math.max(existing.height, section.y - existing.y + 5);
        } else {
          acc.push(section);
        }
        return acc;
      }, []);

      onCloudDetected(mergedSections.slice(0, 3)); // Limit to 3 sections for simplicity
    };

    const intervalId = setInterval(detectClouds, 1000); // Detect every second

    return () => clearInterval(intervalId);
  }, [videoRef, context, onCloudDetected]);

  return <Canvas ref={canvasRef} />;
};

export default CloudDetector;