import React, { useState, useEffect, useRef } from 'react';
import * as Mapillary from 'mapillary-js';
import ReactMapGl from 'react-map-gl';
import {useSpring, animated} from 'react-spring';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapillary-js/dist/mapillary.min.css';

const MAPILLARY_TOKEN = 'bXdBUXpPNGdUVzJIMlF3Vk9ZVmdKQTo0NDQ0NzE1NTQ4ZWE4MDE5';
const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9zaGciLCJhIjoiY2s3am9lYzlwMDhsMTNrbGtiZjF0bDhwdSJ9.P7AnDzO_uMnrMeLAJxsFKQ';

const Map = ({imageLatLng}) => {
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
    </ReactMapGl>
  )
}

const Panorama = ({imageKey, setImageKey}) => {
  const [imageLatLng, setImageLatLng] = useState([undefined, undefined])
  const [mouseOverMap, setMouseOverMap] = useState(false);
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
  }, [imageKey]);
  const handleMouseMapLeave = () => setMouseOverMap(false);
  const handleMouseMapEnter = () => setMouseOverMap(true);
  const mapDimensions = useSpring({height: mouseOverMap ? '200px' : '100px', width: mouseOverMap ? '200px' : '100px'});
  return(
    <div id="mly" style={{
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
          zIndex: 2000,
        }}
      >
        <Map 
          imageLatLng={imageLatLng} 
        />
      </animated.div>
    </div>
  );
}

export default Panorama;
