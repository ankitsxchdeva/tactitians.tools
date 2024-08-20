# This command is used to update companion_statistics any time that there is new entries added into match_data.

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



# Maybe it would be better to build this into the existing python script for collect_match_data.py? OR run an entriely entirely new script that runs collect_match_data.py a bunch of times and also updates companion_statistics.