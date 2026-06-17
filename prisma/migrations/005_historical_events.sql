-- 华夏时空 - 事件表（核心）
-- 执行顺序: 005

CREATE TABLE historical_events (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(500) NOT NULL,
    name_en         VARCHAR(500),
    start_year      FLOAT NOT NULL,
    end_year        FLOAT,
    start_month     SMALLINT,
    start_day       SMALLINT,
    end_month       SMALLINT,
    end_day         SMALLINT,
    lunar_month     SMALLINT,
    lunar_day       SMALLINT,
    is_lunar        BOOLEAN DEFAULT FALSE,
    event_type      VARCHAR(50) NOT NULL,
    dynasty_id      INT REFERENCES dynasties(id),
    importance      SMALLINT NOT NULL DEFAULT 3,
    detail_level    SMALLINT NOT NULL DEFAULT 1,
    description     TEXT,
    summary         VARCHAR(1000),
    external_refs   JSONB DEFAULT '{}',
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT chk_event_start_month CHECK (start_month IS NULL OR (start_month >= 1 AND start_month <= 12)),
    CONSTRAINT chk_event_start_day CHECK (start_day IS NULL OR (start_day >= 1 AND start_day <= 31)),
    CONSTRAINT chk_event_end_month CHECK (end_month IS NULL OR (end_month >= 1 AND end_month <= 12)),
    CONSTRAINT chk_event_end_day CHECK (end_day IS NULL OR (end_day >= 1 AND end_day <= 31)),
    CONSTRAINT chk_event_importance CHECK (importance BETWEEN 1 AND 5),
    CONSTRAINT chk_event_detail CHECK (detail_level IN (1, 2, 3))
);

-- "今日历史"查询核心索引：按公历月日快速检索
CREATE INDEX idx_events_month_day ON historical_events (start_month, start_day)
    WHERE start_month IS NOT NULL AND start_day IS NOT NULL;

-- 农历月日索引
CREATE INDEX idx_events_lunar ON historical_events (lunar_month, lunar_day)
    WHERE lunar_month IS NOT NULL AND lunar_day IS NOT NULL AND is_lunar = TRUE;

-- 时间范围索引
CREATE INDEX idx_events_years ON historical_events (start_year, end_year);
CREATE INDEX idx_events_dynasty ON historical_events (dynasty_id);
CREATE INDEX idx_events_type ON historical_events (event_type);
CREATE INDEX idx_events_importance ON historical_events (importance);
CREATE INDEX idx_events_name_trgm ON historical_events USING GIN (name gin_trgm_ops);

-- 事件-地点关联表
CREATE TABLE event_places (
    id              SERIAL PRIMARY KEY,
    event_id        INT NOT NULL REFERENCES historical_events(id) ON DELETE CASCADE,
    place_id        INT NOT NULL REFERENCES historical_places(id) ON DELETE CASCADE,
    role            VARCHAR(50),
    sort_order      INT DEFAULT 0,

    CONSTRAINT uq_event_place UNIQUE (event_id, place_id)
);

CREATE INDEX idx_event_places_event ON event_places (event_id);
CREATE INDEX idx_event_places_place ON event_places (place_id);
