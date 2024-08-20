### Database Schema

#### 1. `companions` Table

This table stores information about each companion (Tactician), including their name and the path to their icon image.

| Column Name  | Data Type | Constraints           | Description                          |
| ------------ | --------- | --------------------- | ------------------------------------ |
| `id`         | `SERIAL`  | `PRIMARY KEY`         | Unique identifier for each companion |
| `name`       | `VARCHAR` | `NOT NULL`            | Name of the companion                |
| `icon_path`  | `VARCHAR` | `NOT NULL`            | Path to the companion's icon image   |
| `content_id` | `UUID`    | `UNIQUE, NOT NULL`    | Unique identifier from Riot Games API |

#### 2. `companion_statistics` Table

This table stores statistical data about each companion, including the number of games played, top 4 percentage, win percentage, and average placement.

| Column Name         | Data Type | Constraints       | Description                                      |
| ------------------- | --------- | ----------------- | ------------------------------------------------ |
| `companion_name`    | `VARCHAR` | `PRIMARY KEY`     | Name of the companion (matches the `name` field in `companions` table) |
| `games_played`      | `INTEGER` | `NOT NULL`        | Number of games the companion has been used in    |
| `top_4_percentage`  | `FLOAT`   | `NOT NULL`        | Percentage of games where the companion finished in the top 4 |
| `win_percentage`    | `FLOAT`   | `NOT NULL`        | Percentage of games where the companion achieved a win (1st place) |
| `average_placement` | `FLOAT`   | `NOT NULL`        | The average placement of the companion across all games played |

#### 3. `match_data` Table

This table stores match-related data, capturing each instance of a companion being used in a match along with the placement achieved.

| Column Name  | Data Type | Constraints       | Description                                              |
| ------------ | --------- | ----------------- | -------------------------------------------------------- |
| `match_id`   | `VARCHAR` | `PRIMARY KEY`     | Unique identifier for the match                          |
| `content_id` | `UUID`    | `NOT NULL`        | Unique identifier for the companion used (foreign key to `companions` table) |
| `puuid`      | `VARCHAR` | `NOT NULL`        | PUUID of the player                                       |
| `placement`  | `INTEGER` | `NOT NULL`        | Placement achieved in the match by the player using the companion |

### Relationships

- The `companions` table has a one-to-many relationship with the `match_data` table via the `content_id` field.
- The `companions` table is referenced by the `companion_statistics` table via the `companion_name` field, which corresponds to the `name` field in the `companions` table.

### Summary

- The `companions` table is the central table that stores each Tactician's name, image path, and unique identifier.
- The `match_data` table records each instance of a match where a companion was used, including the placement achieved.
- The `companion_statistics` table aggregates statistical data for each companion, such as games played, top 4 percentage, win percentage, and average placement.
