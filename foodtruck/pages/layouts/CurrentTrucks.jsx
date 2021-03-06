import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import ftStyles from '../../styles/CurrentTrucks.module.scss'
import cs from '../../styles/Components.module.scss'

import InfoCard from '../components/InfoCard'

export default function CurrentTrucks({ nearbyTrucks }) {
  const date = new Date()
  const currHour = date.getHours()
  let [currentTrucks, setCurrentTrucks] = useState([])

  useEffect(() => {
    getCurrentTrucks()
  }, [nearbyTrucks])

  function getCurrentTrucks() {
    let currTrucks = nearbyTrucks.filter(truck => {
      let startTime = parseInt(truck.data.start24.split(":")[0])
      let endTime = parseInt(truck.data.end24.split(":")[0])

      return startTime <= currHour && endTime > currHour
    })

    setCurrentTrucks(currTrucks)
  }

  return (
    <div className={ftStyles.currentTrucksList}>
      {currentTrucks.length > 0 ?
        currentTrucks.map((truck, i) =>
        <div key={i.toString() + truck.data.applicant} className={ftStyles.infoCardWrapper}>
          {truck ?
            <InfoCard distance={truck.distance} {...truck.data }/> : ""}
        </div>
      )
      :
      <div className={ftStyles.noneNearby}>
        No trucks are nearby at this time
      </div>
      }
    </div>
  )
}
