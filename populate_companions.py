import requests
import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv()

# Database configuration using environment variables
db_config = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT', 5432)
}

# Connect to the PostgreSQL database
conn = psycopg2.connect(**db_config)
cursor = conn.cursor()

# Fetch the JSON data from the URL
url = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/companions.json"
response = requests.get(url)
companions = response.json()

# Insert data into the companions table
for companion in companions:
    name = companion.get('name', 'Unknown')  # Directly access the name field
    icon_path = companion.get('loadoutsIcon', '')

    # Insert the companion data into the database
    cursor.execute("""
        INSERT INTO companions (name, icon_path)
        VALUES (%s, %s)
    """, (name, icon_path))

# Commit the transaction and close the connection
conn.commit()
cursor.close()
conn.close()

print("Companions have been successfully added to the database.")
