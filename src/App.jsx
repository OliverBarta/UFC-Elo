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

  const shouldShowMobileFilter = filterIsOpen && isMobile;

  return (
    <>
      {(!isMobile || filterIsOpen) && <div className='filterArea'>
        <div>test</div>
        {isMobile && <button className='filterTogglePop' onClick={toggleFilterMenu}>Close</button>}
      </div>}
      {!isMobile && <div className='filterAreaInvisible'>
      </div>}
      
      <div className='mainArea'>
        <h1>UFC Elo</h1>
        <div className='searchArea'>
          {isMobile && <button className='searchBarContainer' style={{width: "85px"}} onClick={toggleFilterMenu}>Filters</button>}
          <div className='searchBarContainer'>
            <input type="text" placeholder="Enter fighter name" autoComplete="off" className='searchBar' />
          </div>
        </div>
        <FighterList/>
      </div>

    </>
  )
}

export default App
