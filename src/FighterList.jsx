import './FighterList.css'

import eloData from '/Users/oliver/UFC-Elo/wikipedia/fighterElo.json'


function FighterList() {

    return (

        <>
            <div className='grid'>
                <div>Test</div>

                {eloData.map(name => (
                    <div id={name}>{name}</div>
                ))}
            </div>
        </>
    )
}

export default FighterList