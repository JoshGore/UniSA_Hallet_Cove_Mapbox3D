import React, { useEffect } from 'react';
import Mapbox2D from './map/Mapbox2D';
import ESRI3D from './map/ESRI3D';

const Map = ({
  selectionType,
  setSelectionType,
  setMapillaryImageKey,
  setMapillaryImageLatLng,
  setGigapanImageKey,
  setGigapanImageWidthHeight,
  setGigapanImageLatLng,
  mapState,
  setMapState,
}) => {
  // view extent, bearing, tilt
  // center, zoom
  // lat long zoom pitch bearing maptype
  // map type
  return (
    <>
      {mapState.type === '3d' && (
        <ESRI3D
          mapState={mapState}
          setMapState={setMapState}
          setMapillaryImageKey={setMapillaryImageKey}
          setMapillaryImageLatLng={setMapillaryImageLatLng}
          setGigapanImageKey={setGigapanImageKey}
          setGigapanImageWidthHeight={setGigapanImageWidthHeight}
          setGigapanImageLatLng={setGigapanImageLatLng}
          setSelectionType={setSelectionType}
        />
      )}
      {mapState.type === '2d' && (
        <Mapbox2D
          mapState={mapState}
          setMapState={setMapState}
          setSelectionType={setSelectionType}
          setMapillaryImageKey={setMapillaryImageKey}
          setMapillaryImageLatLng={setMapillaryImageLatLng}
          setGigapanImageKey={setGigapanImageKey}
          setGigapanImageWidthHeight={setGigapanImageWidthHeight}
          setGigapanImageLatLng={setGigapanImageLatLng}
        />
      )}
    </>
  );
};

export default Map;
