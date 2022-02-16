import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import ftStyles from '../../styles/TruckSchedule.module.scss'

import InfoCard from '../components/InfoCard'

function TruckTime({
  id,
  currentlySelected,
  currentlyHovering,
  handleSelectTruck,
  handleHoverTruck,
  start24,
  end24
}) {
  const startTime = parseInt(start24.split(":")[0])
  const endTime = parseInt(end24.split(":")[0])

  const truckTimeStyle = {
    marginLeft: `${startTime * 35}px`,
    width: `${(endTime - startTime) * 35}px`,
    background: `hsl(${200 + (id * 30)}, 90%, 61%)`,
    opacity: id === currentlySelected || id === currentlyHovering ? 1 : 0.25
  }

  return (
    <div
      className={ftStyles.truckTime}
      style={truckTimeStyle}
      onMouseOver={() => handleHoverTruck(id)}
      onClick={() => handleSelectTruck(id)} />
  )
}

export default function TruckSchedule({ nearbyTrucks }) {
  let [selectedTruck, setSelectedTruck] = useState(null)
  let [currentlySelected, setCurrentlySelected] = useState(null)
  let [currentlyHovering, setCurrentlyHovering] = useState(null)

  useEffect(() => {
    setSelectedTruck(null)
  }, [nearbyTrucks])

  function handleHoverTruck(i) {
    setCurrentlyHovering(i)
    if (currentlySelected === null) {
      setSelectedTruck(i === null ? null : nearbyTrucks[i])
    }
  }

  function handleSelectTruck(i) {
    setSelectedTruck(nearbyTrucks[i])
    setCurrentlySelected(i)
  }

  let timeStamps = Array.from({length: 11}, (_, i) => i + 1)
  timeStamps = timeStamps.concat(timeStamps)
  timeStamps.unshift("🌑")
  timeStamps.push("🌑")
  timeStamps.splice(12, 0, "🌞")

  // console.log(nearbyTrucks)

  return (
    <div className={ftStyles.schedule}>
      <div
        className={ftStyles.scheduleBG}
        onMouseLeave={() => setCurrentlyHovering(null)}>
        <div className={ftStyles.timestamps}>
          {timeStamps ? timeStamps.map((time, i) =>
            <p key={i} className={ftStyles.timestamp}>{time}</p>
          ) : ""}
        </div>
        <div>
          {nearbyTrucks ? nearbyTrucks.map((truck, i) =>
            <TruckTime
              key={i.toString() + truck.data.applicant}
              id={i}
              currentlySelected={currentlySelected}
              currentlyHovering={currentlyHovering}
              handleSelectTruck={handleSelectTruck}
              handleHoverTruck={handleHoverTruck}
              {...truck.data}/>) : ""}
        </div>
      </div>

      <div className={ftStyles.truckInfo}>
        {selectedTruck ?
          <InfoCard distance={selectedTruck.distance} {...selectedTruck.data}/>
          :
          <div className={ftStyles.placeholderMsg}>
            <p>Click on the schedule to view truck details</p>
          </div>
        }
      </div>
    </div>
  )
}
