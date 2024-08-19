# MERGE TABLES TOGETHER INTO STATS 
INSERT INTO companion_statistics (companion_name, games_played, top_4_percentage, win_percentage)
SELECT 
    c.name AS companion_name,
    COUNT(md.match_id) AS games_played,
    SUM(CASE WHEN md.placement <= 4 THEN 1 ELSE 0 END)::float / COUNT(md.match_id) * 100 AS top_4_percentage,
    SUM(CASE WHEN md.placement = 1 THEN 1 ELSE 0 END)::float / COUNT(md.match_id) * 100 AS win_percentage
FROM 
    match_data md
JOIN 
    companions c ON md.content_id = c.content_id
GROUP BY 
    c.name
ORDER BY 
    top_4_percentage DESC
ON CONFLICT (companion_name) DO UPDATE 
SET 
    games_played = EXCLUDED.games_played,
    top_4_percentage = EXCLUDED.top_4_percentage,
    win_percentage = EXCLUDED.win_percentage;

# TO CLEAN OUT BOT GAMES
DELETE FROM match_data
WHERE match_id IN (
     SELECT DISTINCT match_id
     FROM match_data
     WHERE puuid = 'BOT'
);
