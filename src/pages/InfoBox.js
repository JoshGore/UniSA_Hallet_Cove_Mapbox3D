import React from 'react';

const InfoBox = ({heading, body, handleTourNext, handleTourPrevious}) => {
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
        color: 'white',
        display: 'flex',
        flexFlow: 'column',
      }}
    >
      <div 
        style={{
          overflowY: 'scroll',
          flexGrow: 1,
        }}
      >
          <br />
          <h3>{heading}</h3>
          {body}
      </div>
      <div style={{bottom: 0, width: '100%'}}>
        <u onClick={handleTourPrevious} style={{color: 'white', cursor: 'pointer'}}>previous</u>
        &nbsp;
        <u onClick={handleTourNext} style={{color: 'white', cursor: 'pointer'}}>next</u>
      </div>
    </div>
  );
}

export default InfoBox;
