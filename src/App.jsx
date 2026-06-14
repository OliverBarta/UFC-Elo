import { useState } from 'react'

import TopBar from './TopBar'
import FighterList from './FighterList'


import './App.css'

function App() {
  

  return (
    <>
      <h1>UFC Elo</h1>
      <div className='searchArea'>
        <button className='filtersToggle'>Filters</button>
        <input type="text" placeholder="Enter fighter name" autoComplete="off" className='searchBar' />
      </div>
      <FighterList/>


    </>
  )
}

export default App
