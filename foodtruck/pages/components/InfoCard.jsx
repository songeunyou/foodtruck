import React, { useState, useEffect } from 'react'

import ftStyles from '../../styles/CurrentTrucks.module.scss'
import cs from '../../styles/Components.module.scss'

export default function InfoCard({ starttime, endtime, distance, applicant, optionaltext, location }) {
  let locQuery = location.split(" ").join("+") + "+San+Francisco"
  console.log(starttime)

  return (
    <div className={cs.infoCard}>
      <div>
        <h3>{applicant}</h3>
        <div className={cs.info}>
          <p >{distance}ft away</p>
          <p className={cs.hours}>{starttime} - {endtime}</p>
        </div>
        <p>{optionaltext}</p>
      </div>

      <div className={cs.locInfo}>
        <a className={`${cs.btn} ${ftStyles.btn}`}
          href={`https://www.google.com/maps/search/?api=1&query=${locQuery}`}
          target="blank">
          View on Map
        </a>
      </div>
    </div>
  )
}
