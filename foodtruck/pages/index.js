import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import CurrentTrucks from './components/CurrentTrucks'
import TruckSchedule from './components/TruckSchedule'

export default function FoodTruckView() {
  let [foodTruckData, setFoodTruckData] = useState([])
  let [nearbyTruckData, setNearbyTruckData] = useState([])
  let [currLoc, setCurrLoc] = useState([37.781337576301475, -122.43224052397692])
  let [distanceLimit, setDistanceLimit] = useState(600) // in yards, ~2 SF city blocks

  useEffect(() => {
    fetch('https://data.sfgov.org/resource/jjew-r69b.json')
      .then(res => res.json())
      .then(data => setFoodTruckData(data))

    filterNearby()
  }, [])

  function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  function getDistance(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371;
    const yards = 1093.61329834;

    var dLat = degreesToRadians(lat2-lat1);
    var dLon = degreesToRadians(lon2-lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var distance = earthRadiusKm * c * yards

    return distance;
  }

  function filterNearby() {
    var nearby = []
    for (let i=0; i < foodTruckData.length; i++) {
      // make parseFloat helper function?
      let truckLoc = [parseFloat(foodTruckData[i].latitude), parseFloat(foodTruckData[i].longitude)]
      if (distanceLimit >= getDistance(currLoc[0], currLoc[1], truckLoc[0], truckLoc[1])) {
        nearby.push(foodTruckData[i])
      }
    }
    setNearbyTruckData(nearby)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Food Trucks</title>
        <meta name="description" content="if you're hungry and you know it" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="foodTruckView">
          <div className="current">
            <div className="currentHeader">
              <h1>Right Now</h1>
              <p>Within 2 city blocks of 23 Major st.</p>
            </div>
            <CurrentTrucks nearbyTrucks={nearbyTruckData} />
          </div>

          <div className="schedule">
            <h1>Food Trucks Throughout Today</h1>
            <TruckSchedule nearbyTrucks={nearbyTruckData} />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Hunger
        </a>
      </footer>
    </div>
  )
}
