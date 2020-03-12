import React, { useEffect } from 'react';
import ReactMapGl, { Popup } from 'react-map-gl';
import './MapillaryPopup.css';

const MapillaryPopup = ({lngLat, imgKey}) => {
  return (
    <Popup 
      anchor={'bottom-left'}
      closeButton={false}
      latitude={lngLat[1]} 
      longitude={lngLat[0]}
      className={'mapillary-image-popup'}
    >
      <img src={`https://images.mapillary.com/${imgKey}/thumb-320.jpg`} alt="Mapillary Image Preview" style={{height: 80, width: 110, background: 'black'}} />
    </Popup>
  )
}

export default MapillaryPopup;
