import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import ftStyles from '../../styles/CurrentTrucks.module.scss'

function InfoCard({ distance, applicant, optionaltext, location }) {
  let locQuery = location.split(" ").join("+") + "+San+Francisco"

  return (
    <div className={ftStyles.infoCard}>
      <div>
        <h3>{applicant}</h3>
        <p>{optionaltext}</p>
      </div>

      <div className={ftStyles.locInfo}>
        <p className={ftStyles.distance}>{distance}ft away</p>
        <a
          className={ftStyles.mapBtn}
          href={`https://www.google.com/maps/search/?api=1&query=${locQuery}`}
          target="blank">View on Map</a>
      </div>
    </div>
  )
}

export default function CurrentTrucks({ nearbyTrucks }) {
  const date = new Date()
  const currHour = date.getHours()

  let currentTrucks = nearbyTrucks.filter(truck => {
    let startTime = parseInt(truck.data.start24.split(":")[0])
    let endTime = parseInt(truck.data.end24.split(":")[0])

    // return true
    // FOR DEMO PURPOSES we won't use the current time
    return startTime <= currHour && endTime > currHour
  })

  return (
    <div className={ftStyles.currentTrucksList}>
      {currentTrucks.length > 0 ?
        currentTrucks.map((truck, i) =>
        <InfoCard key={i} distance={truck.distance} {...truck.data }/>
      )
      :
      <div className={ftStyles.noneNearby}>
        No trucks are nearby at this time :(
      </div>
      }
    </div>
  )
}
