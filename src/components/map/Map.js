import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import MapGL, { Marker, Popup } from 'react-map-gl';
import { getCity, setCity } from '../../store/actions/cityActions'
import { getRanking } from '../../store/actions/rankActions'
import { getComments } from '../../store/actions/commentActions'
import { getAllRankings } from '../../utils/Ranking'
import { getCityByName } from '../../utils/City'
import Geocoder from 'react-mapbox-gl-geocoder'
import { bindActionCreators } from 'redux'

class Map extends Component {

   constructor(props) {
      super(props);

      this.state = {
         viewport: {
            width: '100%',
            height: '100%',
            latitude: 37.7577,
            longitude: -122.4376,
            zoom: 6
         },
         marker : {
            latitude: 37.7577,
            longitude: -122.4376,
         },
         popupInfo: null,
         showPopup: false,
         isMarkerShowing: false,
         isInputShowing: true,
         rankings: [],
      };
      this.handleSearhResult = this.handleSearhResult.bind(this);
    }

    async componentDidMount() {
      window.addEventListener('resize', this.resize)
      this.resize()
      let rankings = await getAllRankings()
      this.setState({
         rankings: rankings
      })
    }
   
    componentWillUnmount() {
      window.removeEventListener('resize', this.resize)
    }
   
    resize = () => {
      this.handleViewportChange({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    handleViewportChange = viewport => {
      this.setState({
        viewport: { ...this.state.viewport, ...viewport }
      });
    };

    async handleSearhResult(viewport, result) {
      const cityName = result.text
      let city = await getCityByName(cityName)

      if(city){
         viewport.longitude = (viewport.longitude - 0.0394);
         viewport.width = '100%';
         viewport.height = '100%';
         this.setState({
            marker: {
               latitude: viewport.latitude,
               longitude: viewport.longitude
            },
            isMarkerShowing: true
         })
         return this.handleViewportChange({
            ...viewport
         });
      }
      else {
         alert(`Sorry,${cityName} hasn't been ranked yet.`)
      }
    }

    renderPopUp = (ranking) => {
      this.setState({
         popupInfo: ranking, 
         showPopup: true,
         isInputShowing: false
      })
    }

   render() {
      const { viewport, popupInfo, rankings } = this.state;
      const { ranking, city } = this.props;
      const queryParams = {
         types: 'place'
      }

      return (
         <div className="map">
            <MapGL
               {...viewport}
               onViewportChange={this.handleViewportChange}
               mapStyle="mapbox://styles/mapbox/dark-v9"
               mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API}  
               surfaceView={true}
            >

            {rankings.length > 0 ? 
               rankings.map( ranking => {
               let ratingAverage = (Math.round(ranking.average) - 1)
               return(
                  <Marker 
                     key={ranking.cityId}
                     longitude={ranking.coords.longitude}
                     latitude={ranking.coords.latitude} 
                     offsetLeft={-25} 
                     offsetTop={-75}
                  >
                  {ratingAverage === 0 ?
                     <img alt='rating 0' onClick={() => this.renderPopUp(ranking)} src={require("../../assets/images/unicorn_0.png")} className="map-icon" />
                     :
                     ratingAverage === 1 ?
                     <img alt='rating 1' onClick={() => this.renderPopUp(ranking)} src={require("../../assets/images/unicorn_1.png")} className="map-icon" />
                     :
                     ratingAverage === 2 ?
                     <img alt='rating 2' onClick={() => this.renderPopUp(ranking)} src={require("../../assets/images/unicorn_2.png")} className="map-icon" />
                     :
                     ratingAverage === 3 ?
                     <img alt='rating 3' onClick={() => this.renderPopUp(ranking)} src={require("../../assets/images/unicorn_3.png")} className="map-icon" />
                     :
                     ratingAverage === 4 ?
                     <img alt='rating 4' onClick={() => this.renderPopUp(ranking)} src={require("../../assets/images/unicorn_4.png")} className="map-icon" />
                     :
                     ratingAverage === 5 ?
                     <img alt='rating 5' onClick={() => this.renderPopUp(ranking)} src={require("../../assets/images/unicorn_5.png")} className="map-icon" />
                     :
                     <img alt='rating 6' onClick={() => this.renderPopUp(ranking)} src={require("../../assets/images/unicorn_6.png")} className="map-icon" />
                  }
                  {/* <i onClick={() => this.renderPopUp(ranking)} className="fas fa-map-marker-alt fa-5x"></i> */}
                  </Marker>  
               )
               })
               :
               ''
            }
            
            {popupInfo && city.cityId ? 
            <Popup tipSize={7}
               closeOnClick={false}
               anchor="bottom"
               longitude={popupInfo.coords.longitude}
               latitude={popupInfo.coords.latitude}
               offsetLeft={-25} 
               offsetTop={-75}
               onClose={() => this.setState({popupInfo: null, showPopup: false, isInputShowing: true})} 
            >
               <h4><Link to={`/${popupInfo.cityId}`}>{popupInfo.cityName}</ Link></h4>
               <p>User Average: {popupInfo.average ? (popupInfo.average -1 ) : 0}</p>
               <p>Total User Rankings: {popupInfo.totalRanking ? popupInfo.totalRanking : 0}</p>
            </Popup>
            :
            popupInfo ? 
            <Popup tipSize={5}
               anchor="bottom"
               longitude={this.state.marker.longitude}
               latitude={this.state.marker.latitude}
               offsetLeft={-25} 
               offsetTop={-75}
               onClose={() => this.setState({popupInfo: null, showPopup: false, isInputShowing: true})} 
            >
               <h4>No City Ranking Yet.</h4>
            </Popup>
            : 
            null
            }
            {this.state.isInputShowing ?
            <div style={{height: '100%'}}className="container center">
            <p>{ranking ? ranking.totalRankings : null}</p>
     
               <Link to='/create'><button className="btn center rank-btn">Rank your city</button></Link>
               <Geocoder
               viewport={viewport}
               mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API}
               onSelected={this.handleSearhResult}
               hideOnSelect={true}
               className='search-box'
               queryParams={ queryParams }
               />

            </div>
            : null}
            </MapGL>
          
         </div>
      )
   }

}

const mapStateToProps = (state) => {
   return {
      auth: state.firebase.auth,
      city: state.city,
      ranking: state.ranking
   }
}

const mapDispatchToProps = (dispatch) => {
   return {
      ...bindActionCreators({ getRanking, getCity, getComments, setCity}, dispatch)
   }
} 

export default connect(mapStateToProps, mapDispatchToProps)(Map)
