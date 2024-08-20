

# TO CLEAN OUT BOT GAMES
DELETE FROM match_data
WHERE match_id IN (
     SELECT DISTINCT match_id
     FROM match_data
     WHERE puuid = 'BOT'
);
