import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import ftStyles from '../../styles/CurrentTrucks.module.scss'

function InfoCard({ distance, applicant, optionaltext }) {
  return (
    <div>
      <div>
        <h3>{applicant}</h3>
        <p>{optionaltext}</p>
      </div>

      <div>
        <p>{distance}ft away</p>
        <a>See on Map</a>
      </div>
    </div>
  )
}

export default function CurrentTrucks({ nearbyTrucks }) {

  useEffect(() => {

  })

  return (
    <div className={ftStyles.container}>
      {nearbyTrucks.map((truck, i) =>
        <InfoCard key={i} distance={truck.distance} {...truck.data }/>
      )}
    </div>
  )
}
