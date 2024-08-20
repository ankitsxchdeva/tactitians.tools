import time
import requests
import psycopg2
from psycopg2 import sql
from psycopg2.extras import execute_values
from dotenv import load_dotenv
import os
import signal

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

# Signal handler for graceful cancellation
stop_processing = False

def signal_handler(sig, frame):
    global stop_processing
    print("Received signal to stop processing.")
    stop_processing = True

signal.signal(signal.SIGINT, signal_handler)

def get_db_connection():
    attempt = 0
    while attempt < 5:  # Try to connect up to 5 times
        try:
            conn = psycopg2.connect(**db_config)
            return conn
        except psycopg2.OperationalError as e:
            attempt += 1
            print(f"Attempt {attempt}: Could not connect to the database. Retrying in 5 seconds...")
            time.sleep(5)
    raise psycopg2.OperationalError("Could not connect to the database after several attempts.")

# Insert match data into the database
def insert_match_data_batch(match_data_batch):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = sql.SQL("""
        INSERT INTO match_data (match_id, content_id, puuid, placement)
        VALUES %s
        ON CONFLICT (match_id, content_id, puuid) DO NOTHING;
    """)

    execute_values(cursor, query, match_data_batch)
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

# Update companion_statistics table with new data from match_data
def update_companion_statistics():
    conn = get_db_connection()
    cursor = conn.cursor()

    update_query = """
        INSERT INTO companion_statistics (companion_name, games_played, top_4_percentage, win_percentage, average_placement)
        SELECT 
            c.name AS companion_name,
            COUNT(m.match_id) AS games_played,
            100.0 * SUM(CASE WHEN m.placement <= 4 THEN 1 ELSE 0 END) / COUNT(m.match_id) AS top_4_percentage,
            100.0 * SUM(CASE WHEN m.placement = 1 THEN 1 ELSE 0 END) / COUNT(m.match_id) AS win_percentage,
            AVG(m.placement) AS average_placement
        FROM 
            companions c
        JOIN 
            match_data m ON c.content_id = m.content_id
        GROUP BY 
            c.name
        ON CONFLICT (companion_name) DO UPDATE 
        SET 
            games_played = EXCLUDED.games_played,
            top_4_percentage = EXCLUDED.top_4_percentage,
            win_percentage = EXCLUDED.win_percentage,
            average_placement = EXCLUDED.average_placement;
    """

    cursor.execute(update_query)
    conn.commit()
    cursor.close()
    conn.close()

# Main function to iterate through match IDs and gather data in batches
def gather_match_data(start_id, end_id, batch_size=140, sub_batch_size=20):
    while start_id <= end_id and not stop_processing:
        print(f"Starting batch with start ID: {start_id}")
        games_processed = 0
        match_data_batch = []

        for match_id_num in range(start_id, end_id + 1):
            if stop_processing or games_processed >= batch_size:
                break

            match_id = f"NA1_{match_id_num}"
            print(f"Fetching data for match {match_id}...")

            match_data = fetch_match_data(match_id)

            if match_data:
                participants = match_data['info']['participants']

                # Skip the game if any participant has a PUUID containing BOT
                if any("BOT" in participant['puuid'] for participant in participants):
                    print(f"Skipping match {match_id} due to BOT participant.")
                    continue

                for participant in participants:
                    content_id = participant['companion']['content_ID']
                    puuid = participant['puuid']
                    placement = participant['placement']
                    match_data_batch.append((match_id, content_id, puuid, placement))

                if len(match_data_batch) >= sub_batch_size:
                    insert_match_data_batch(match_data_batch)
                    match_data_batch.clear()

                games_processed += 1

        if match_data_batch:
            insert_match_data_batch(match_data_batch)

        print(f"Finished batch. Processed {games_processed} games.")

        # Update start_id for the next batch
        start_id += batch_size

        # Update companion_statistics after each batch
        update_companion_statistics()

    print("Data collection completed or stopped.")

if __name__ == "__main__":
    start_match_id = 5069923864
    end_match_id = 5089788886

    gather_match_data(start_match_id, end_match_id)
