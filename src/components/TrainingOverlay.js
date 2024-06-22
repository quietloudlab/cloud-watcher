import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: crosshair;
`;

const BoundingBox = styled.div`
  position: absolute;
  border: 2px solid #00ff00;
  background-color: rgba(0, 255, 0, 0.1);
`;

const ExistingBox = styled(BoundingBox)`
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 0, 0, 0.3);
  }
`;

const TrainingOverlay = ({ onBoxDrawn, existingBoxes, onBoxDeleted }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const getRelativeCoordinates = useCallback((event) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
      };
    }
    return { x: 0, y: 0 };
  }, []);

  const handleMouseDown = useCallback((event) => {
    setIsDrawing(true);
    setStartPos(getRelativeCoordinates(event));
  }, [getRelativeCoordinates]);

  const handleMouseMove = useCallback((event) => {
    if (isDrawing) {
      setEndPos(getRelativeCoordinates(event));
    }
  }, [isDrawing, getRelativeCoordinates]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    if (onBoxDrawn && Math.abs(endPos.x - startPos.x) > 1 && Math.abs(endPos.y - startPos.y) > 1) {
      const newBox = {
        x: Math.min(startPos.x, endPos.x),
        y: Math.min(startPos.y, endPos.y),
        width: Math.abs(endPos.x - startPos.x),
        height: Math.abs(endPos.y - startPos.y),
      };
      onBoxDrawn(newBox);
    }
  }, [startPos, endPos, onBoxDrawn]);

  const handleBoxClick = (index) => {
    if (onBoxDeleted) {
      onBoxDeleted(index);
    }
  };

  return (
    <OverlayContainer
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {isDrawing && (
        <BoundingBox
          style={{
            left: `${Math.min(startPos.x, endPos.x)}%`,
            top: `${Math.min(startPos.y, endPos.y)}%`,
            width: `${Math.abs(endPos.x - startPos.x)}%`,
            height: `${Math.abs(endPos.y - startPos.y)}%`,
          }}
        />
      )}
      {existingBoxes.map((box, index) => (
        <ExistingBox
          key={index}
          style={{
            left: `${box.x}%`,
            top: `${box.y}%`,
            width: `${box.width}%`,
            height: `${box.height}%`,
          }}
          onClick={() => handleBoxClick(index)}
        />
      ))}
    </OverlayContainer>
  );
};

export default TrainingOverlay;