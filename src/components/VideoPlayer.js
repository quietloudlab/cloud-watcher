import React, { forwardRef } from 'react';
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

const VideoPlayer = forwardRef(({ videoUrl }, ref) => {
    return (
      <VideoContainer>
        <StyledReactPlayer
          ref={ref}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={true}
          controls={true}
          loop={true}
        />
      </VideoContainer>
    );
  });
  
  export default VideoPlayer;