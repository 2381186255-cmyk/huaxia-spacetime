-- 华夏时空 - 事件因果链表
-- 执行顺序: 009

CREATE TABLE event_causality (
    id              SERIAL PRIMARY KEY,
    cause_event_id  INT NOT NULL REFERENCES historical_events(id) ON DELETE CASCADE,
    effect_event_id INT NOT NULL REFERENCES historical_events(id) ON DELETE CASCADE,
    causality_type  VARCHAR(50) NOT NULL,
    description     TEXT,
    strength        SMALLINT DEFAULT 3,
    created_at      TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT chk_no_self_causality CHECK (cause_event_id != effect_event_id)
);

CREATE INDEX idx_causality_cause ON event_causality (cause_event_id);
CREATE INDEX idx_causality_effect ON event_causality (effect_event_id);
