import React from 'react';
import styled from 'styled-components';

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const CloudSection = styled.div`
  position: absolute;
  border: 2px solid red;
  border-radius: 50%;
`;

const CloudTrackingOverlay = ({ cloudSections }) => {
  return (
    <OverlayContainer>
      {cloudSections.map((section, index) => (
        <CloudSection
          key={index}
          style={{
            left: `${section.x}%`,
            top: `${section.y}%`,
            width: `${section.width}%`,
            height: `${section.height}%`,
          }}
        />
      ))}
    </OverlayContainer>
  );
};

export default CloudTrackingOverlay;