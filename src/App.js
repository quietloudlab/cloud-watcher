import React, { useState } from 'react';
import styled from 'styled-components';
import VideoPlayer from './components/VideoPlayer';
import CloudTrackingOverlay from './components/CloudTrackingOverlay';

const AppContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [cloudSections, setCloudSections] = useState([]);
  const videoRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setVideoUrl(URL.createObjectURL(file));
  };

  const handleCloudDetected = (sections) => {
    setCloudSections(sections);
  };

  return (
    <AppContainer>
      <h1>Cloud Watcher</h1>
      <input type="file" accept="video/*" onChange={handleFileUpload} />
      {videoUrl && (
        <VideoWrapper>
          <VideoPlayer videoUrl={videoUrl} ref={videoRef} />
          <CloudTrackingOverlay cloudSections={cloudSections} />
          <CloudDetector videoRef={videoRef} onCloudDetected={handleCloudDetected} />
        </VideoWrapper>
      )}
    </AppContainer>
  );
}

export default App;