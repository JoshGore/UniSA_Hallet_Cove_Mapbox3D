import React from 'react';

const InfoBox = ({info, handleTourNext, handleTourPrevious}) => {
  return (
    <div 
      id="content-container" 
      style={{
        height: '40%', 
        width: '50%', 
        position: 'absolute', 
        top: 5, 
        right: 5, 
        background: 'rgba(0, 0, 0, 0.5)', 
        zIndex: 2000,
        overflowY: 'scroll',
        color: 'white',
      }}
    >
      <a href='#' onClick={handleTourPrevious}>previous</a>
      &nbsp;
      <a href='#' onClick={handleTourNext}>next</a>
      <br />
      {info}
    </div>
  );
}

export default InfoBox;
