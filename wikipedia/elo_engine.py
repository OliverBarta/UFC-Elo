import json
from pathlib import Path

#fighter1 is always the winner unless there is a draw
def calculate_elo(fighter1, fighter2, winner,k):
    fighter1_elo = allFighters[fighter1]
    fighter2_elo = allFighters[fighter2]
    expected1 = 1/(1+10**((fighter2_elo-fighter1_elo)/400))
    expected2 = 1-expected1
    
    #adjusts the elo based on the result
    if winner != "Draw":
        fighter1_elo = fighter1_elo + k*(1-expected1)
        fighter2_elo = fighter2_elo + k*(0-expected2) 
    else:
        fighter1_elo = fighter1_elo + k*(0.5-expected1)
        fighter2_elo = fighter2_elo + k*(0.5-expected2)

    allFighters[fighter1] = fighter1_elo
    allFighters[fighter2] = fighter2_elo





#get the json file containing all the matches and their results

BASE_DIR = Path(__file__).resolve().parent

json_path = BASE_DIR / "allMatches.json"

matches = []
with open(json_path,'r', encoding='utf-8') as file:
     matches = json.load(file)

allFighters = {}
size = len(matches)

k = 32 #adjustable value 
starting_elo = 1000 #adjustable value
#iterates through all the fights and calculates the elo
for i in range(size-1,0,-1):
    fighter1 = matches[i]["fighter1"]
    fighter2 = matches[i]["fighter2"]
    winner = matches[i]["winner"]
    
    #adds new fighters to the array
    if fighter1 not in allFighters:
        allFighters[fighter1] = starting_elo

    if fighter2 not in allFighters:
        allFighters[fighter2] = starting_elo
    
    calculate_elo(fighter1, fighter2, winner, k)


#writes the elo into a json file
json_wpath = BASE_DIR / "fighterElo.json"

with open(json_wpath, "w", encoding="utf-8") as file:
    json.dump(allFighters, file, indent=4, ensure_ascii=False)

