-- 华夏时空 - 事件势力地块表
-- 执行顺序: 006

CREATE TABLE event_territories (
    id              SERIAL PRIMARY KEY,
    event_id        INT NOT NULL REFERENCES historical_events(id) ON DELETE CASCADE,
    faction         VARCHAR(100) NOT NULL,
    faction_color   VARCHAR(7),
    start_year      FLOAT NOT NULL,
    end_year        FLOAT NOT NULL,
    geom            GEOMETRY(MultiPolygon, 4326) NOT NULL,
    properties      JSONB DEFAULT '{}',
    keyframe_order  INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT chk_territory_years CHECK (start_year <= end_year)
);

CREATE INDEX idx_territories_geom ON event_territories USING GIST (geom);
CREATE INDEX idx_territories_event ON event_territories (event_id);
CREATE INDEX idx_territories_faction ON event_territories (event_id, faction);
CREATE INDEX idx_territories_time ON event_territories (event_id, start_year, end_year);
