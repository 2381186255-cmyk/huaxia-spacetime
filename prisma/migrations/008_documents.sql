-- 华夏时空 - 文献表及关联
-- 执行顺序: 008

CREATE TABLE documents (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(500) NOT NULL,
    title_en        VARCHAR(500),
    author          VARCHAR(200),
    dynasty_id      INT REFERENCES dynasties(id),
    doc_type        VARCHAR(50),
    start_year      FLOAT,
    end_year        FLOAT,
    description     TEXT,
    summary         VARCHAR(1000),
    external_refs   JSONB DEFAULT '{}',
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_dynasty ON documents (dynasty_id);
CREATE INDEX idx_documents_type ON documents (doc_type);
CREATE INDEX idx_documents_title_trgm ON documents USING GIN (title gin_trgm_ops);

-- 文献-事件关联
CREATE TABLE document_events (
    id              SERIAL PRIMARY KEY,
    document_id     INT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    event_id        INT NOT NULL REFERENCES historical_events(id) ON DELETE CASCADE,
    relevance       VARCHAR(50),
    sort_order      INT DEFAULT 0,

    CONSTRAINT uq_doc_event UNIQUE (document_id, event_id)
);

CREATE INDEX idx_document_events_document ON document_events (document_id);
CREATE INDEX idx_document_events_event ON document_events (event_id);
