# tacticians.tools

This project is a massive waste of time. All it does it scrape through TFT games and compile statistics on different little legends (top 4%, win % and average placement). As everyone knows, TFT is a pay-to-win game and the more expensive the little legend the better your results will be. 

## This project is currently on hold while I wait for a production key. Using a development key doesn't let me process enough meaningful data.

## Configuration

This repository contains both the front-end and back-end of the project. To setup the back-end for local development please see `src/config.md`

## File structure

**Root Directory**
```
.gitignore
CNAME
index.html - homepage
privacy_policy.html
README.md - this page
riot.txt
scripts.js - javascript
styles.css - stylesheet
terms_of_service.html
terms_of_service.css - stylesheet for terms_of_service.html and privacy_policy.html
src/ - shown below
```
```
src/
├── templates/
│   └── index.html - landing page for the flask API
├── venv/
├── .env*
├── app.py - flask API that pulls from the database 
├── collect_match_data.py - script for pulling from the Riot games API (match endpoint)
├── config.md - instructions for setting up a development environment
├── populate_companions.py - script for pulling images and names of each little legend
├── requirements.txt - python requirements
└── schema.md - database schema layout
```

## Contribution

This project is not currently in a state allowing collaborators. I hope to add this soon but currently it's a little bit too messy to have other people work on it. 

## Hosting

Front-end is hosted on GitHub pages as it is static, the database is hosted on AWS RDS, and the API is hosted on 

## Todo

Bugs/errors:

- Need to calculate games analyzed and last updated stats

- Need to do something to speed up time for the site to load

- Figure out sorting so it doesn't include random tacticians with 0 play rate

Next up to do:

- Setup some sort of chron job to automatically runs the match data api

- Fix the fuzzy search with some library

- Design a process to update the code for any new companion

Images:

- Click to expand the images

- Host locally and make the images webp to improve speed

- Fix the bug for Apprentice Sprite image

Meta project things to do:

- add contribution guidelines lmfao