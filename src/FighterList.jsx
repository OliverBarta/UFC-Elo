import './FighterList.css'

import eloData from '/Users/oliver/UFC-Elo/wikipedia/fighterElo.json'



function FighterList() {

    const fighterNames = Object.keys(eloData);

    return (

        <>
            <div className='grid'>
                <div className='cellTitle'>Name</div>
                <div className='cellTitle'>Elo</div>

                {fighterNames.map(name => (
                    <>
                        <div className="cell" id={name}>{name}</div>
                        <div className="cell" id={name+"Elo"}>{eloData[name].toFixed(0)}</div>
                    </>
                ))}
            </div>
        </>
    )
}

export default FighterList