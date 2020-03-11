import React, {useState} from 'react';
import './App.css';
import Map from './Map';
import Panorama from './Panorama';

const App = () => {
  const [selectedMapillaryImageKey,setSelectedMapillaryImageKey] = useState('a5VHIFVyi9yQOTYVP8WZJg');
  return (
    <div className="App">
      <Map />
      <Panorama imageKey={selectedMapillaryImageKey} setImageKey={setSelectedMapillaryImageKey}/>
    </div>
  );
}

export default App;
