import React from 'react';
import ReactMarkdown from 'react-markdown';

const SelectionDetails = (
  {gigapanImageKey, gigapanImageLatLng, gigapanImageWidthHeight, gigapanImageBounds, mapillaryImageKey, mapillaryImageLatLng, selectionType}
) => {
  return (
    <div>
    {selectionType === 'panorama' && 
        <div>
        <p>{`Image Key: ${gigapanImageKey}`}</p>
        <p>{`Gigapan Width and Height: [${gigapanImageWidthHeight[0]}, ${gigapanImageWidthHeight[1]}]`}</p>
        <p>{`Gigapan Image Lat and Lng: [${gigapanImageLatLng[0]}, ${gigapanImageLatLng[1]}]`}</p>
        <p>{`Gigapan Image Bounds: {x: ${gigapanImageBounds.x}, y: ${gigapanImageBounds.y}, width: ${gigapanImageBounds.width}, height: ${gigapanImageBounds.height}}`}</p>
        </div>
    }
    {selectionType === 'photosphere' && <p>{`Image Key: ${mapillaryImageKey}`}</p> }
    </div>
  );
}

const InfoBox = ({
  heading, 
  body, 
  handleTourNext, 
  handleTourPrevious,
  gigapanImageKey, 
  gigapanImageLatLng,
  gigapanImageWidthHeight, 
  gigapanImageBounds,
  mapillaryImageKey,
  mapillaryImageLatLng,
  selectionType,
  showDetails
}) => {
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
        {showDetails && <SelectionDetails 
          gigapanImageKey={gigapanImageKey} 
          gigapanImageLatLng={gigapanImageLatLng} 
          gigapanImageWidthHeight={gigapanImageWidthHeight} 
          mapillaryImageKey={mapillaryImageKey} 
          mapillaryImageLatLng={mapillaryImageLatLng}
          gigapanImageBounds={gigapanImageBounds}
          selectionType={selectionType}
          />}
          <br />
          <h3>{heading}</h3>
          <ReactMarkdown source={body} />
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
