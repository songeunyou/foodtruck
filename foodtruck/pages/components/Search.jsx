import React, { useState, useEffect } from 'react'
import styles from '../../styles/FoodTruckView.module.scss'

function Search({ allTruckData, handleSearch }) {
  let [searchResults, setSearchResults] = useState([])
  let [locationFound, setLocationFound] = useState(false)

  // handle search input change
  function search(e) {
    let results = []

    for (let i=0; i < allTruckData.length; i++) {
      let searchInput = e.target.value
      let resultStr = allTruckData[i].location.substring(0,searchInput.length)
      if (searchInput.localeCompare(resultStr) === 0) {
        let exists = results.some(el => el.location === allTruckData[i].location)
        if (!exists) {
          results.push(allTruckData[i])
        }
      }

      if (results.length > 5) {
        setSearchResults(results)
        setLocationFound(true)
        return
      }
    }
    setSearchResults(results)
    setLocationFound(false)
  }

  // handle search result selection
  // update location
  function clickSearchResult(name, lat, lon) {
    let loc = {
      name: name,
      lat: parseFloat(lat),
      lon: parseFloat(lon)
    }

    setLocationFound(true)
    setSearchResults([])
    handleSearch(loc)
  }

  return (
    <div>
      <input
        className={styles.search}
        onChange={(e) => search(e)}
        placeholder="search for the nearest address"></input>
      <div className={styles.searchResults}>
        {searchResults.length > 0 ?
          searchResults.map((result, i) =>
            <div key={i} className={styles.searchEntry}>
              <p onClick={() => clickSearchResult(result.location, result.latitude, result.longitude)}>{result.location}</p>
            </div>
          ) :
          <p>{locationFound ? `Showing details for ${location.name}` : "There are no results"}</p>
        }
      </div>
    </div>
  )
}

export default Search;
