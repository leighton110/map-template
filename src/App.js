import React, { useState, useEffect, useRef } from 'react';

import olMap from 'ol/Map';
import olView from 'ol/View';
import * as olLayer from 'ol/layer';
import * as olSource from 'ol/source';
import * as olControl from 'ol/control';
import * as olProj from 'ol/proj';
import { defaults as defaultInteractions } from 'ol/interaction';
import { MouseWheelZoom } from 'ol/interaction';

function App() {
  const [map, setMap] = useState();
  const mapElement = useRef();
  const [layer, setLayer] = useState(null);

  // create state ref that can be accessed in OpenLayers onclick callback function
  // https://stackoverflow.com/a/60643670
  // https://taylor.callsen.me/using-openlayers-with-react-functional-components/
  const mapRef = useRef(null);
  mapRef.current = map;

  useEffect(() => {
    // 베이스 타일 레이어
    let openstreet_base_map = new olLayer.Tile({
      preload: 0, // Infinity
      title: 'openstreet',
      id: '_openstreet',
      visible: true,
      source: new olSource.OSM({ attributions: [] }),
    });

    // 지도 생성
    const initialMap = new olMap({
      controls: olControl
        .defaults({
          rotate: true,
          attribution: true,
          zoom: true,
        })
        .extend([]),
      layers: [openstreet_base_map],
      view: new olView({
        center: olProj.transform(
          [127.058809, 37.584061],
          'EPSG:4326',
          'EPSG:3857'
        ),
        zoom: 10,
        projection: 'EPSG:3857',
        extent: olProj.transformExtent(
          [-180, -90, 180, 90],
          'EPSG:4326',
          'EPSG:3857'
        ),
      }),
      target: mapElement.current,
      pixelRatio: 1,
      unit: 'm',
      interactions: defaultInteractions({
        keyboard: true,
        //altShiftDragRotate: rotateControl, // window.mapControls.rotate,
        //pinchRotate: rotateControl //window.mapControls.rotate,
        //mouseWheelZoom: true, // extend에 넣어서 쓰면 의미없다. (default로 사용시에만 추가)
      }).extend([
        new MouseWheelZoom({
          duration: 1000,
          constrainResolution: true,
        }),
      ]),
      keyboardEventTarget: document,
    });
    setMap(initialMap);
  }, []);

  return (
    <div>
      <div
        id="_map"
        className="map_area"
        ref={mapElement}
        style={{ width: '100vw', height: '100vh' }}
      />
    </div>
  );
}

export default App;
