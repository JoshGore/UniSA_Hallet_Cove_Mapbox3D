import React, {useState, useEffect} from 'react';
import './App.css';
import Map from './Map';
import MapillaryPanorama from './MapillaryPanorama';
import GigapanPanorama from './GigapanPanorama';
import InfoBox from './InfoBox';
import TourInfo from './TourInfo';

const App = () => {
  const selectionType = useState(null);
  const [selectedMapillaryImageKey,setSelectedMapillaryImageKey] = useState(null);
  const [selectedMapillaryImageLatLng, setSelectedMapillaryImageLatLng] = useState([undefined, undefined]);
  const [selectedGigapanImageKey, setSelectedGigapanImageKey] = useState(undefined);
  const [selectedGigapanImageWidthHeight, setSelectedGigapanImageWidthHeight] = useState([undefined, undefined]);
  const [selectedGigapanImageLatLng, setSelectedGigapanImageLatLng] = useState([undefined, undefined]);
  const [infoBoxContent, setInfoBoxContent] = useState('dummy content');
  const [infoBoxTitle, setInfoBoxTitle] = useState('dummy content');
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const handleTourNext = () => {
    (TourInfo.tour.length - 1) > currentTourStep && setCurrentTourStep(currentTourStep + 1);
  }
  const handleTourPrevious = () => {
    TourInfo.tour.length > 0 && setCurrentTourStep(currentTourStep - 1);
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
      <InfoBox info={infoBoxContent} handleTourNext={handleTourNext} handleTourPrevious={handleTourPrevious}/>
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

export default App;
