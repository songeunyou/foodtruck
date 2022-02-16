import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'

import CurrentTrucks from './layouts/CurrentTrucks'
import TruckSchedule from './layouts/TruckSchedule'

let defaultLocation = {
  name: "455 MARKET ST",
  lat: 37.791258708308668,
  lon: -122.398658299326641
}
export default function FoodTruckView() {
  let [allTruckData, setAllTruckData] = useState([])
  let [todayTruckData, setTodayTruckData] = useState([])
  let [nearbyTruckData, setNearbyTruckData] = useState([])
  let [location, setLocation] = useState(defaultLocation)
  let [locationFound, setLocationFound] = useState(false)
  let [distanceLimit, setDistanceLimit] = useState(1200) // in feet; 1 SF city block is ~300ft
  let [searchResults, setSearchResults] = useState([])

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

  function search(e) {
    let results = []

    for (let i=0; i < allTruckData.length; i++) {
      let searchInput = e.target.value
      let resultStr = allTruckData[i].location.substring(0,searchInput.length)
      if (searchInput.localeCompare(resultStr) === 0) {
        let exists = results.some(el => el.location === allTruckData[i].location)
        if (!exists) {
          results.push(allTruckData[i])
        }
      }

      if (results.length > 5) {
        setSearchResults(results)
        return
      }
    }
    setSearchResults(results)
    setLocationFound(false)
  }

  function searchNewLocation(name, lat, lon) {
    let loc = {
      name: name,
      lat: parseFloat(lat),
      lon: parseFloat(lon)
    }

    setLocation(loc)
    setLocationFound(true)
    setSearchResults([])
    filterNearby()
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Food Trucks</title>
        <meta name="description" content="if you're hungry and you know it" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.foodTruckView}>

          <input
            className={styles.search}
            onChange={(e) => search(e)}
            placeholder="search for the nearest address"></input>
          <div className={styles.searchResults}>
            {searchResults.length > 0 ?
              searchResults.map((result, i) =>
                <div key={i} className={styles.searchEntry}>
                  <p onClick={() => searchNewLocation(result.location, result.latitude, result.longitude)}>{result.location}</p>
                </div>
              ) :
              <p>{locationFound ? `Showing details for ${location.name}` : "There are no results"}</p>
            }
          </div>

          <div className={styles.section}>
            <div>
              <h1>Nearby Right Now</h1>
              <p>Within 4 city blocks of {location.name}</p>
            </div>
            <CurrentTrucks nearbyTrucks={nearbyTruckData} />
          </div>

          <div className={styles.section}>
            <h1 className={styles.header}>Trucks Nearby Today</h1>
            <TruckSchedule nearbyTrucks={nearbyTruckData} />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://ahseeit.com//king-include/uploads/2021/06/thumb_1623169151756-3385582023.jpg"
          target="_blank"
          rel="noopener noreferrer">
          Powered by Hunger 🍔
        </a>
      </footer>
    </div>
  )
}
