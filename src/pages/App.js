import React, {useState} from 'react';
import './App.css';
import Map from './Map';
import Panorama from './Panorama';

const App = () => {
  const [selectedMapillaryImageKey,setSelectedMapillaryImageKey] = useState(null);
  const [selectedMapillaryImageLatLng, setSelectedMapillaryImageLatLng] = useState([undefined, undefined]);
  return (
    <div className="App">
      <Map setSelectedMapillaryImageKey={setSelectedMapillaryImageKey} setSelectedMapillaryImageLatLng={setSelectedMapillaryImageLatLng}/>
      {selectedMapillaryImageKey && 
        <Panorama 
          imageKey={selectedMapillaryImageKey} 
          setImageKey={setSelectedMapillaryImageKey} 
          imageLatLng={selectedMapillaryImageLatLng} 
          setImageLatLng={setSelectedMapillaryImageLatLng}
        />}
    </div>
  );
}

export default App;
