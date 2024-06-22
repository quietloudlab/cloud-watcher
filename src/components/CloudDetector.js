import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
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
      if (!video || video.readyState < 2) return;

      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let cloudSections = [];

      // Simplified cloud detection (adjust thresholds as needed)
      for (let y = 0; y < canvas.height; y += 10) {
        for (let x = 0; x < canvas.width; x += 10) {
          const i = (y * canvas.width + x) * 4;
          if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) {
            cloudSections.push({ x: x / canvas.width * 100, y: y / canvas.height * 100, width: 5, height: 5 });
          }
        }
      }

      // Merge nearby sections
      const mergedSections = cloudSections.reduce((acc, section) => {
        const existing = acc.find(s => 
          Math.abs(s.x - section.x) < 10 && Math.abs(s.y - section.y) < 10
        );
        if (existing) {
          existing.width = Math.max(existing.width, section.x - existing.x + 5);
          existing.height = Math.max(existing.height, section.y - existing.y + 5);
        } else {
          acc.push(section);
        }
        return acc;
      }, []);

      onCloudDetected(mergedSections.slice(0, 3));
    };

    const intervalId = setInterval(detectClouds, 100); // Increased frequency

    return () => clearInterval(intervalId);
  }, [videoRef, context, onCloudDetected]);

  return <Canvas ref={canvasRef} />;
};

export default CloudDetector;