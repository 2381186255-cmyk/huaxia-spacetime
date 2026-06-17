-- 华夏时空 - 疆域/政区表
-- 执行顺序: 004

CREATE TABLE historical_regions (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    name_en         VARCHAR(200),
    start_year      FLOAT NOT NULL,
    end_year        FLOAT NOT NULL,
    geom            GEOMETRY(MultiPolygon, 4326) NOT NULL,
    detail_level    SMALLINT NOT NULL DEFAULT 1,
    dynasty_id      INT REFERENCES dynasties(id),
    parent_id       INT REFERENCES historical_regions(id),
    region_type     VARCHAR(50),
    external_refs   JSONB DEFAULT '{}',
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT chk_region_years CHECK (start_year <= end_year),
    CONSTRAINT chk_region_detail CHECK (detail_level IN (1, 2, 3))
);

CREATE INDEX idx_regions_geom ON historical_regions USING GIST (geom);
CREATE INDEX idx_regions_years ON historical_regions (start_year, end_year);
CREATE INDEX idx_regions_dynasty ON historical_regions (dynasty_id);
CREATE INDEX idx_regions_parent ON historical_regions (parent_id);
CREATE INDEX idx_regions_detail ON historical_regions (detail_level);
