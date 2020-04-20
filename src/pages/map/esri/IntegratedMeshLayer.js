import React, { useEffect } from 'react';
import { loadModules } from 'esri-loader';

const IntegratedMeshLayer = ({ map, url, options }) => {
  useEffect(() => {
    let layer = undefined;
    loadModules(['esri/layers/IntegratedMeshLayer'], { css: true }).then(
      ([IntegratedMeshLayer]) => {
        const layer = new IntegratedMeshLayer({
          url: url,
          ...options,
        });
        console.log('adding Integrated Mesh layer');
        map.add(layer);
      },
    );
    return () => {
      if (layer) {
        console.log('removing integrated mesh layer');
        map.remove(layer);
      }
    };
  }, []);
  return null;
};

export default IntegratedMeshLayer;
