import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'

import FoodTruckView from './layouts/FoodTruckView'

export default function Main() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Food Trucks</title>
        <meta name="description" content="if you're hungry and you know it" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <FoodTruckView />
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
