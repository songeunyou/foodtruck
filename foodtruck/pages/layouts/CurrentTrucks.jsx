import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import ftStyles from '../../styles/CurrentTrucks.module.scss'
import cs from '../../styles/Components.module.scss'

function InfoCard({ starttime, endtime, distance, applicant, optionaltext, location }) {
  let locQuery = location.split(" ").join("+") + "+San+Francisco"
  console.log(starttime)

  return (
    <div className={ftStyles.infoCard}>
      <div>
        <h3>{applicant}</h3>
        <div className={ftStyles.info}>
          <p >{distance}ft away</p>
          <p className={ftStyles.hours}>{starttime} - {endtime}</p>
        </div>
        <p>{optionaltext}</p>
      </div>

      <div className={ftStyles.locInfo}>
        <a className={`${cs.btn} ${ftStyles.btn}`}
          href={`https://www.google.com/maps/search/?api=1&query=${locQuery}`}
          target="blank">
          View on Map
        </a>
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

  console.log(nearbyTrucks)

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
