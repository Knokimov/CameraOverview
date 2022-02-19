import React from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import myImage from './Icon.png';
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcml5bSIsImEiOiJja3B6a3g0aGMwcXZ1MnRxY3d0YmN2M29rIn0.bKhL4ZElL9yHk7VScNRRAQ';

function dataManagement(data){
    const features = [];
      
    for(let i = 0; i< data.length; i++){
        let description = 
          `id: ${data[i].id}</br>
          stedsnavn: ${data[i].stedsnavn}</br>
          veg: ${data[i].veg}</br>
          landsdel: ${data[i].landsdel}</br>
          vaervarsel: ${data[i].vaervarsel}</br>
          info: ${data[i].info}</br>
          fylkesnummer: ${data[i].fylkesnummer}</br>
          maalestasjonsnummer: ${data[i].maalestasjonsnummer}</br>
          videoformat: ${data[i].videoformat}</br>
          videoUrl: ${data[i].videoUrl}</br>
          videobeskrivelse: ${data[i].videobeskrivelse}</br>
          bildefrekvens: ${data[i].bildefrekvens}</br>
          lengdegrad: ${data[i].lengdegrad}</br>
          breddegrad: ${data[i].breddegrad}</br> `;
        
        features.push({
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [data[i].lengdegrad , data[i].breddegrad]
          },
          'properties': {'title': data[i].stedsnavn,
          'description': description,}
        });
    }
  
    const result = {
        'type': 'geojson',
        'data': 
        {
        'type': 'FeatureCollection',
        'features': features 
        }
    };
    
    return result;
}

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            longitude: this.props.longitude,
            latitude: this.props.latitude,
            zoom: 5,
            cameraList: this.props.dataToMap,
        };
        this.mapContainer = React.createRef();
    }
    
    updateMap(){
        const data = this.props.dataToMap;
        const {longitude, latitude, zoom} = this.state;
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: zoom
        });
  
        map.on('load', function () {
            map.loadImage(myImage, function(error, image) {      
                if (error) throw error; 
                map.addImage('custom-marker', image);        
                map.addControl(new mapboxgl.NavigationControl());
                map.addSource('points',
                    dataManagement(data)
                );

                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'points',
                    'layout': {
                        'icon-image': 'custom-marker',
                        'icon-size': 0.5,
                        'text-field': ['get', 'title'],
                        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                        'text-offset': [0, 1.25],
                        'text-anchor': 'top'
                    }
                });
            });
        });
  
        map.on('click', 'points', function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;
            new mapboxgl.Popup().setLngLat(coordinates).setHTML(description).addTo(map);
        });
    }

    componentDidMount() {
        this.updateMap();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.dataToMap !== this.state.cameraList) {
            this.updateMap();
        }
        if (this.props.longitude !== this.state.longitude || this.props.latitude !== this.state.latitude) {
            this.setState({ 
                longitude: this.props.longitude,
                latitude: this.props.latitude
            });
        }
    }

    render(){
        return <div>
            <div ref={this.mapContainer} className="map-container" />
        </div> 
    }
}
