'use strict';

function round(value, decimals) {
    return Math.round(value * (10 ** decimals)) / (10 ** decimals);
}

function buildLabel(properties) {
    var fraction = "n/a";
    if (properties.hasOwnProperty('surface_fraction')) {
        fraction = round((properties.surface_fraction) * 100, 1)
    }
    //const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    //p1.appendChild(document.createTextNode(properties.city_name));
    p2.appendChild(document.createTextNode((fraction) + ' %'));
    const div = document.createElement("div");
    //div.appendChild(p1);
    div.appendChild(p2);
    return div;
}


var map = new maplibregl.Map({
    container: "map",
    attributionControl: {
      compact: false,
      customAttribution:
        '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>',
    },
    style: "neutrino.json",
    //style: "https://www.michreichert.de/projects/land-analysis-eu/landuse_coverage_per_municipality.json", // stylesheet location
    center: [9.09,48.98],
    zoom: 4,
});
map.on('load', () => {
    map.addSource('street_info', {
      'type': 'vector',
      'tiles': ['https://michreichert.de/projects/fossgis-2025/vector_tiles/tile_info/{z}/{x}/{y}.pbf']
    });
    map.addLayer({
        "id": "surface_fraction",
        "type": "fill",
        "source": "street_info",
        "source-layer": "street_data",
        "filter": ["all"],
        "layout": {"visibility": "visible"},
        "paint": {
            "fill-color": [
                "interpolate-hcl",
                ["linear"],
                ["get", "surface_fraction"],
                0.0,
                "#d7191c",
                0.25,
                "#fdae61",
                0.5,
                "#ffffbf",
                0.75,
                "#abd9e9",
                1.0,
                "#2c7bb6",
            ],
            "fill-opacity": 0.5
        }
    });
    map.addLayer({
        "id": "boundaries",
        "type": "line",
        "source": "versatiles-shortbread",
        "source-layer": "boundaries",
        //"filter": [ "all", [ "==", "admin_level", 2 ], [ "!=", "maritime", true ] ],
        "filter": [ "!=", "maritime", true ],
        "layout": {
            "visibility": "visible",
            "line-cap": "round",
            "line-join": "round",
        },
        "paint": {
            "line-color": "rgb(30, 30, 30)",
            "line-width": 1.5
        }
    });
    map.addLayer({
        "id": "cities-overlay",
        "type": "symbol",
        "source-layer": "place_labels",
        "filter": [ "all", [ "in", "kind", "city", "capital", "state_capital", "city" ] ],
        "layout": {
            "text-field": "{name_en}",
            "text-font": [ "noto_sans_regular" ],
            "text-size": { "stops": [ [ 6, 17 ], [ 10, 20 ] ] }
        },
        "source": "versatiles-shortbread",
        "paint": {
            "icon-color": "#000000",
            "text-color": "#000000",
            "text-halo-color": "#ffffff",
            "text-halo-width": 1,
            "text-halo-blur": 1
        },
        "minzoom": 6
    });
    map.on('click', 'surface_fraction', (e) => {
        new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setDOMContent(buildLabel(e.features[0].properties))
            .addTo(map);
    });
    map.on('mouseenter', 'surface_fraction', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'surface_fraction', () => {
        map.getCanvas().style.cursor = '';
    });
});
