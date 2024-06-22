import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import VideoPlayer from './components/VideoPlayer';
import CloudTrackingOverlay from './components/CloudTrackingOverlay';
import CloudDetector from './components/CloudDetector';
import TrainingOverlay from './components/TrainingOverlay';

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

const ControlsWrapper = styled.div`
  margin-top: 50px;
`;

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [cloudSections, setCloudSections] = useState([]);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [trainedAreas, setTrainedAreas] = useState([]);
  const videoRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setVideoUrl(URL.createObjectURL(file));
  };

  const handleCloudDetected = (sections) => {
    setCloudSections(sections);
  };

  const handleBoxDrawn = (box) => {
    setTrainedAreas(prev => [...prev, box]);
  };

  return (
    <AppContainer>
      <h1>Cloud Watcher</h1>
      <input type="file" accept="video/*" onChange={handleFileUpload} />
      {videoUrl && (
        <>
          <VideoWrapper>
            <VideoPlayer videoUrl={videoUrl} ref={videoRef} />
            {!isTrainingMode && <CloudTrackingOverlay cloudSections={cloudSections} />}
            {!isTrainingMode && (
              <CloudDetector
                videoRef={videoRef}
                onCloudDetected={handleCloudDetected}
                trainedAreas={trainedAreas}
              />
            )}
            {isTrainingMode && <TrainingOverlay onBoxDrawn={handleBoxDrawn} />}
          </VideoWrapper>
          <ControlsWrapper>
            <label>
              <input
                type="checkbox"
                checked={isTrainingMode}
                onChange={(e) => setIsTrainingMode(e.target.checked)}
              />
              Training Mode
            </label>
          </ControlsWrapper>
        </>
      )}
    </AppContainer>
  );
}

export default App;