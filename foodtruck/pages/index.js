import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'

import CurrentTrucks from './layouts/CurrentTrucks'
import TruckSchedule from './layouts/TruckSchedule'

export default function FoodTruckView() {
  let [allTruckData, setAllTruckData] = useState([])
  let [todayTruckData, setTodayTruckData] = useState([])
  let [nearbyTruckData, setNearbyTruckData] = useState([])
  let [currLoc, setCurrLoc] = useState([37.781337576301475, -122.43224052397692])
  let [distanceLimit, setDistanceLimit] = useState(3000) // in feet; 1 SF city block is ~300ft

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
  }, [todayTruckData])

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

  function filterNearby() {
    var nearby = []
    for (let i=0; i < todayTruckData.length; i++) {
      // make parseFloat helper function?
      let truckLoc = [parseFloat(todayTruckData[i].latitude), parseFloat(todayTruckData[i].longitude)]
      let distance = getDistance(currLoc[0], currLoc[1], truckLoc[0], truckLoc[1])
      if (distanceLimit >= distance) {
        nearby.push({
          data: todayTruckData[i],
          distance: Math.ceil(distance / 10) * 10
        })
      }
    }
    console.log("nearby ", nearby)
    setNearbyTruckData(nearby)
  }

  function filterByToday() {
    var hereToday = []

    var today = new Date();
    var day = today.getDay()

    for (let i=0; i < allTruckData.length; i++) {
      // HARDCODED FOR DEMO PURPOSES
      // otherwise would be compared to "day"
      if (6 === parseInt(allTruckData[i].dayorder)) {
        hereToday.push(allTruckData[i])
      }
    }

    setTodayTruckData(hereToday)
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

          <div className={styles.section}>
            <div>
              <h1>Nearby Right Now</h1>
              <p>Within 2 city blocks of [PLACEHOLDER ADDRESS]</p>
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
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          Powered by Hunger
        </a>
      </footer>
    </div>
  )
}
