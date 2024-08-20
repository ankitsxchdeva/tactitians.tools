import time
import requests
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Database configuration
db_config = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT', 5432)
}

# Riot Games API Key
API_KEY = os.getenv('RIOT_API_KEY')

def get_db_connection():
    attempt = 0
    while attempt < 5:  # Try to connect up to 5 times
        try:
            conn = psycopg2.connect(**db_config)
            return conn
        except OperationalError as e:
            attempt += 1
            print(f"Attempt {attempt}: Could not connect to the database. Retrying in 5 seconds...")
            time.sleep(5)
    raise OperationalError("Could not connect to the database after several attempts.")

# Insert match data into the database
def insert_match_data(match_id, content_id, puuid, placement):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = sql.SQL("""
        INSERT INTO match_data (match_id, content_id, puuid, placement)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (match_id, content_id, puuid) DO NOTHING;
    """)

    cursor.execute(query, (match_id, content_id, puuid, placement))
    conn.commit()
    cursor.close()
    conn.close()

# Function to fetch match data
def fetch_match_data(match_id):
    url = f"https://americas.api.riotgames.com/tft/match/v1/matches/{match_id}?api_key={API_KEY}"

    response = requests.get(url)

    if response.status_code == 200:
        return response.json()
    elif response.status_code == 404:
        print(f"Match {match_id} is not a TFT match.")
        return None
    elif response.status_code == 429:
        print("Rate limit exceeded, waiting for 1 second...")
        time.sleep(1)
        return fetch_match_data(match_id)
    else:
        print(f"Error fetching match {match_id}: {response.status_code}")
        return None

# Main function to iterate through match IDs and gather data
def gather_match_data(start_id, end_id, max_games=140):
    games_processed = 0
    last_processed_match_id = None

    for match_id_num in range(start_id, end_id + 1):
        if games_processed >= max_games:
            break

        match_id = f"NA1_{match_id_num}"
        print(f"Fetching data for match {match_id}...")

        match_data = fetch_match_data(match_id)

        if match_data:
            participants = match_data['info']['participants']

            for participant in participants:
                content_id = participant['companion']['content_ID']
                puuid = participant['puuid']
                placement = participant['placement']
                insert_match_data(match_id, content_id, puuid, placement)

            games_processed += 1
            last_processed_match_id = match_id

    if last_processed_match_id:
        print(f"Stopped after {games_processed} games. Last processed match ID: {last_processed_match_id}")

if __name__ == "__main__":
    start_match_id = 5069919925
    end_match_id = 5089788886

    gather_match_data(start_match_id, end_match_id)

# Stopped after 140 games. Last processed match ID: NA1_5069920687#

