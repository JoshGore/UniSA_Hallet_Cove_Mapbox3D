import React, {useState, useRef} from  'react';
import ReactMapGl, {Popup} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapillaryPopup from './map/MapillaryPopup';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9zaGciLCJhIjoiY2s3am9lYzlwMDhsMTNrbGtiZjF0bDhwdSJ9.P7AnDzO_uMnrMeLAJxsFKQ';

const Map = () => {
  const [viewport, setViewport] = useState({
    // width: window.innerWidth,
    // height: window.innerHeight,
    latitude: -35.07237,
    longitude: 138.49895,
    zoom: 14
  });
  const [mapillaryPopup, setMapillaryPopup] = useState({lngLat: [null, null], imgKey: null});
  const mapRef = useRef(null);
  const handleHover = (event) => {
    const getAllImages = () => mapRef.current.queryRenderedFeatures(event.point, {layers: ['mapillary-images']});
    getAllImages().length > 0 && setMapillaryPopup({lngLat: getAllImages()[0].geometry.coordinates, imgKey: getAllImages()[0].properties.key});
    // set popup location and image key
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
      interactiveLayerIds={['mapillary-images']}
    >
    {mapillaryPopup.lngLat[0] && <MapillaryPopup lngLat={mapillaryPopup.lngLat} imgKey={mapillaryPopup.imgKey}/>
      }
    </ReactMapGl>
  )
}

export default Map;
