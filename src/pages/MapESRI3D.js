import React, { useEffect, useRef } from 'react';
import { Scene } from '@esri/react-arcgis';
import { loadModules } from 'esri-loader';
import { setDefaultOptions } from 'esri-loader';

setDefaultOptions({ css: true });

const ParkModelLayer = ({map, view}) => {
  useEffect(() => {
    loadModules(['esri/layers/IntegratedMeshLayer'], { css: true })
    .then(([IntegratedMeshLayer]) => {
      const HalletCoveParkModel = new IntegratedMeshLayer({
        url: "https://tiles.arcgis.com/tiles/Lmcs3aS4AodOs221/arcgis/rest/services/Hallet_Cove_Conservation_Park_4_LOD_Low_Quality_Texture/SceneServer"
      });
      map.add(HalletCoveParkModel);
    });
  });
  return null
}

const ImageLayers = ({map, view}) => {
  useEffect(() => {
    loadModules(['esri/geometry/Extent', 'esri/layers/FeatureLayer'], { css: true })
    .then(([Extent, FeatureLayer]) => {

      const GigapanImages = new FeatureLayer({
        url: 'https://services5.arcgis.com/Lmcs3aS4AodOs221/arcgis/rest/services/Gigapan_Image_Locations/FeatureServer',
        elevationInfo: {
          mode: 'relative-to-scene'
        },
        renderer: {
          type: 'simple',
          symbol: {
            type: 'point-3d',
            symbolLayers: [{
              type: 'icon',
              size: 34,
              anchor: 'bottom',
              resource: { href: "https://unisthaus.maps.arcgis.com/sharing/rest/content/items/a7d9adae7464428a848147d59271f512/data" },
            }]
          }
        }
      });

      const MapillaryImagesStandard = new FeatureLayer({
        url: 'https://services5.arcgis.com/Lmcs3aS4AodOs221/arcgis/rest/services/Project_Live_Mapillary_Images/FeatureServer',
        elevationInfo: {
          mode: 'relative-to-scene'
        },
        definitionExpression: 'high_res = 0',
        renderer: {
          sizeOptimizationEnabled: true,
          type: 'simple',
          symbol: {
            type: 'point-3d',
            symbolLayers: [{
              type: 'icon',
              size: '6px',
              resource: { primitive: 'circle' },
              material: {
                color: [66, 110, 255, 0.5]
              },
              outline: {
                color: [66, 110, 255, 1],
                size: '1px'
              },
            }]
          }
        }
      });
      
      const MapillaryImagesHighRes = new FeatureLayer({
        url: 'https://services5.arcgis.com/Lmcs3aS4AodOs221/arcgis/rest/services/Project_Live_Mapillary_Images/FeatureServer',
        elevationInfo: {
          mode: 'relative-to-scene'
        },
        definitionExpression: "high_res = 1",
        renderer: {
          type: 'simple',
          symbol: {
            type: "point-3d",
            symbolLayers: [{
              type: "icon",
              size: 34,
              anchor: 'bottom',
              resource: { href: "https://unisthaus.maps.arcgis.com/sharing/rest/content/items/da54f941a0654f7093a8d4d0ca2a30f2/data" },
            }]
          }
        }
      });

      const MapillaryImagesPaths = new FeatureLayer({
        url: 'https://services5.arcgis.com/Lmcs3aS4AodOs221/arcgis/rest/services/mapillary_image_paths/FeatureServer',
        elevationInfo: {
          mode: 'relative-to-scene'
        },
        renderer: {
          type: 'simple',
          symbol: {
            type: 'line-3d',
            symbolLayers: [{
              type: 'line',
              size: '5px',
              material: {color: [33, 132, 253, 1]}
            }]
          }
        }
      });

      map.addMany([MapillaryImagesPaths, MapillaryImagesStandard, MapillaryImagesHighRes, GigapanImages]);

      const parkExtent = new Extent({xmax: 138.504656, xmin: 138.495111, ymax: -35.067533, ymin: -35.080900});

      view.goTo({
        target: parkExtent,
        heading: 90,
        tilt: 70
      });
    });
  });
  return null
}

