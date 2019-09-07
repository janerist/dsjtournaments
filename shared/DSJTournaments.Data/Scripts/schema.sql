CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- TABLE tournament_types
CREATE TABLE tournament_types(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  game_version INTEGER NOT NULL CHECK (game_version IN (3, 4)),
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);
CREATE TRIGGER update_tournament_types_updated_at
BEFORE UPDATE ON tournament_types
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- TABLE uploads
CREATE TABLE uploads(
  id SERIAL PRIMARY KEY,
  uploaded_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  path VARCHAR(1000) NOT NULL,
  remote_ip inet NOT NULL
);

-- TABLE tournaments
CREATE TABLE tournaments(
  id SERIAL PRIMARY KEY,
  date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  game_version INTEGER NOT NULL CHECK (game_version IN (3, 4)),
  hill_count INTEGER,
  tournament_type_id INTEGER NOT NULL REFERENCES tournament_types (id)
);
CREATE INDEX ix_tournaments_tournament_type_id ON tournaments(tournament_type_id);

-- TABLE hills
CREATE TABLE hills(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  nation CHAR(3) NOT NULL,
  game_version INTEGER NOT NULL CHECK (game_version IN (3, 4)),
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);
CREATE TRIGGER update_hills_updated_at
BEFORE UPDATE ON hills
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- TABLE jumpers
CREATE TABLE jumpers(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  nation CHAR(3) NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);
CREATE TRIGGER update_jumpers_updated_at
BEFORE UPDATE ON jumpers
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- TABLE teams
CREATE TABLE teams(
  id SERIAL PRIMARY KEY,
  nation CHAR(3) NOT NULL,
  rank VARCHAR(5) NOT NULL,
  UNIQUE (nation, rank)
);

