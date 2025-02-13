mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaWUwOTIzMTAiLCJhIjoiY20xNDBuejgzMWo1bzJpcTJ1YjBjbXpncCJ9.0iHQV9BxlqBxfklfiR_lKQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/josie092310/cm6jjlk9q00bq01qqfgy82xr5',
    center: [-73.956, 40.7628],
    zoom: 11
});


map.on('load', function () {

    // This is the function that finds the first symbol layer
let layers = map.getStyle().layers;
let firstSymbolId;
    for (var i = 0; i < layers.length; i++) {
    console.log(layers[i].id); // This is the line of code that we are adding
    if (layers[i].type === 'symbol') {
        firstSymbolId = layers[i].id;
        break;
    }
}
    map.addLayer({
        'id': 'asian_population',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': 'data/asian.geojson'  // 替换为你的 GeoJSON 文件路径
        },
        'paint': {
            'fill-color': [
                'interpolate', ['linear'], ['get', 'ASN_NHSP21'],  // 假设 'Asian_Population' 是亚裔人口字段
                0, 'rgba(0, 90, 168, 0.1)',     // 最少人口，浅色
                100, 'rgba(0, 90, 168, 0.2)',
                500, 'rgba(0, 90, 168, 0.3)',
                1000, 'rgba(0, 90, 168, 0.4)',
                1500, 'rgba(0, 90, 168, 0.5)',
                2000, 'rgba(0, 90, 168, 0.6)',
                2500, 'rgba(0, 84, 158, 0.7)',
                3000, 'rgba(0, 80, 150, 0.8)',  // 人口最多，深色
                4000, 'rgba(0, 72, 135, 0.9)'   // 人口最多，深色
            ],
            'fill-opacity': 1
        }
    }, 'water');



    
    map.addLayer({
        'id': 'RestaurantData',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': 'data/restaurants_2.geojson'
        },
        'paint': {
            'circle-color': [
            'case',
            ['in', 'Chinese', ['get', 'categories']], 'rgb(14, 95, 188)', 
            ['in', 'Thai', ['get', 'categories']], 'rgb(25, 75, 167)', 
            ['in', 'Japanese', ['get', 'categories']], 'rgb(0, 24, 73)',
            ['in', 'Korean', ['get', 'categories']], 'rgb(99, 167, 255)',            
            'rgba(255, 255, 255, 0)'  
        ],
            'circle-stroke-color': [
                'case',
                ['in', 'Chinese', ['get', 'categories']], 'rgb(255, 255, 255)', 
                ['in', 'Thai', ['get', 'categories']], 'rgb(255, 255, 255)', 
                ['in', 'Japanese', ['get', 'categories']], 'rgb(255, 255, 255)',
                ['in', 'Korean', ['get', 'categories']], 'rgb(255, 255, 255)',            
                'rgba(255, 255, 255, 0.4)'  
            ],
            'circle-stroke-width': 1.5,
            'circle-radius': ['interpolate', ['linear'], ['coalesce', ['get', 'stars'], 1],
                0, 0.5,  
                1, 1,  
                2, 1.5,  
                3, 2.8,  
                4, 3.2,  
                5, 4.2  
            ]
        }
    });


});

// Create the popup
map.on('click', 'RestaurantData', function (e) {
    let categories = e.features[0].properties.categories;
    let phone = e.features[0].properties.phone;
    let stars = e.features[0].properties.stars;
    let Name = e.features[0].properties.name;
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(Name + '<br>' + categories  + '<br>' + 'Tel:' + phone + '<br>' + 'star:' + stars)
        .addTo(map);
});
// Change the cursor to a pointer when the mouse is over the turnstileData layer.
map.on('mouseenter', 'RestaurantData', function () {
    map.getCanvas().style.cursor = 'pointer';
});
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'RestaurantData', function () {
    map.getCanvas().style.cursor = '';
});