import React, { useEffect } from 'react';
// import { Scene } from '@esri/react-arcgis';
import { loadModules } from 'esri-loader';
// import { setDefaultOptions } from 'esri-loader';

// setDefaultOptions({ css: true });

const FeatureLayer = ({ map, view, url, options }) => {
  useEffect(() => {
    let layer = undefined;
    loadModules(['esri/layers/FeatureLayer'], { css: true }).then(
      ([FeatureLayer]) => {
        console.log('adding feature layer');
        layer = new FeatureLayer({ url: url, ...options });
        map.add(layer);
      },
    );
    return () => {
      if (layer) {
        console.log('removing feature layer');
        map.remove(layer);
      }
    };
  }, []);
  return null;
};

export default FeatureLayer;
