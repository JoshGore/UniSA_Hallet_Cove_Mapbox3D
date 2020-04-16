import React, { useState, useRef, useEffect } from 'react';
import ReactMapGl, {
  FlyToInterpolator,
  Source,
  Layer,
  Popup,
  NavigationControl,
} from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import MapillaryPopup from './MapillaryPopup';

const MAPBOX_TOKEN =
  'pk.eyJ1Ijoiam9zaGciLCJhIjoiY2s3am9lYzlwMDhsMTNrbGtiZjF0bDhwdSJ9.P7AnDzO_uMnrMeLAJxsFKQ';

const Mapbox2D = ({
  setMapillaryImageKey,
  setMapillaryImageLatLng,
  setGigapanImageKey,
  setGigapanImageWidthHeight,
  setGigapanImageLatLng,
  setSelectionType,
  mapState,
  setMapState,
}) => {
  /*
  const [viewport, setViewport] = useState({
    latitude: -35.07237,
    longitude: 138.49895,
    zoom: 14,
    pitch: 0,
    bearing: 0
  });
  */
  const [mapillaryPopup, setMapillaryPopup] = useState({
    lngLat: [undefined, undefined],
    imgKey: undefined,
  });
  const mapRef = useRef(null);
  const handleHover = (event) => {
    const getAllImages = () =>
      mapRef.current.queryRenderedFeatures(event.point, {
        layers: [
          'mapillary-images-interactive-buffer',
          'mapillary-highres-images',
          'gigapan-image-locations',
        ],
      });
    // getAllImages().length > 0 && (getAllImages()[0].layer.id === 'mapillary-images-interactive-buffer' || getAllImages()[0].layer.id === 'mapillary-highres-images') ?
    getAllImages().length > 0 &&
    getAllImages()[0].layer.id === 'mapillary-images-interactive-buffer'
      ? setMapillaryPopup({
          lngLat: getAllImages()[0].geometry.coordinates,
          imgKey: getAllImages()[0].properties.key,
        })
      : setMapillaryPopup({
          lngLat: [undefined, undefined],
          imgKey: undefined,
        });
  };
  const handleClick = (event) => {
    // update to set selection state as well as selection details
    const getAllMapillaryImages = () =>
      mapRef.current.queryRenderedFeatures(event.point, {
        layers: [
          'mapillary-images-interactive-buffer',
          'mapillary-highres-images',
        ],
      });
    const getAllGigapanImages = () =>
      mapRef.current.queryRenderedFeatures(event.point, {
        layers: ['gigapan-image-locations'],
      });
    if (getAllGigapanImages().length > 0) {
      setGigapanImageWidthHeight([
        getAllGigapanImages()[0].properties.width,
        getAllGigapanImages()[0].properties.height,
      ]);
      setGigapanImageKey(getAllGigapanImages()[0].properties.gigapan_id);
      setGigapanImageLatLng([
        getAllGigapanImages()[0].geometry.coordinates[1],
        getAllGigapanImages()[0].geometry.coordinates[0],
      ]);
      setSelectionType('panorama');
    } else if (getAllMapillaryImages().length > 0) {
      setMapillaryImageKey(getAllMapillaryImages()[0].properties.key);
      setMapillaryImageLatLng([
        getAllMapillaryImages()[0].geometry.coordinates[1],
        getAllMapillaryImages()[0].geometry.coordinates[0],
      ]);
      setSelectionType('photosphere');
    }
  };

  /*
  const layer = new Tile3DLayer({
    id: 'tile-3d-layer',
    data: 'https://tiles.arcgis.com/tiles/Lmcs3aS4AodOs221/arcgis/rest/services/Hallet_Cove_Conservation_Park_4_LOD_Low_Quality_Texture/SceneServer/layers/0',
    loader: I3SLoader,
  });
      <DeckGL
        {...viewport}
        layers={[layer]}
      >
      </DeckGL>
      */

  const handleViewportChange = (viewport) => {
    setMapState((mapState) => ({
      ...mapState,
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      zoom: viewport.zoom,
      pitch: viewport.pitch,
      bearing: viewport.bearing,
    }));
  };

  return (
    <ReactMapGl
      mapStyle={'mapbox://styles/joshg/ck7l9wc350fcf1iqg3kp15es3'}
      {...mapState}
      onViewportChange={handleViewportChange}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      width="100%"
      height="100%"
      ref={mapRef}
      onHover={handleHover}
      onClick={handleClick}
      interactiveLayerIds={[
        'mapillary-images-interactive-buffer',
        'mapillary-highres-images',
        'gigapan-image-locations',
      ]}
    >
      <div style={{ position: 'absolute', left: 0, padding: '10px' }}>
        <NavigationControl />
      </div>
      <Layer
        id={'mapillary-images-interactive-buffer'}
        type={'circle'}
        source={'composite'}
        source-layer={'mapillary_images'}
        paint={{
          'circle-opacity': 0,
          'circle-radius': 15,
        }}
      />
      <Layer
        id={'all-of-park-image'}
        type={'raster'}
        source={'mapbox://joshg.2sq1wkzy'}
        beforeId={'tunnel-street-minor-low'}
        layout={{ visibility: 'visible' }}
      />
      <Layer
        id={'mapillary-highres-images'}
        type={'symbol'}
        source={'composite'}
        source-layer={'mapillary_images'}
        beforeId={'gigapan-image-locations'}
        filter={['match', ['get', 'high_res'], [1], true, false]}
        layout={{
          'icon-image': 'photo_sphere_teardrop',
          'icon-size': 0.4,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-anchor': 'bottom',
        }}
      />
      <Layer
        id={'gigapan-image-locations'}
        type={'symbol'}
        source={'composite'}
        source-layer={'gigapan_image_locations-6rkjlq'}
        layout={{
          'icon-image': 'panorama_teardrop',
          'icon-size': 0.4,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-anchor': 'bottom',
        }}
      />
      {mapillaryPopup.lngLat[0] && (
        <MapillaryPopup
          lngLat={mapillaryPopup.lngLat}
          imgKey={mapillaryPopup.imgKey}
        />
      )}
    </ReactMapGl>
  );
};

export default Mapbox2D;
