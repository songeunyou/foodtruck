import React, { useState, useEffect } from 'react'
import styles from '../../styles/FoodTruckView.module.scss'

import CurrentTrucks from './CurrentTrucks'
import TruckSchedule from './TruckSchedule'
import Search from '../components/Search'

let defaultLocation = {
  name: "455 MARKET ST",
  lat: 37.791258708308668,
  lon: -122.398658299326641
}

/*----- helper functions to find distance between current location and food trucks -----*/

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function getDistance(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const feet = 3280.839895;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var distance = earthRadiusKm * c * feet

  return distance;
}

/*------------------------ end distance calc helper functions --------------------------*/

function FoodTruckView() {
  let [allTruckData, setAllTruckData] = useState([])
  let [todayTruckData, setTodayTruckData] = useState([])
  let [nearbyTruckData, setNearbyTruckData] = useState([])
  let [location, setLocation] = useState(defaultLocation)
  let [distanceLimit, setDistanceLimit] = useState(1200) // in feet; 1 SF city block is ~300ft

  useEffect(() => {
    fetch('https://data.sfgov.org/resource/jjew-r69b.json')
      .then(res => res.json())
      .then(data => setAllTruckData(data))
  }, [])

  useEffect(() => {
    filterByToday()
  }, [allTruckData])

  useEffect(() => {
    filterNearby()
  }, [todayTruckData, location])

  // only return the food trucks that are operational today
  function filterByToday() {
    var hereToday = []

    var today = new Date();
    var day = today.getDay()

    for (let i=0; i < allTruckData.length; i++) {
      if (day === parseInt(allTruckData[i].dayorder)) {
        hereToday.push(allTruckData[i])
      }
    }
    setTodayTruckData(hereToday)
  }

  // only return the food trucks that are within 4 blocks of the selected address
  function filterNearby() {
    var nearby = []
    for (let i=0; i < todayTruckData.length; i++) {
      let truckLoc = [parseFloat(todayTruckData[i].latitude), parseFloat(todayTruckData[i].longitude)]
      let distance = getDistance(location.lat, location.lon, truckLoc[0], truckLoc[1])
      if (distanceLimit >= distance) {
        nearby.push({
          data: todayTruckData[i],
          distance: Math.ceil(distance / 10) * 10
        })
      }
    }
    setNearbyTruckData(nearby)
  }

  // set results of the location search
  function handleSearch(newLocation) {
    setLocation(newLocation)
    filterNearby()
  }

  return(
    <div className={styles.foodTruckView}>
      {allTruckData ?
        <Search
          allTruckData={allTruckData}
          handleSearch={handleSearch}/> : ""}

      <div className={styles.section}>
        <div>
          <h1>Nearby Right Now</h1>
          <p>Within 4 city blocks of {location.name}</p>
        </div>
        {nearbyTruckData ?
          <CurrentTrucks nearbyTrucks={nearbyTruckData} /> : ""}
      </div>

      <div className={styles.section}>
        <h1 className={styles.header}>Trucks Nearby Today</h1>
        {nearbyTruckData ?
          <TruckSchedule nearbyTrucks={nearbyTruckData} /> : ""}
      </div>
    </div>
  )
}

export default FoodTruckView
