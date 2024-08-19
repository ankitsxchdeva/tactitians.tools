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

# Fetch the JSON data from the URL
def fetch_companion_data():
    url = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/companions.json"
    response = requests.get(url)
    return response.json()

# Process and insert data into the PostgreSQL database
def process_and_insert_data(companions):
    conn = psycopg2.connect(**db_config)
    cursor = conn.cursor()

    for companion in companions:
        content_id = companion.get('contentId')
        if not content_id:
            print(f"Skipping entry: {companion}")
            continue

        name = companion.get('name', 'Unknown')
        tier = companion['level']
        tiered_name = f"{name} Tier {tier}" if tier > 1 else name
        icon_path = companion.get('loadoutsIcon', '')

        cursor.execute("""
            INSERT INTO companions (content_id, name, tier, icon_path)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (content_id) DO NOTHING;
        """, (content_id, tiered_name, tier, icon_path))

    conn.commit()
    cursor.close()
    conn.close()

# Run the data fetching and processing
if __name__ == "__main__":
    companions = fetch_companion_data()
    process_and_insert_data(companions)
    print("Companion data has been successfully updated.")
