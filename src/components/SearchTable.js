import React from 'react';

function distance(latitude1, longitude1, latitude2, longitude2) {
    const pie180 = Math.PI/180;
    const a = 0.5 - Math.cos((latitude2 - latitude1) * pie180)/2 + Math.cos(latitude1 * pie180) * Math.cos(latitude2 * pie180) * (1 - Math.cos((longitude2 - longitude1) * pie180))/2;
    return 6371 * 2 * Math.asin(Math.sqrt(a)); // Distance between two points in km
}

export default class SearchTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            longitude: this.props.longitude,
            latitude: this.props.latitude,
            cameraList: [],
            filteredList: [],
            inputStyle: {width:"20rem",background:"#F2F1F9", border:"none", padding:"0.5rem"}
        };
}

    componentDidMount() {
        this.setState({
            cameraList: this.props.dataToTable,
            filteredList: this.sortCameraList(this.props.dataToTable)
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.cameraList !== this.props.dataToTable){
            this.setState({
                cameraList: this.props.dataToTable,
                filteredList: this.sortCameraList(this.props.dataToTable)
            });
        }
        if (this.props.longitude !== this.state.longitude || this.props.latitude !== this.state.latitude) {
            this.setState({ 
                longitude: this.props.longitude,
                latitude: this.props.latitude,
                filteredList: this.sortCameraList(this.props.dataToTable)
            });
        }
    }

    sortCameraList(data){
        let result = [];
        for(let i = 0; i < data.length; i++){
            data[i].avstand = distance(this.props.latitude, this.props.longitude, data[i].breddegrad, data[i].lengdegrad);
            result.push(data[i]);
        }
        result.sort((a, b) => a.avstand - b.avstand);
        return result;
    }

    filterCameraList(string){
        string = string.toLowerCase();    
        const result = this.state.cameraList.filter(camera => camera.stedsnavn.toLowerCase().includes(string) === true);
        this.setState({filteredList: result})
    }

    displayCameraList(){
        return this.state.filteredList.map((camera)=>{
            return <tr key = {camera.id}>
                    <td>{camera.id}</td> 
                    <td>{camera.stedsnavn}</td>
                    <td>{camera.avstand}</td>
                </tr>
        })
    }

    render() {
        return <div>
            <input 
                style = {this.state.inputStyle}
                key="input"
                placeholder={"Søk her!"}
                onChange={(e) => this.filterCameraList(e.target.value)}
            />
            <div className = "table"> 
                <table className = "CameraTable">
                    <thead>
                        <tr>
                            <th>ID:</th>
                            <th>Stedsnavn:</th>
                            <th>Avstand:</th>
                        </tr>
                    </thead>
                    <tbody>
                       {this.displayCameraList()}
                    </tbody>
                </table>
            </div>
        </div>
    }
}
