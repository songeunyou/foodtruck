import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import ftStyles from '../../styles/TruckSchedule.module.scss'

import InfoCard from '../components/InfoCard'

function TruckTime({ id, handleSelectTruck, start24, end24 }) {
  const startTime = parseInt(start24.split(":")[0])
  const endTime = parseInt(end24.split(":")[0])

  const truckTimeStyle = {
    marginLeft: `${startTime * 35}px`,
    width: `${(endTime - startTime) * 35}px`,
    background: `hsl(${200 + (id * 30)}, 90%, 61%)`
  }

  return (
    <div
      className={ftStyles.truckTime}
      style={truckTimeStyle}
      onMouseOver={() => handleSelectTruck(id)} />
  )
}

export default function TruckSchedule({ nearbyTrucks }) {
  let [selectedTruck, setSelectedTruck] = useState()

  function handleSelectTruck(i) {
    setSelectedTruck(nearbyTrucks[i])
  }

  let timeStamps = Array.from({length: 11}, (_, i) => i + 1)
  timeStamps = timeStamps.concat(timeStamps)
  timeStamps.unshift("🌑")
  timeStamps.push("🌑")
  timeStamps.splice(12, 0, "🌞")

  return (
    <div className={ftStyles.schedule}>
      <div className={ftStyles.scheduleBG}>
        <div className={ftStyles.timestamps}>
          {timeStamps.map(time =>
            <p className={ftStyles.timestamp}>{time}</p>
          )}
        </div>
        <div>
          {nearbyTrucks.map((truck, i) =>
            <TruckTime key={i} id={i} handleSelectTruck={handleSelectTruck} {...truck.data}/>
          )}
        </div>
      </div>

      <div className={ftStyles.truckInfo}>
        {selectedTruck ?
          <InfoCard distance={selectedTruck.distance} {...selectedTruck.data}/>
          :
          <div>
            <p>Hover over the schedule to view truck details</p>
          </div>
        }
      </div>
    </div>
  )
}