-- TABLE final_standings
CREATE TABLE final_standings(
  id SERIAL PRIMARY KEY,
  rank INTEGER NOT NULL,
  rating INTEGER,
  i INTEGER NOT NULL,
  ii INTEGER NOT NULL,
  iii INTEGER NOT NULL,
  n INTEGER,
  points INTEGER NOT NULL,
  cup_points INTEGER NOT NULL,
  tournament_id INTEGER NOT NULL REFERENCES tournaments (id) ON DELETE CASCADE,
  jumper_id INTEGER REFERENCES jumpers (id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams (id) ON DELETE CASCADE
);
CREATE INDEX ix_final_standings_tournament_id ON final_standings (tournament_id);
CREATE INDEX ix_final_standings_jumper_id ON final_standings (jumper_id);
CREATE INDEX ix_final_standings_composite ON final_standings (tournament_id, jumper_id);

-- TABLE competition
CREATE TABLE competitions(
  id SERIAL PRIMARY KEY,
  file_number INTEGER NOT NULL,
  ko BOOLEAN NOT NULL DEFAULT FALSE,
  hill_id INTEGER NOT NULL REFERENCES hills (id),
  tournament_id INTEGER NOT NULL REFERENCES tournaments (id) ON DELETE CASCADE,
  UNIQUE (file_number, hill_id, tournament_id)
);
CREATE INDEX ix_competitions_tournament_id ON competitions (tournament_id);

-- TABLE qualification_results
CREATE TABLE qualification_results(
  id SERIAL PRIMARY KEY,
  bib INTEGER,
  rank INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  length NUMERIC(5, 2),
  points NUMERIC(4, 1),
  qualified BOOLEAN NOT NULL,
  prequalified BOOLEAN NOT NULL,
  crashed BOOLEAN NOT NULL,
  competition_id INTEGER NOT NULL REFERENCES competitions (id) ON DELETE CASCADE,
  jumper_id INTEGER NOT NULL REFERENCES jumpers (id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams (id) ON DELETE CASCADE
);
CREATE INDEX ix_qualification_results_competition_id ON qualification_results (competition_id);

-- TABLE team_final_results
CREATE TABLE team_final_results(
  id SERIAL PRIMARY KEY,
  rank INTEGER NOT NULL,
  bib INTEGER,
  points NUMERIC(5, 1) NOT NULL,
  competition_id INTEGER NOT NULL REFERENCES competitions (id) ON DELETE CASCADE,
  team_id INTEGER NOT NULL REFERENCES teams (id) ON DELETE CASCADE
);
CREATE INDEX ix_team_final_results ON team_final_results (competition_id);

-- TABLE final_results
CREATE TABLE final_results(
  id SERIAL PRIMARY KEY,
  bib INTEGER,
  rank INTEGER NOT NULL,
  lucky_loser BOOLEAN NOT NULL,
  rating INTEGER NOT NULL,
  length1 NUMERIC(5, 2),
  length2 NUMERIC(5, 2),
  crashed1 BOOLEAN NOT NULL,
  crashed2 BOOLEAN NOT NULL,
  points NUMERIC(4, 1),
  competition_id INTEGER NOT NULL REFERENCES competitions (id) ON DELETE CASCADE,
  jumper_id INTEGER NOT NULL REFERENCES jumpers (id) ON DELETE CASCADE,
  team_result_id INTEGER REFERENCES team_final_results (id) ON DELETE CASCADE
);
CREATE INDEX ix_final_results_competition_id ON final_results (competition_id);
CREATE INDEX ix_final_results_team_result_id ON final_results (team_result_id);

-- TABLE cups
CREATE TABLE cups(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  rank_method VARCHAR(20) NOT NULL CHECK (rank_method IN ('cup_points', 'jump_points')),
  game_version INTEGER NOT NULL CHECK (game_version IN (3, 4)),
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);
CREATE TRIGGER update_cups_updated_at
BEFORE UPDATE ON cups
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- TABLE cup_dates
CREATE TABLE cup_dates(
  id SERIAL PRIMARY KEY,
  date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  cup_id INTEGER NOT NULL REFERENCES cups (id) ON DELETE CASCADE,
  tournament_id INTEGER REFERENCES tournaments (id) ON DELETE SET NULL,
  tournament_type_id INTEGER REFERENCES tournament_types (id),
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);
CREATE TRIGGER update_cup_dates_updated_at
BEFORE UPDATE ON cup_dates
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE INDEX ix_cup_dates_cup_id ON cup_dates (cup_id);

CREATE TABLE users(
  username VARCHAR(50) PRIMARY KEY,
  password_hash VARCHAR(256) NOT NULL,
  salt VARCHAR(256) NOT NULL,
  last_login TIMESTAMP WITHOUT TIME ZONE
);

CREATE MATERIALIZED VIEW jumper_results AS (
  SELECT
    r.jumper_id,
    r.tournament_id,
    t.date,
    r.rank,
    r.rating,
    r.points
  FROM
    (SELECT
       fs.jumper_id,
       fs.tournament_id,
       fs.rank,
       fs.rating,
       fs.points
     FROM final_standings fs
     UNION
     SELECT
       fr.jumper_id,
       c.tournament_id,
       NULL,
       NULL,
       NULL
     FROM final_results fr
       JOIN competitions c ON c.id = fr.competition_id
     WHERE fr.team_result_id IS NOT NULL) r
    JOIN tournaments t ON t.id = r.tournament_id
);
create index ix_jumper_results_jumper_id ON jumper_results (jumper_id);
create index ix_jumper_results_tournament_id ON jumper_results (tournament_id);

-- Change scripts (consider proper migration system some day)
ALTER TABLE jumpers ADD COLUMN gravatar_email VARCHAR(100);
ALTER TABLE users DROP COLUMN salt;
ALTER TABLE tournaments ADD COLUMN sub_type VARCHAR (50);
ALTER TABLE final_standings ADD CONSTRAINT uq_final_standings_tournament_id_jumper_id UNIQUE(tournament_id, jumper_id);
ALTER TABLE final_results ADD CONSTRAINT uq_final_results_competition_id_jumper_id UNIQUE(competition_id, jumper_id);
ALTER TABLE qualification_results ADD CONSTRAINT uq_qualification_results_competition_id_jumper_id UNIQUE(competition_id, jumper_id);
CREATE TABLE deleted_tournaments (
    id serial primary key,
    date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    tournament_type_id INTEGER NOT NULL REFERENCES tournament_types (id),
    sub_type VARCHAR (50)   
);