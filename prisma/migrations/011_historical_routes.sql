-- 华夏时空 - 历史道路/水路网络（pgRouting）
-- 执行顺序: 011

CREATE TABLE historical_routes (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200),
    route_type      VARCHAR(50),
    dynasty_id      INT REFERENCES dynasties(id),
    start_year      FLOAT,
    end_year        FLOAT,
    geom            GEOMETRY(LineString, 4326) NOT NULL,
    cost            FLOAT,
    reverse_cost    FLOAT,
    source          INT,
    target          INT,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_routes_geom ON historical_routes USING GIST (geom);
CREATE INDEX idx_routes_source ON historical_routes (source);
CREATE INDEX idx_routes_target ON historical_routes (target);
CREATE INDEX idx_routes_dynasty ON historical_routes (dynasty_id);
CREATE INDEX idx_routes_years ON historical_routes (start_year, end_year);
