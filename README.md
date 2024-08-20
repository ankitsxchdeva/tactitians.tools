# tacticians.tools

This project is a massive waste of time. All it does it scrape through TFT games and compile statistics on different little legends (top 4%, win % and average placement). As everyone knows, TFT is a pay-to-win game and the more expensive the little legend the better your results will be. 

## This project is currently on hold while I wait for a production key. Using a development key doesn't let me process enough meaningful data.

## Configuration

This repository contains both the front-end and back-end of the project. To setup the back-end for local development please see `src/config.md`

## File structure

src/
├── templates/
│   └── **index.html** - landing page for the flask API
├── **venv/**
├── **.env***
├── **app.py** - flask API that pulls from the database 
├── **collect_match_data.py** - script for pulling from the Riot games API (match endpoint)
├── **config.md** - instructions for setting up a development environment
├── **populate_companions.py** - script for pulling images and names of each little legend
├── **requirements.txt** - python requirements
├── **schema.md** - database schema layout
├── **.gitignore*
├── **CNAME**
├── **index.html** - homepage
├── **privacy_policy.html**
├── **README.md** - this page
├── **riot.txt**
├── **scripts.js** - javascript
├── **styles.css** - stylesheet
├── **terms_of_service.html**
└── **terms_of_service.css** - stylesheet for terms_of_service.html and privacy_policy.html

## Contribution

This project is not currently setup for collaborators. I hope to add this soon but currently it's a little bit too messy to have other people work on it. 

## Hosting

Front-end is hosted on GitHub pages as it is static, the database is hosted on AWS RDS, and the API is hosted on 

## Todo

Bugs/errors:

- Need to calculate games analyzed and last updated stats (maybe save this for later)

- Need to do something to speed up time for the site to load, not sure what we are doing wrong here

- Figure out fuzzy search for the entire table

- Figure out sorting so that it doesn't include random tactitians with 0 play rate.

API key request:

- write a nice looking summary of the application

- riot.txt thingy after that.

Next up to do:

- Setup some sort of chron job to automatically runs the match data api

- Fix the fuzzy search with some library

- Figure out how the process will update for a new champion

- Maybe write some sort of python thing that will let you add another little legend without much work

Images:

- Click to expand or something like that

- Host locally and make the images webp or something that actually works

- Fix the bug for Apprentice Sprite image not being there

Meta project things to do:

- Make a nice and readable readme

- Maybe add contribution guidelines as well?

- Not sure if I open source this but something like that could be cool I think

- Apply for prod api code

- Fix file structure and make it look really nice as well

Frontend:

- Hosted on github pages.
- Static & basic html/js/css

Backend:

- Python & flask
- Hosted on render 
- Get list of tactitions from here: https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/companions.json
- Get each game from somewhere else

Database:

- PostgreSQL
- Hosted on AWS RDS(?)