-- 华夏时空 - 空间实体统一表
-- 执行顺序: 003

CREATE TABLE historical_places (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    name_en         VARCHAR(200),
    modern_name     VARCHAR(200),
    start_year      FLOAT NOT NULL,
    end_year        FLOAT NOT NULL,
    geom            GEOMETRY(Point, 4326) NOT NULL,
    detail_level    SMALLINT NOT NULL DEFAULT 1,
    dynasty_id      INT REFERENCES dynasties(id),
    place_type      VARCHAR(50),
    external_refs   JSONB DEFAULT '{}',
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT chk_place_years CHECK (start_year <= end_year),
    CONSTRAINT chk_place_detail CHECK (detail_level IN (1, 2, 3))
);

CREATE INDEX idx_places_geom ON historical_places USING GIST (geom);
CREATE INDEX idx_places_years ON historical_places (start_year, end_year);
CREATE INDEX idx_places_dynasty ON historical_places (dynasty_id);
CREATE INDEX idx_places_detail ON historical_places (detail_level);
CREATE INDEX idx_places_name_trgm ON historical_places USING GIN (name gin_trgm_ops);
