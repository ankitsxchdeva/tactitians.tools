from flask import Flask, jsonify, render_template
from flask_cors import CORS
import psycopg2
from dotenv import load_dotenv
import os

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Load environment variables from the .env file
load_dotenv()

# Database configuration
db_config = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT', 5432)
}

def get_db_connection():
    return psycopg2.connect(**db_config)

# Endpoint to serve the HTML page
@app.route('/')
def index():
    return render_template('index.html')

# API endpoint to serve the Tactician data
@app.route('/api/companions', methods=['GET'])
def get_companions():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name, icon_path FROM companions")
    companions = cursor.fetchall()
    cursor.close()
    conn.close()

    # Convert the fetched data to a list of dictionaries
    companions_list = [{"name": row[0], "icon_path": row[1]} for row in companions]

    return jsonify(companions_list)

# API endpoint to serve companion statistics
@app.route('/api/companion_stats', methods=['GET'])
def get_companion_stats():
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    SELECT companion_name, games_played, top_4_percentage, win_percentage, average_placement
    FROM companion_statistics
    ORDER BY top_4_percentage DESC;
    """

    cursor.execute(query)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    result = [
        {
            'companion_name': row[0],
            'games_played': row[1],
            'top_4_percentage': row[2],
            'win_percentage': row[3],
            'average_placement': row[4]
        } for row in rows
    ]

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
