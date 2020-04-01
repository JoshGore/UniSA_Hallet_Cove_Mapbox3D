import React, {useState} from 'react';
import './App.css';
import Map from './Map';
import MapillaryPanorama from './MapillaryPanorama';
import GigapanPanorama from './GigapanPanorama';

const App = () => {
  const selectionType = useState(null);
  const [selectedMapillaryImageKey,setSelectedMapillaryImageKey] = useState(null);
  const [selectedMapillaryImageLatLng, setSelectedMapillaryImageLatLng] = useState([undefined, undefined]);
  const [selectedGigapanImageKey, setSelectedGigapanImageKey] = useState(undefined);
  const [selectedGigapanImageWidthHeight, setSelectedGigapanImageWidthHeight] = useState([undefined, undefined]);
  const [selectedGigapanImageLatLng, setSelectedGigapanImageLatLng] = useState([undefined, undefined]);
  return (
    <div className="App">
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
