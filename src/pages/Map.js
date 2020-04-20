import React, { useEffect } from 'react';
import Mapbox2D from './map/Mapbox2D';
import ESRI3D from './map/ESRI3D';
import ESRI2D from './map/ESRI2D';

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
  viewpoint,
  setViewpoint,
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
          viewpoint={viewpoint}
          setViewpoint={setViewpoint}
        />
      )}
      {mapState.type === '2d' && (
        <ESRI2D
          mapState={mapState}
          setMapState={setMapState}
          setSelectionType={setSelectionType}
          setMapillaryImageKey={setMapillaryImageKey}
          setMapillaryImageLatLng={setMapillaryImageLatLng}
          setGigapanImageKey={setGigapanImageKey}
          setGigapanImageWidthHeight={setGigapanImageWidthHeight}
          setGigapanImageLatLng={setGigapanImageLatLng}
          viewpoint={viewpoint}
          setViewpoint={setViewpoint}
        />
      )}
    </>
  );
};

export default Map;
