import matches from '../wikipedia/allMatches.json'

function calculate_elo(fighter1, fighter2, winner, k){
    fighter1_elo = allFighters.fighter1;
    fighter2_elo = allFighters.fighter2;

    expected1 = 1/(1+10**((fighter2_elo-fighter1_elo)/400));
    expected2 = 1-expected1;
    
    //adjusts the elo based on the result
    if (winner != "Draw"){
        fighter1_elo = fighter1_elo + k*(1-expected1);
        fighter2_elo = fighter2_elo + k*(0-expected2);
    }
    else{
        fighter1_elo = fighter1_elo + k*(0.5-expected1);
        fighter2_elo = fighter2_elo + k*(0.5-expected2);
    }

    allFighters.fighter1 = fighter1_elo;
    allFighters.fighter2 = fighter2_elo;
};


allFighters = {};

size = len(matches);

k = 32 //adjustable value 
starting_elo = 1000 //adjustable value
//iterates through all the fights and calculates the elo
for (i = size-1; i >= 0; i--){
    fighter1 = matches[i]["fighter1"];
    fighter2 = matches[i]["fighter2"];
    winner = matches[i]["winner"];
    
    //adds new fighters to the array
    if (!allFighters.has(fighter1)){
        allFighters[fighter1] = starting_elo;
    }
    if (!allFighters.has(fighter2)){
        allFighters[fighter2] = starting_elo;
    }
    
    calculate_elo(fighter1, fighter2, winner, k);
}

