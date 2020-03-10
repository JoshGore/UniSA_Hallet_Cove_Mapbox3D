import React, { useEffect } from 'react';
import ReactMapGl, { Popup } from 'react-map-gl';

const MapillaryPopup = ({lngLat, imgKey}) => {
  return (
    <Popup 
      latitude={lngLat[1]} 
      longitude={lngLat[0]}>
      <img src={`https://images.mapillary.com/${imgKey}/thumb-320.jpg`} alt="Mapillary Image Preview" style={{height: 80, width: 110, background: 'black'}} />
    </Popup>
  )
}

export default MapillaryPopup;
