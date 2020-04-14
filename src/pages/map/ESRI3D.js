import React, { useState, useEffect, useRef } from 'react';
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
        id: 'gigapan-images',
        url: 'https://services5.arcgis.com/Lmcs3aS4AodOs221/arcgis/rest/services/Gigapan_Image_Locations/FeatureServer',
        outFields: ["*"],
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
          },
        }
      });

      const MapillaryImagesStandard = new FeatureLayer({
        id: 'mapillary-images-standard',
        url: 'https://services5.arcgis.com/Lmcs3aS4AodOs221/arcgis/rest/services/Project_Live_Mapillary_Images/FeatureServer',
        outFields: ["*"],
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
        }
      });
      
      const MapillaryImagesHighRes = new FeatureLayer({
        id: 'mapillary-images-highlight',
        url: 'https://services5.arcgis.com/Lmcs3aS4AodOs221/arcgis/rest/services/Project_Live_Mapillary_Images/FeatureServer',
        outFields: ["*"],
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
        outFields: ["*"],
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

const InteractionHandler = ({
  map, 
  view,
  setMapillaryImageKey, 
  setMapillaryImageLatLng,
  setGigapanImageKey,
  setGigapanImageWidthHeight,
  setGigapanImageLatLng,
  setSelectionType,
  setMapillaryPopup
}) => {
  useEffect(() => {
    view.on("click", (event) => {
      view.hitTest(event).then((response) => {
        console.log(response);
        const gigapanImage = response.results.find(result => result.graphic.layer.title === "Gigapan Image Locations"); 
        const mapillaryImage = response.results.find(result => result.graphic.layer.title === "Project Live Mapillary Images"); 
        if (gigapanImage) {
          setGigapanImageKey(gigapanImage.graphic.attributes.gigapan_id);
          setGigapanImageWidthHeight([
            gigapanImage.graphic.attributes.width,
            gigapanImage.graphic.attributes.height
          ]);
          setGigapanImageLatLng([
            gigapanImage.graphic.geometry.latitude,
            gigapanImage.graphic.geometry.longitude
          ]);
          setSelectionType('panorama');
        }
        else if (mapillaryImage) {
          setMapillaryImageKey(mapillaryImage.graphic.attributes.key_);
          setMapillaryImageLatLng(

          );
          setMapillaryImageLatLng([
            mapillaryImage.graphic.geometry.latitude,
            mapillaryImage.graphic.geometry.longitude
          ]);
          setSelectionType('photosphere');
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    view.on("pointer-move", (event) => {
      event.buttons === 0 && view.hitTest(event).then((response) => {
        console.log("hit test run");
        if (response.results.some(result => ( 
          result.graphic.layer.id === "gigapan-images" ||
          result.graphic.layer.id === "mapillary-images-standard" ||
          result.graphic.layer.id === "mapillary-images-highlight"
        ))) {
          view.container.style.cursor = "pointer";
        }
        else {
          view.container.style.cursor = "default";
        }
      });
    });
    /*
    view.on("pointer-move", (event) => {
      event.buttons === 0 && view.hitTest(event).then((response) => {
        const mapillaryImage = response.results.find(result => result.graphic.layer.title === "Project Live Mapillary Images"); 
        if (mapillaryImage) {
          console.log("setting mapillary image");
          setMapillaryPopup({
            lngLat: [
              mapillaryImage.graphic.geometry.longitude, 
              mapillaryImage.graphic.geometry.latitude
            ], 
            imgKey: mapillaryImage.graphic.key_
          });
        }
        else {
          console.log("clearing mapillary image");
          setMapillaryPopup({lngLat: [undefined, undefined], imgKey: undefined});
        }
      });
    });
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null
}

const ESRI3D = ({
    setMapillaryImageKey, 
    setMapillaryImageLatLng,
    setGigapanImageKey,
    setGigapanImageWidthHeight,
    setGigapanImageLatLng,
    setSelectionType
}) => {
  const [mapillaryPopup, setMapillaryPopup] = useState({lngLat: [undefined, undefined], imgKey: undefined});
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
      <InteractionHandler 
        setMapillaryImageKey={setMapillaryImageKey}
        setMapillaryImageLatLng={setMapillaryImageLatLng}
        setGigapanImageKey={setGigapanImageKey}
        setGigapanImageWidthHeight={setGigapanImageWidthHeight}
        setGigapanImageLatLng={setGigapanImageLatLng}
        setSelectionType={setSelectionType}
        setMapillaryPopup={setMapillaryPopup}
      />
    </Scene> 
  )
}

export default ESRI3D;
