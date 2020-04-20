import React, { useState, useEffect, useRef } from 'react';
import { Scene } from '@esri/react-arcgis';
import { loadModules } from 'esri-loader';
import { setDefaultOptions } from 'esri-loader';
import FeatureLayer from './esri/FeatureLayer';
import IntegratedMeshLayer from './esri/IntegratedMeshLayer';

setDefaultOptions({ css: true });

/*
const MapillaryPopup = ({imgKey, lngLat, map, view}) => {
  useEffect(() => {
    console.log("running");
    view.popup.open({
      location: {
        longitude: lngLat[0],
        latitude: lngLat[1]
      }
    });
    // view.popup.content = <img src={`https://images.mapillary.com/${imgKey}/thumb-320.jpg`} alt="Mapillary Image Preview" style={{height: 80, width: 110, background: 'black'}} />;
    return view.popup.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
*/

const ESRI3D = ({
  setMapillaryImageKey,
  setMapillaryImageLatLng,
  setGigapanImageKey,
  setGigapanImageWidthHeight,
  setGigapanImageLatLng,
  setSelectionType,
  setMapState,
  viewpoint,
  setViewpoint,
}) => {
  const [mapillaryPopup, setMapillaryPopup] = useState({
    lngLat: [undefined, undefined],
    imgKey: undefined,
  });
  const [map, setMap] = useState(null);
  const [view, setView] = useState(null);
  const handleMapLoad = (map, view) => {
    viewpoint === undefined
      ? setViewpoint(view.viewpoint)
      : (view.viewpoint = viewpoint);
    loadModules(['esri/core/watchUtils']).then(([watchUtils]) => {
      watchUtils.whenTrue(view, 'stationary', () => {
        setViewpoint(view.viewpoint);
      });
    });
    view.on('click', (event) => {
      view.hitTest(event).then((response) => {
        const gigapanImage = response.results.find(
          (result) => result.graphic.layer.title === 'Gigapan Image Locations',
        );
        const mapillaryImage = response.results.find(
          (result) =>
            result.graphic.layer.title === 'Project Live Mapillary Images',
        );
        if (gigapanImage) {
          setGigapanImageKey(gigapanImage.graphic.attributes.gigapan_id);
          setGigapanImageWidthHeight([
            gigapanImage.graphic.attributes.width,
            gigapanImage.graphic.attributes.height,
          ]);
          setGigapanImageLatLng([
            gigapanImage.graphic.geometry.latitude,
            gigapanImage.graphic.geometry.longitude,
          ]);
          setSelectionType('panorama');
        } else if (mapillaryImage) {
          setMapillaryImageKey(mapillaryImage.graphic.attributes.key_);
          setMapillaryImageLatLng();
          setMapillaryImageLatLng([
            mapillaryImage.graphic.geometry.latitude,
            mapillaryImage.graphic.geometry.longitude,
          ]);
          setSelectionType('photosphere');
        }
      });
    });
    view.on('pointer-move', (event) => {
      event.buttons === 0 &&
        view.hitTest(event).then((response) => {
          if (
            response.results.some(
              (result) =>
                result.graphic.layer.id === 'gigapan-images' ||
                result.graphic.layer.id === 'mapillary-images-standard' ||
                result.graphic.layer.id === 'mapillary-images-highlight',
            )
          ) {
            view.container.style.cursor = 'pointer';
          } else {
            view.container.style.cursor = 'default';
          }
        });
    });
    view.on('pointer-move', (event) => {
      event.buttons === 0 &&
        view.hitTest(event).then((response) => {
          const mapillaryImage = response.results.find(
            (result) =>
              result.graphic.layer.title === 'Project Live Mapillary Images',
          );
          if (mapillaryImage) {
            console.log('setting mapillary image');
            setMapillaryPopup({
              lngLat: [
                mapillaryImage.graphic.geometry.longitude,
                mapillaryImage.graphic.geometry.latitude,
              ],
              imgKey: mapillaryImage.graphic.key_,
            });
          } else {
            console.log('clearing mapillary image');
            setMapillaryPopup({
              lngLat: [undefined, undefined],
              imgKey: undefined,
            });
          }
        });
    });
    /*
      const parkExtent = new Extent({
        xmax: 138.504656,
        xmin: 138.495111,
        ymax: -35.067533,
        ymin: -35.0809,
      });

      view.goTo(
        {
          target: parkExtent,
          heading: 90,
          tilt: 70,
        },
        { duration: 0 },
      );
      */
    setMap(map);
    setView(view);
  };
  useEffect(() => {
    if (view !== null) {
      view.viewpoint = viewpoint;
    }
  }, [viewpoint]);
  return (
    <Scene
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
      }}
      mapProperties={{
        basemap: 'satellite',
        ground: 'world-elevation',
      }}
      onLoad={handleMapLoad}
    >
      <FeatureLayer
        url={
          'https://services5.arcgis.com/Lmcs3aS4AodOs221/arcgis/rest/services/Project_Live_Mapillary_Images/FeatureServer'
        }
        options={{
          id: 'mapillary-images-standard',
          outFields: ['*'],
          elevationInfo: {
            mode: 'relative-to-ground',
          },
          definitionExpression: 'high_res = 0',
          renderer: {
            sizeOptimizationEnabled: true,
            type: 'simple',
            symbol: {
              type: 'point-3d',
              symbolLayers: [
                {
                  type: 'icon',
                  size: '6px',
                  resource: { primitive: 'circle' },
                  material: {
                    color: [66, 110, 255, 0.5],
                  },
                  outline: {
                    color: [66, 110, 255, 1],
                    size: '1px',
                  },
                },
              ],
            },
            /*
          visualVariables: [
            {
              type: "size",
              valueExpression: "$view.zoom",
              stops: [
                {
                  value: 8,
                  size: '6px'
                },
                {
                  value: 13,
                  size: '12px'
                }
              ]
            }
          ]
          */
          },
        }}
      />
      <FeatureLayer
        url={
          'https://services5.arcgis.com/Lmcs3aS4AodOs221/arcgis/rest/services/Project_Live_Mapillary_Images/FeatureServer'
        }
        options={{
          id: 'mapillary-images-highlight',
          outFields: ['*'],
          elevationInfo: {
            mode: 'relative-to-ground',
          },
          definitionExpression: 'high_res = 1',
          renderer: {
            type: 'simple',
            symbol: {
              type: 'point-3d',
              symbolLayers: [
                {
                  type: 'icon',
                  size: 34,
                  anchor: 'bottom',
                  resource: {
                    href:
                      // 'https://unisthaus.maps.arcgis.com/sharing/rest/content/items/da54f941a0654f7093a8d4d0ca2a30f2/data',
                      'https://raw.githubusercontent.com/JoshGore/UniSA_Hallet_Cove_Mapbox3D/master/public/icons/photo_sphere_teardrop.svg',
                  },
                },
              ],
            },
          },
        }}
      />
      <FeatureLayer
        url={
          'https://services5.arcgis.com/Lmcs3aS4AodOs221/arcgis/rest/services/Gigapan_Image_Locations/FeatureServer'
        }
        options={{
          id: 'gigapan-images',
          outFields: ['*'],
          elevationInfo: {
            mode: 'relative-to-ground',
          },
          renderer: {
            type: 'simple',
            symbol: {
              type: 'point-3d',
              symbolLayers: [
                {
                  type: 'icon',
                  size: 34,
                  anchor: 'bottom',
                  resource: {
                    href:
                      // 'https://unisthaus.maps.arcgis.com/sharing/rest/content/items/a7d9adae7464428a848147d59271f512/data',
                      'https://raw.githubusercontent.com/JoshGore/UniSA_Hallet_Cove_Mapbox3D/master/public/icons/panorama_teardrop.svg',
                  },
                },
              ],
            },
          },
        }}
      />
      <IntegratedMeshLayer
        url={
          'https://tiles.arcgis.com/tiles/Lmcs3aS4AodOs221/arcgis/rest/services/High_Mesh_7LOD_Medium_Texture_Resolution/SceneServer'
        }
      />
    </Scene>
  );
};

export default ESRI3D;
