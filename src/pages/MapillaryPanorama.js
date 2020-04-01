import React, { useState, useEffect, useRef } from 'react';
import * as Mapillary from 'mapillary-js';
import ReactMapGl, { Marker } from 'react-map-gl';
import {useSpring, animated} from 'react-spring';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapillary-js/dist/mapillary.min.css';
import PanoViewLocationMarker from './panoviewlocation.svg';

const MAPILLARY_TOKEN = 'bXdBUXpPNGdUVzJIMlF3Vk9ZVmdKQTo0NDQ0NzE1NTQ4ZWE4MDE5';
const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9zaGciLCJhIjoiY2s3am9lYzlwMDhsMTNrbGtiZjF0bDhwdSJ9.P7AnDzO_uMnrMeLAJxsFKQ';

const Map = ({imageLatLng, imageViewBearing}) => {
  const [viewport, setViewport] = useState({
    latitude: -35.07237,
    longitude: 138.49895,
    zoom: 16
  });
  useEffect(() => {
    setViewport({...viewport, latitude: imageLatLng[0], longitude: imageLatLng[1]});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageLatLng]);
  return (
    <ReactMapGl
      mapStyle={'mapbox://styles/joshg/ck7l9wc350fcf1iqg3kp15es3'}
      {...viewport}
      onViewportChange={setViewport}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      attributionControl={false}
      reuseMaps={true}
      width='100%'
      height='100%'
    >
      {imageLatLng[0] && <Marker latitude={imageLatLng[0]} longitude={imageLatLng[1]} offsetLeft={-25} offsetTop={-25}>
        <img src={PanoViewLocationMarker} alt="panorama map location" style={{transform: `rotate(${imageViewBearing}deg)`}}/>
        </Marker>}
    </ReactMapGl>
  )
}

const MapillaryPanorama = ({imageKey, setImageKey, imageLatLng, setImageLatLng}) => {
  const [mouseOverMap, setMouseOverMap] = useState(false);
  const [imageViewBearing, setImageViewBearing] = useState(0);
  useEffect(() => {
      const mly = new Mapillary.Viewer(
          'mly',
          MAPILLARY_TOKEN,
          imageKey,
          {
            component: {
              cover: false,
              sequence: false,
            }
          }
      );
      mly.setFilter(['==', 'userKey', 'mwAQzO4gTW2H2QwVOYVgJA'])
      window.addEventListener("resize", function() { mly.resize(); });
      mly.on(Mapillary.Viewer.nodechanged, (node) => setImageLatLng([node.latLon.lat, node.latLon.lon]));
      mly.on(Mapillary.Viewer.bearingchanged, (bearing) => setImageViewBearing(bearing));
  }, [imageKey, setImageLatLng]);
  const handleMouseMapLeave = () => setMouseOverMap(false);
  const handleMouseMapEnter = () => setMouseOverMap(true);
  const handleMapClick = () => setImageKey(null);
  const mapDimensions = useSpring({height: mouseOverMap ? '200px' : '100px', width: mouseOverMap ? '200px' : '100px'});
  return(
    <animated.div id="mly" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1000,
    }}>
      <animated.div 
        onMouseEnter={handleMouseMapEnter}
        onMouseLeave={handleMouseMapLeave}
        style={{
          ...mapDimensions,
          position: 'absolute',
          bottom: 15,
          left: 15,
          background: 'lightyellow',
          borderRadius: 10,
          overflow: 'hidden',
          zIndex: 2000,
        }}
      >
        <div 
          style={{backgroundColor: 'hsla(0, 0%, 30%, 0.5)', position: 'absolute', top: -40, right: -40, height: 80, width: 80, zIndex: 3000, transform: 'rotate(45deg)'}}
          onClick={handleMapClick}
        >
          <div style={{borderTop: '5px solid white', borderLeft: '5px solid white', height: '10px', width: '10px', left: '31px', bottom: '6px', transform: 'rotate(45deg)', position: 'absolute'}} />
        </div>
        <Map 
          imageLatLng={imageLatLng} 
          imageViewBearing={imageViewBearing}
        />
      </animated.div>
    </animated.div>
  );
}

export default MapillaryPanorama;
