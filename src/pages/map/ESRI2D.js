import React, { useState, useEffect, useRef } from 'react';
import { Map } from '@esri/react-arcgis';
import { loadModules } from 'esri-loader';
import { setDefaultOptions } from 'esri-loader';

const ESRI2D = ({ viewpoint, setViewpoint }) => {
  const [map, setMap] = useState(undefined);
  useEffect(() => {
    if (map && viewpoint) {
      map.viewpoint = viewpoint;
    }
  }, [viewpoint]);
  const handleLoad = (map, view) => {
    setMap(map);
    console.log(viewpoint);
    viewpoint === undefined
      ? setViewpoint(view.viewpoint)
      : (view.viewpoint = viewpoint);
    loadModules(['esri/core/watchUtils']).then(([watchUtils]) => {
      watchUtils.whenTrue(view, 'stationary', () => {
        setViewpoint(view.viewpoint);
      });
    });
    loadModules(['esri/layers/VectorTileLayer', 'esri/Basemap']).then(
      ([VectorTileLayer, Basemap]) => {
        const basemap = new Basemap({
          baseLayers: [
            new VectorTileLayer({
              url:
                'https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer',
              // 'https://api.mapbox.com/styles/v1/joshg/ck927ugfe1wvo1io49c3njyj9?access_token=pk.eyJ1Ijoiam9zaGciLCJhIjoiTFBBaE1JOCJ9.-BaGpeSYz4yPrpxh1eqT2A',
            }),
          ],
          title: 'basemap',
          id: 'basemap',
        });
        map.basemap = basemap;
      },
    );
  };
  return (
    <Map
      onLoad={handleLoad}
      viewProperties={{ constraints: { snapToZoom: false } }}
    ></Map>
  );
};

export default ESRI2D;
