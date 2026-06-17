-- 华夏时空 - 人物表及关联
-- 执行顺序: 007

CREATE TABLE persons (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    name_en         VARCHAR(200),
    courtesy_name   VARCHAR(200),
    art_name        VARCHAR(200),
    birth_year      FLOAT,
    death_year      FLOAT,
    dynasty_id      INT REFERENCES dynasties(id),
    person_type     VARCHAR(50),
    description     TEXT,
    summary         VARCHAR(1000),
    external_refs   JSONB DEFAULT '{}',
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_persons_dynasty ON persons (dynasty_id);
CREATE INDEX idx_persons_years ON persons (birth_year, death_year);
CREATE INDEX idx_persons_name_trgm ON persons USING GIN (name gin_trgm_ops);

-- 人物-事件关联
CREATE TABLE person_events (
    id              SERIAL PRIMARY KEY,
    person_id       INT NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    event_id        INT NOT NULL REFERENCES historical_events(id) ON DELETE CASCADE,
    role            VARCHAR(100),
    sort_order      INT DEFAULT 0,

    CONSTRAINT uq_person_event UNIQUE (person_id, event_id)
);

CREATE INDEX idx_person_events_person ON person_events (person_id);
CREATE INDEX idx_person_events_event ON person_events (event_id);

-- 人物关系（谱系/社交网络）
CREATE TABLE person_relations (
    id              SERIAL PRIMARY KEY,
    from_person_id  INT NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    to_person_id    INT NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    relation_type   VARCHAR(50) NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT chk_no_self_relation CHECK (from_person_id != to_person_id)
);

CREATE INDEX idx_person_relations_from ON person_relations (from_person_id);
CREATE INDEX idx_person_relations_to ON person_relations (to_person_id);
CREATE INDEX idx_person_relations_type ON person_relations (relation_type);
