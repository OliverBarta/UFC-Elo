import './FighterList.css'

import eloData from './assets/fighterEloFinal.json'



function FighterList({ searchedName }) {

    const fighterNames = Object.keys(eloData);

    const eloHighToLow = fighterNames.sort((a, b) => {
        return eloData[b] - eloData[a];
    });

    const eloHighToLowSearch = eloHighToLow.filter((item) => {
        return item.toLowerCase().includes(searchedName.toLowerCase());
    });

    return (

        <>
            <div className='grid'>
                <div className={eloHighToLowSearch.length === 0 ? 'cellTitleNameOnlyOne' : 'cellTitleName'}>Name</div>
                <div className={eloHighToLowSearch.length === 0 ? 'cellTitleEloOnlyOne' : 'cellTitleElo'}>Elo</div>

                {eloHighToLowSearch.map(name => (
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