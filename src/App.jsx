import { useState, useEffect } from 'react'

import TopBar from './TopBar'
import FighterList from './FighterList'


import './App.css'

function App() {
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  
  // toggles the filter open and closed
  const toggleFilterMenu = () => {
    setFilterIsOpen(!filterIsOpen);
  };

      // Checks for resized windows
      useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 900);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, []);

  return (
    <>
      <div className='mainArea'>
        <h1>UFC Elo</h1>
        <div className='searchArea'>
          <button className='filtersToggle'>Filters</button>
          <input type="text" placeholder="Enter fighter name" autoComplete="off" className='searchBar' />
        </div>
        <FighterList/>
      </div>

    </>
  )
}

export default App
