import React, {useState, useRef} from  'react';
import ReactMapGl, {Popup, Layer} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapillaryPopup from './map/MapillaryPopup';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9zaGciLCJhIjoiY2s3am9lYzlwMDhsMTNrbGtiZjF0bDhwdSJ9.P7AnDzO_uMnrMeLAJxsFKQ';

const Map = ({setSelectedMapillaryImageKey, setSelectedMapillaryImageLatLng}) => {
  const [viewport, setViewport] = useState({
    latitude: -35.07237,
    longitude: 138.49895,
    zoom: 14
  });
  const [mapillaryPopup, setMapillaryPopup] = useState({lngLat: [undefined, undefined], imgKey: undefined});
  const mapRef = useRef(null);
  const handleHover = (event) => {
    const getAllImages = () => mapRef.current.queryRenderedFeatures(event.point, {layers: ['mapillary-images-interactive-buffer']});
    getAllImages().length > 0 ? 
      setMapillaryPopup({lngLat: getAllImages()[0].geometry.coordinates, imgKey: getAllImages()[0].properties.key}) : 
      setMapillaryPopup({lngLat: [undefined, undefined], imgKey: undefined})
  };
  const handleClick = (event) => {
    const getAllImages = () => mapRef.current.queryRenderedFeatures(event.point, {layers: ['mapillary-images-interactive-buffer']});
    if (getAllImages().length > 0) {
      setSelectedMapillaryImageKey(getAllImages()[0].properties.key);
      setSelectedMapillaryImageLatLng([ getAllImages()[0].geometry.coordinates[1], getAllImages()[0].geometry.coordinates[0]]);
    }
  };
  return (
    <ReactMapGl
      mapStyle={'mapbox://styles/joshg/ck7l9wc350fcf1iqg3kp15es3'}
      {...viewport}
      onViewportChange={setViewport}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      width='100%'
      height='100%'
      ref={mapRef}
      onHover={handleHover}
      onClick={handleClick}
      interactiveLayerIds={['mapillary-images-interactive-buffer']}
    >
      <Layer id={"mapillary-images-interactive-buffer"} type={'circle'} source={"composite"} source-layer={"mapillary_images"} 
    paint={{
      'circle-opacity': 0,
      'circle-radius': 15,
    }}
      />
    {mapillaryPopup.lngLat[0] && <MapillaryPopup lngLat={mapillaryPopup.lngLat} imgKey={mapillaryPopup.imgKey}/>
      }
    </ReactMapGl>
  )
}

export default Map;
