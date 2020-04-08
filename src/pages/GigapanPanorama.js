import React, { useEffect, useState, useRef } from 'react'
import OpenSeadragon, {Point, Rect} from 'openseadragon';
import ReactMapGl, { Layer, Marker } from 'react-map-gl';
import {useSpring, animated} from 'react-spring';
import 'mapbox-gl/dist/mapbox-gl.css';
import PanoViewLocationMarker from './panoviewlocation.svg';
import '../utils/openseadragon.gigapantilesource.js';

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

const GigapanPanorama = ({
  imageKey, setImageKey, imageHeight, imageWidth, imageLatLng, imageBounds, setImageBounds, setSelectionType
}) => {
  const viewer = useRef(undefined);
  const imageBoundsRef = useRef(imageBounds);
  const [mouseOverMap, setMouseOverMap] = useState(false);
  const [imageViewBearing, setImageViewBearing] = useState(0);
  const handleMouseMapLeave = () => setMouseOverMap(false);
  const handleMouseMapEnter = () => setMouseOverMap(true);
  const handleMapClick = () => setSelectionType('map');
  const mapDimensions = useSpring({height: mouseOverMap ? '200px' : '100px', width: mouseOverMap ? '200px' : '100px'});
  const handleViewChange = (eventData) => {
    const newImageBounds = viewer.current.viewport.getBoundsNoRotate();
    setImageBounds({
      x: newImageBounds.x, y: newImageBounds.y, width: newImageBounds.width, height: newImageBounds.height, degrees: newImageBounds.degrees
    });
  }

  useEffect(() => {
    imageBoundsRef.current = imageBounds;
  });

  useEffect(() => {
    viewer.current = OpenSeadragon({
      id: "osd",
      prefixUrl: "./openseadragon/images/",
      navigatorSizeRatio: 0.5,
      tileSources: [{
        type: 'gigapan',
        tileOverlap: 0,
        tilesUrl: `http://tile198.gigapan.org/gigapans0/${imageKey}/tiles/`,
        width:	imageWidth,
        height:	imageHeight,
      }]
    });
    viewer.current.addHandler('animation-finish', handleViewChange);
    viewer.current.addOnceHandler('open', () => {
      const homeImageBounds = imageBounds && imageBounds.x ? 
        new Rect(imageBounds.x, imageBounds.y, imageBounds.width, imageBounds.height, imageBounds.degrees) 
        : viewer.current.viewport.getHomeBounds();
      setImageBounds({x: homeImageBounds.x, y: homeImageBounds.y, width: homeImageBounds.width, height: homeImageBounds.height, degrees: homeImageBounds.degrees});
      viewer.current.viewport.fitBounds(homeImageBounds);
    });
    return (() => {
      viewer.current.destroy();
      viewer.current = null;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageKey]);

  useEffect(() => {
    let imageBoundsRect = undefined;
    if ( !imageBounds || !imageBounds.x ) {
      imageBoundsRect = viewer.current.viewport.getHomeBounds();
    }
    else {
      imageBoundsRect = new Rect(
        imageBounds.x, imageBounds.y, imageBounds.width, imageBounds.height, imageBounds.degrees
      );
    }
    viewer.current.viewport.fitBounds(imageBoundsRect);
  }, [imageBounds]);

  return (
    <div id={"osd"} style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1000,
      background: 'black',
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
    </div>
  );
}

export default GigapanPanorama;
