import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const StyledReactPlayer = styled(ReactPlayer)`
  position: absolute;
  top: 0;
  left: 0;
`;

const VideoPlayer = ({ videoUrl }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <VideoContainer>
      <StyledReactPlayer
        url={videoUrl}
        width="100%"
        height="100%"
        playing={playing}
        controls={true}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
    </VideoContainer>
  );
};

export default VideoPlayer;