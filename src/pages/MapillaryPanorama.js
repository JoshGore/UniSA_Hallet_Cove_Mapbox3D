import React, { useState, useEffect, useRef } from 'react';
import * as Mapillary from 'mapillary-js';
import ReactMapGl, { Layer, Marker } from 'react-map-gl';
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
      <Layer id={'all-of-park-image'} type={'raster'} source={'mapbox://joshg.2sq1wkzy'} beforeId={'tunnel-street-minor-low'}/>
      <Layer 
        id={'mapillary-highres-images'} 
        type={'symbol'} 
        source={'composite'}
        source-layer={'mapillary_images'}
        beforeId={'gigapan-image-locations'}
        filter={[
          "match",
          ["get", "high_res"],
          [1],
          true,
          false
        ]} 
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
      {imageLatLng[0] && <Marker latitude={imageLatLng[0]} longitude={imageLatLng[1]} offsetLeft={-25} offsetTop={-25}>
        <img src={PanoViewLocationMarker} alt="panorama map location" style={{transform: `rotate(${imageViewBearing}deg)`}}/>
        </Marker>}
    </ReactMapGl>
  )
}

const MapillaryPanorama = ({imageKey, setImageKey, imageLatLng, setImageLatLng, setSelectionType, imageCenterZoom, setImageCenterZoom}) => {
  const [mouseOverMap, setMouseOverMap] = useState(false);
  const [imageViewBearing, setImageViewBearing] = useState(0);
  const mly = useRef(undefined);
  const imageCenterZoomRef = useRef(null);
  useEffect(() => {
    imageCenterZoomRef.current = imageCenterZoom;
  });
  const handleViewChange = (eventData) => {
    console.log("running");
    mly.current.getCenter().then((center) => {
      mly.current.getZoom().then((zoom) => {
        console.log(center);
        console.log(zoom);
        console.log(imageCenterZoomRef);
        if (imageCenterZoomRef.current.zoom !== zoom || imageCenterZoomRef.current.center[0] !== center[0] || imageCenterZoomRef.current.center[1] !== center[1]) {
          setImageCenterZoom({zoom: zoom, center: center})
        }
      });
    });
  }
  useEffect(() => {
      mly.current = new Mapillary.Viewer(
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
      mly.current.setFilter(['==', 'userKey', 'mwAQzO4gTW2H2QwVOYVgJA'])
      window.addEventListener("resize", () => { mly.current.resize(); });
      mly.current.on(Mapillary.Viewer.nodechanged, (node) => setImageLatLng([node.latLon.lat, node.latLon.lon]));
      mly.current.on(Mapillary.Viewer.bearingchanged, (bearing) => setImageViewBearing(bearing));
      mly.current.on(Mapillary.Viewer.moveend, handleViewChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    mly.current.isNavigable && mly.current.moveToKey(imageKey);
  }, [imageKey]);
  useEffect(() => {
    mly.current.setCenter(imageCenterZoom.center);
    mly.current.setZoom(imageCenterZoom.zoom);
  }, [imageCenterZoom]);
  const handleMouseMapLeave = () => setMouseOverMap(false);
  const handleMouseMapEnter = () => setMouseOverMap(true);
  const handleMapClick = () => setSelectionType('map');
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
