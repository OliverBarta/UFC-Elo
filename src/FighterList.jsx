import './FighterList.css'

import eloData from './assets/fighterEloFinal.json'



function FighterList() {

    const fighterNames = Object.keys(eloData);

    const eloHighToLow = fighterNames.sort((a, b) => {

        return eloData[b] - eloData[a];

    });

    return (

        <>
            <div className='grid'>
                <div className='cellTitleName'>Name</div>
                <div className='cellTitleElo'>Elo</div>

                {eloHighToLow.map(name => (
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