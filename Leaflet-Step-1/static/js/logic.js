
// usgs api endpoint

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function GetMarkerOptions(magnitude) {
    return { radius: (magnitude * 20000),
             fillColor: GetColor(magnitude),
             fillOpacity: 1,
             stroke: false
    };
}

function GetColor(magnitude) {
    if (magnitude <= 1) {
        return "#ADFF2F";
    } else if (magnitude <= 2) {
        return "#9ACD32";
    } else if (magnitude <= 3) {
        return "#FFFF00";
    } else if (magnitude <= 4) {
        return "#ffd700";
    } else if (magnitude <= 5) {
        return "#FFA500";
    } else {
        return "#FF0000";
    };
}

d3.json(url, function(data) {
     SetupFeatures(data.features);
});
  
function SetupFeatures(qd) {
  
    var earthquakes = L.geoJSON(qd, {
    
        onEachFeature: function (feature, layer) {
  
            layer.bindPopup(feature.properties.place +
            "<p>" + new Date(feature.properties.time) + "</p>" + 
            "<p> Magnitude: " +  feature.properties.mag + "</p>")
        },
        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng, GetMarkerOptions(feature.properties.mag))
            
        }
    });

    CreateMap(earthquakes);
}
  
function CreateMap(earthquakes) {
  

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
   
    var baseMaps = {
      "Dark Map": darkmap
    };
  
    
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    
    var myMap = L.map("map", {
      center: [31,-99],
      zoom: 3,
      layers: [darkmap, earthquakes]
    });
  
    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function (map) {
    
   
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];
  
        div.innerHTML+='Magnitude<br><hr>'
    
        
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + GetColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(myMap);
  
}