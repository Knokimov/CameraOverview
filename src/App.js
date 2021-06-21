import React from 'react';
import Map from './components/Map';
import SearchTable from './components/SearchTable';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            longitude: 10.752245,
            latitude: 59.913868,
            cameraList: [],
        };
    }

    async componentDidMount() {
        const url = 'http://localhost:5000/data/';
        const response = await fetch(url);
        const data = await response.json();
        this.setState({
            cameraList: data,
        });
        
        if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.setState({
                        longitude: position.coords.longitude,
                        latitude: position.coords.latitude
                    });
                })
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    render() {
        return <div>
            <h1> Teleplan Globe Assignment </h1>
            <Map dataToMap = {this.state.cameraList} longitude = {this.state.longitude} latitude = {this.state.latitude} />
            <SearchTable dataToTable = {this.state.cameraList} longitude = {this.state.longitude} latitude = {this.state.latitude}/>
        </div>
    }
}
