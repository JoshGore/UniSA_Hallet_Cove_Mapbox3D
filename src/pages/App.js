import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Mapbox2D from './map/Mapbox2D';
import ESRI3D from './map/ESRI3D';
import MapillaryPanorama from './MapillaryPanorama';
import GigapanPanorama from './GigapanPanorama';
import InfoBox from './InfoBox';
import TourInfo from './TourInfo';

const AppContents = ({showDetails = false}) => {
  // track selection type, selection key, selection details (location, view direction, image details if gigapan), selection zoom and view location 
  // const [selectionType, setSelectionType] = useState('map');
  const [selectionType, setSelectionType] = useState('3d');
  const [mapillaryImageKey,setMapillaryImageKey] = useState(null);
  const [mapillaryImageLatLng, setMapillaryImageLatLng] = useState([undefined, undefined]);
  const [mapillaryImageCenterZoom, setMapillaryImageCenterZoom] = useState({zoom: 0, center: [0.5, 0.5]});
  const [gigapanImageKey, setGigapanImageKey] = useState(undefined);
  const [gigapanImageWidthHeight, setGigapanImageWidthHeight] = useState([undefined, undefined]);
  const [gigapanImageLatLng, setGigapanImageLatLng] = useState([undefined, undefined]);
  const [gigapanImageBounds, setGigapanImageBounds] = useState({x: undefined, y: undefined, width: undefined, height: undefined, degrees: 0});
  const [infoBoxContent, setInfoBoxContent] = useState('');
  const [infoBoxTitle, setInfoBoxTitle] = useState('');
  const [currentTourStep, setCurrentTourStep] = useState(0);

  const handleTourNext = () => {
    (TourInfo.tour.length - 1) > currentTourStep && setCurrentTourStep(currentTourStep + 1);
  }
  const handleTourPrevious = () => {
    currentTourStep > 0 && setCurrentTourStep(currentTourStep - 1);
  }
  useEffect(() => {
    // panorama photosphere map
    setInfoBoxTitle(TourInfo.tour[currentTourStep].title);
    setInfoBoxContent(TourInfo.tour[currentTourStep].content);
    if (TourInfo.tour[currentTourStep].type === '3d') {
      setSelectionType('3d');
    }
    else if (TourInfo.tour[currentTourStep].type === 'map') {
      setSelectionType('map');
    }
    else if (TourInfo.tour[currentTourStep].type === 'panorama') {
      setGigapanImageLatLng(TourInfo.tour[currentTourStep].additional.latLng);
      setGigapanImageWidthHeight(TourInfo.tour[currentTourStep].additional.widthHeight);
      setGigapanImageKey(TourInfo.tour[currentTourStep].key);
      if (TourInfo.tour[currentTourStep].additional && TourInfo.tour[currentTourStep].additional.viewBounds) {
        setGigapanImageBounds(TourInfo.tour[currentTourStep].additional.viewBounds);
      }
      else {
        setGigapanImageBounds({x: undefined, y: undefined, width: undefined, height: undefined, degrees: undefined});
      }
      setSelectionType('panorama');
    }
    else if (TourInfo.tour[currentTourStep].type === 'photosphere') {
      setMapillaryImageKey(TourInfo.tour[currentTourStep].key);
      setSelectionType('photosphere');
      if (TourInfo.tour[currentTourStep].additional && TourInfo.tour[currentTourStep].additional.centerZoom) {
        setMapillaryImageCenterZoom(TourInfo.tour[currentTourStep].additional.centerZoom);
      }
      else {
        setMapillaryImageCenterZoom({center: [0.5, 0.5], zoom: 0});
      }
    }
  }, [currentTourStep]);
  useEffect(() => {
    const clearGigapanState = () => {
      setGigapanImageKey(undefined);
      setGigapanImageLatLng([undefined, undefined]);
      setGigapanImageWidthHeight([undefined, undefined]);
      setGigapanImageBounds({x: undefined, y: undefined, width: undefined, height: undefined, degrees: undefined});
    }
    const clearMapillaryState = () => {
      setMapillaryImageKey(undefined);
      setMapillaryImageLatLng([undefined, undefined]);
      setMapillaryImageCenterZoom({center: [0.5, 0.5], zoom: 0})
    }
    if (selectionType === 'map') {
      clearGigapanState();
      clearMapillaryState();
    }
    else if (selectionType === 'panorama') {
      clearMapillaryState();
    }
    else if (selectionType === 'photosphere') {
      clearGigapanState();
    }
  }, [selectionType]);

  return (
    <div className="App">
      <InfoBox 
        heading={infoBoxTitle} 
        body={infoBoxContent} 
        handleTourNext={handleTourNext} 
        handleTourPrevious={handleTourPrevious} 
        gigapanImageKey={gigapanImageKey}
        gigapanImageLatLng={gigapanImageLatLng}
        gigapanImageWidthHeight={gigapanImageWidthHeight}
        gigapanImageBounds={gigapanImageBounds}
        mapillaryImageKey={mapillaryImageKey}
        mapillaryImageLatLng={mapillaryImageLatLng}
        mapillaryImageCenterZoom={mapillaryImageCenterZoom}
        showDetails={showDetails}
        selectionType={selectionType}
      />
      {selectionType === '3d' && <ESRI3D 
        setMapillaryImageKey={setMapillaryImageKey}
        setMapillaryImageLatLng={setMapillaryImageLatLng}
        setGigapanImageKey={setGigapanImageKey}
        setGigapanImageWidthHeight={setGigapanImageWidthHeight}
        setGigapanImageLatLng={setGigapanImageLatLng}
        setSelectionType={setSelectionType}
      />}
      {selectionType === 'map' && <Mapbox2D 
        setSelectionType={setSelectionType}
        setMapillaryImageKey={setMapillaryImageKey} 
        setMapillaryImageLatLng={setMapillaryImageLatLng}
        setGigapanImageKey={setGigapanImageKey}
        setGigapanImageWidthHeight={setGigapanImageWidthHeight}
        setGigapanImageLatLng={setGigapanImageLatLng}
      />}
      {selectionType === 'photosphere' && 
        <MapillaryPanorama 
          setSelectionType={setSelectionType}
          imageKey={mapillaryImageKey} 
          setImageKey={setMapillaryImageKey} 
          imageLatLng={mapillaryImageLatLng} 
          setImageLatLng={setMapillaryImageLatLng}
          imageCenterZoom={mapillaryImageCenterZoom}
          setImageCenterZoom={setMapillaryImageCenterZoom}
        />}
        {selectionType === 'panorama' &&
          <GigapanPanorama 
            setSelectionType={setSelectionType}
            imageKey={gigapanImageKey} 
            setImageKey={setGigapanImageKey}
            imageWidth={gigapanImageWidthHeight[0]} 
            imageHeight={gigapanImageWidthHeight[1]} 
            imageLatLng={gigapanImageLatLng} 
            imageBounds={gigapanImageBounds}
            setImageBounds={setGigapanImageBounds}
          />}
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/details">
          <AppContents showDetails={true}/>
        </Route>
        <Route path="/">
          <AppContents />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
