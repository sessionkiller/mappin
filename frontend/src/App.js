import Map, {Marker, Popup} from 'react-map-gl';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';
import React, { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'
import request from './utils/request';
import TimeAgo from 'timeago-react'; 
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [zoom , setZoom] = useState(4);
  const [pins , setPins] = useState([]);
  const [currentPlaceId , setCurrentPlaceId] = useState(null);
  const [newPlace , setNewPlace] = useState(null);
  const [showModal, setShowModal] = useState(null);

  const mapRef = useRef();

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await request.get('/pins');
        setPins(res.data)
      } catch (error) {
        console.log(error);
      }
    }

    getPins();
  }, [])

  const handleZoom  = (e) => {
    setZoom(e.viewState.zoom);
  }

  const handleMarkerClick = (e, id,lat, long) => {
    e.stopPropagation();
    setCurrentPlaceId(id)

    mapRef.current.easeTo({center: [long, lat], zoom, duration: 1000});
  }

  const handleAddClick = (e) => {
    const {lng: long, lat} = e.lngLat;
    setNewPlace({
      lat,
      long
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPin = {
      username: currentUsername,
      title: e.target[0].value,
      desc: e.target[1].value,
      rating: e.target[2].value,
      lat: newPlace.lat,
      long: newPlace.long
    }

    try {
      const res = await request.post('/pins', newPin);
      setPins(prevPins => [...prevPins, res.data]);
      setNewPlace(null)
    } catch (error) {
      console.log(error);
    }

    // e.target.reset();
  }

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };

  return (
    <div className="App">
      <Map
        initialViewState={{
          longitude: 17,
          latitude: 46,
          zoom: 4
        }}
        ref={mapRef}
        onZoomEnd={handleZoom}
        style={{width: '100vw', height: '100vh'}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onDblClick={handleAddClick}
      >
        {
          pins.map(p => (
            <React.Fragment key={p._id}>
              <Marker longitude={p.long} latitude={p.lat} anchor="bottom" >
                <RoomIcon style={{fontSize: zoom * 7, color: currentUsername === p.username ? 'tomato' : 'slateblue'}} onClick={(e) => handleMarkerClick(e, p._id, p.lat, p.long)}/>
              </Marker>
              {p._id ===  currentPlaceId &&
                <Popup 
                  longitude={p.long} 
                  latitude={p.lat}
                  anchor="left"
                  onClose={() => setCurrentPlaceId(null)}
                >
                  <div className='card'>
                    <label>Place</label>
                    <h4 className='place'>{p.title}</h4>
                    <label>Review</label>
                    <p className='desc'>{p.desc}</p>
                    <label>Rating</label>
                    <div className='stars'>
                      {Array(p.rating).fill(<StarIcon className='star' />)}
                    </div>
                    <label>Information</label>
                    <span className='username'>Created by <b>{p.username}</b></span>
                    <span className='date'>
                      <TimeAgo
                        datetime={p.createdAt}
                      />
                    </span>
                  </div>
                </Popup>
               }
               {
                newPlace && 
                <Popup 
                    longitude={newPlace.long} 
                    latitude={newPlace.lat}
                    anchor="left"
                    onClose={() => setNewPlace(null)}
                  >
                    <div>
                      <form onSubmit={handleSubmit}>
                        <label>Title</label>
                        <input placeholder='Enter a title' />
                        <label>Review</label>
                        <textarea placeholder='Say something about this place' />
                        <label>Rating</label>
                        <select>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                        </select>
                        <button className='submitButton' type='submit' >Add Pin</button>
                      </form>
                    </div>
                </Popup>
              }
            </React.Fragment>
          ))
        }

        {currentUsername ? (
          <button className='button logout' onClick={handleLogout}>Log out</button>
        ) : (
          <div className='buttons'>
            <button className='button login' onClick={() => setShowModal('login')}>Login</button>
            <button className='button register' onClick={() => setShowModal('register')}>Register</button>
          </div>
        )}
        {showModal === 'register' && <Register setShowModal={setShowModal} />}
        {showModal === 'login' && (
          <Login
            setShowModal={setShowModal}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}
      </Map>
    </div>
  );
}

export default App;