const MapESRI3D = () => {
  return (
    <Scene
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
      }}
      mapProperties={{
        basemap: "satellite",
        ground: "world-elevation",
      }}
      viewProperties={{
        center: [138.495, -35.0745],
        zoom: 15,
      }}
    >
      <ParkModelLayer />
      <ImageLayers />
    </Scene> 
  )
}
/*
export const MapESRI3D = () => {
    const mapRef = useRef();

    useEffect(
      () => {
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        loadModules(['esri/Map', 'esri/views/SceneView', 'esri/layers/IntegratedMeshLayer', 'esri/geometry/Extent', 'esri/layers/FeatureLayer'], { css: true })
        .then(([ArcGISMap, SceneView, IntegratedMeshLayer, Extent, FeatureLayer]) => {

          const HalletCoveParkModel = new IntegratedMeshLayer({
            url: "https://tiles.arcgis.com/tiles/Lmcs3aS4AodOs221/arcgis/rest/services/Hallet_Cove_Conservation_Park_4_LOD_Low_Quality_Texture/SceneServer"
          });

          const GigapanImages = new FeatureLayer({
            url: 'https://services5.arcgis.com/Lmcs3aS4AodOs221/arcgis/rest/services/Gigapan_Image_Locations/FeatureServer',
            elevationInfo: {
              mode: 'relative-to-scene'
            },
            renderer: {
              type: 'simple',
              symbol: {
                type: 'point-3d',
                symbolLayers: [{
                  type: 'icon',
                  size: 34,
                  anchor: 'bottom',
                  resource: { href: "https://unisthaus.maps.arcgis.com/sharing/rest/content/items/a7d9adae7464428a848147d59271f512/data" },
                }]
              }
            }
          });

          const MapillaryImagesStandard = new FeatureLayer({
            url: 'https://services5.arcgis.com/Lmcs3aS4AodOs221/arcgis/rest/services/Project_Live_Mapillary_Images/FeatureServer',
            elevationInfo: {
              mode: 'relative-to-scene'
            },
            definitionExpression: 'high_res = 0',
            renderer: {
              sizeOptimizationEnabled: true,
              type: 'simple',
              symbol: {
                type: 'point-3d',
                symbolLayers: [{
                  type: 'icon',
                  size: '6px',
                  resource: { primitive: 'circle' },
                  material: {
                    color: [66, 110, 255, 0.5]
                  },
                  outline: {
                    color: [66, 110, 255, 1],
                    size: '1px'
                  },
                }]
              }
            }
          });
          
          const MapillaryImagesHighRes = new FeatureLayer({
            url: 'https://services5.arcgis.com/Lmcs3aS4AodOs221/arcgis/rest/services/Project_Live_Mapillary_Images/FeatureServer',
            elevationInfo: {
              mode: 'relative-to-scene'
            },
            definitionExpression: "high_res = 1",
            renderer: {
              type: 'simple',
              symbol: {
                type: "point-3d",
                symbolLayers: [{
                  type: "icon",
                  size: 34,
                  anchor: 'bottom',
                  resource: { href: "https://unisthaus.maps.arcgis.com/sharing/rest/content/items/da54f941a0654f7093a8d4d0ca2a30f2/data" },
                }]
              }
            }
          });

          const MapillaryImagesPaths = new FeatureLayer({
            url: 'https://services5.arcgis.com/Lmcs3aS4AodOs221/arcgis/rest/services/mapillary_image_paths/FeatureServer',
            elevationInfo: {
              mode: 'relative-to-scene'
            },
            renderer: {
              type: 'simple',
              symbol: {
                type: 'line-3d',
                symbolLayers: [{
                  type: 'line',
                  size: '5px',
                  material: {color: [33, 132, 253, 1]}
                }]
              }
            }
          });

          const map = new ArcGISMap({
            basemap: "satellite",
            ground: "world-elevation",
            // layers: [HalletCoveParkModel, GigapanImages],
            layers: [MapillaryImagesPaths, MapillaryImagesStandard, MapillaryImagesHighRes, GigapanImages],
          });

          // load the map view at the ref's DOM node
          const view = new SceneView({
            container: mapRef.current,
            map: map,
            center: [138.495, -35.0745],
            zoom: 15,
          });

          const parkExtent = new Extent({xmax: 138.504656, xmin: 138.495111, ymax: -35.067533, ymin: -35.080900});


          view.goTo({
            // center: [138.495, -35.0745],
            target: parkExtent,
            heading: 90,
            tilt: 70
          })

          // add park info layers
          //
          // add click handler
          // add mapillary layer
          // add mapillary paths layer
          // add mapillary high res layer
          // add gigapan layer
          // relative-to-scene
          // add mapillary maker component
          // IconSymbol3DLayer

          return () => {
            if (view) {
              // destroy the map view
              view.container = null;
            }
          };
        });
      }
    );

    return (
      <div 
        className="webmap" 
        ref={mapRef} 
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      />
    );
};
*/

export default MapESRI3D;
