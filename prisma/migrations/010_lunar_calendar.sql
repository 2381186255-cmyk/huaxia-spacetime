-- 华夏时空 - 农历转换辅助表
-- 执行顺序: 010

CREATE TABLE lunar_calendar (
    id              SERIAL PRIMARY KEY,
    year            INT NOT NULL,
    lunar_month     SMALLINT NOT NULL,
    lunar_day       SMALLINT NOT NULL,
    solar_month     SMALLINT NOT NULL,
    solar_day       SMALLINT NOT NULL,
    is_leap_month   BOOLEAN DEFAULT FALSE,

    CONSTRAINT chk_lunar_month CHECK (ABS(lunar_month) BETWEEN 1 AND 12),
    CONSTRAINT chk_lunar_day CHECK (lunar_day BETWEEN 1 AND 30),
    CONSTRAINT chk_solar_month CHECK (solar_month BETWEEN 1 AND 12),
    CONSTRAINT chk_solar_day CHECK (solar_day BETWEEN 1 AND 31)
);

CREATE UNIQUE INDEX idx_lunar_calendar_date ON lunar_calendar (year, lunar_month, lunar_day);
CREATE INDEX idx_lunar_solar ON lunar_calendar (solar_month, solar_day);
