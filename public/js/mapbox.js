export const displayMapBox = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiMjUzMG1hIiwiYSI6ImNsNTZkNHFsMjAyY3czZHFsNTVqcmRmM3oifQ.fWyzaD4gWQeCmmxjw3kPpA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/2530ma/cl56kfgn1002414n73pwmlr20',
    scrollZoom: false,
    //   zoom: 4,
    //   center: [-118.4728914, 34.0119087],
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => {
    // 1 create marker
    const el = document.createElement('div');
    el.className = 'marker';
    // 2  add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    // adding pop up
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p> Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //3 extend the map bound to include the current location current
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      right: 150,
      bottom: 100,
      left: 100,
    },
  });
};
