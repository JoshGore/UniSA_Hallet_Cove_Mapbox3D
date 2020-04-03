import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Map from './Map';
import MapillaryPanorama from './MapillaryPanorama';
import GigapanPanorama from './GigapanPanorama';
import InfoBox from './InfoBox';
import TourInfo from './TourInfo';

const AppContents = ({showDetails = false}) => {
  // track selection type, selection key, selection details (location, view direction, image details if gigapan), selection zoom and view location 
  const selectionType = useState(null);
  const [selectedMapillaryImageKey,setSelectedMapillaryImageKey] = useState(null);
  const [selectedMapillaryImageLatLng, setSelectedMapillaryImageLatLng] = useState([undefined, undefined]);
  const [selectedGigapanImageKey, setSelectedGigapanImageKey] = useState(undefined);
  const [selectedGigapanImageWidthHeight, setSelectedGigapanImageWidthHeight] = useState([undefined, undefined]);
  const [selectedGigapanImageLatLng, setSelectedGigapanImageLatLng] = useState([undefined, undefined]);
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
    setSelectedMapillaryImageKey(undefined);
    setSelectedGigapanImageKey(undefined);
    if (TourInfo.tour[currentTourStep].type === 'map') {
    }
    else if (TourInfo.tour[currentTourStep].type === 'panorama') {
      setSelectedGigapanImageWidthHeight(TourInfo.tour[currentTourStep].additional.widthHeight);
      setSelectedGigapanImageKey(TourInfo.tour[currentTourStep].key);
    }
    else if (TourInfo.tour[currentTourStep].type === 'photosphere') {
      setSelectedMapillaryImageKey(TourInfo.tour[currentTourStep].key);
    }
  }, [currentTourStep]);

  return (
    <div className="App">
      <InfoBox 
        heading={infoBoxTitle} 
        body={infoBoxContent} 
        handleTourNext={handleTourNext} 
        handleTourPrevious={handleTourPrevious} 
        selectedGigapanImageKey={selectedGigapanImageKey}
        selectedGigapanImageLatLng={selectedGigapanImageLatLng}
        selectedGigapanImageWidthHeight={selectedGigapanImageWidthHeight}
        selectedMapillaryImageKey={selectedMapillaryImageKey}
        selectedMapillaryImageLatLng={selectedMapillaryImageLatLng}
        showDetails={showDetails}
      />
      <Map 
        setSelectedMapillaryImageKey={setSelectedMapillaryImageKey} 
        setSelectedMapillaryImageLatLng={setSelectedMapillaryImageLatLng}
        setSelectedGigapanImageKey={setSelectedGigapanImageKey}
        setSelectedGigapanImageWidthHeight={setSelectedGigapanImageWidthHeight}
        setSelectedGigapanImageLatLng={setSelectedGigapanImageLatLng}
      />
      {selectedMapillaryImageKey && 
        <MapillaryPanorama 
          imageKey={selectedMapillaryImageKey} 
          setImageKey={setSelectedMapillaryImageKey} 
          imageLatLng={selectedMapillaryImageLatLng} 
          setImageLatLng={setSelectedMapillaryImageLatLng}
        />}
        {selectedGigapanImageKey &&
          <GigapanPanorama 
            imageKey={selectedGigapanImageKey} 
            setImageKey={setSelectedGigapanImageKey}
            imageWidth={selectedGigapanImageWidthHeight[0]} 
            imageHeight={selectedGigapanImageWidthHeight[1]} 
            imageLatLng={selectedGigapanImageLatLng} 
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
