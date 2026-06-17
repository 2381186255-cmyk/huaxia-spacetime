-- 华夏时空 - 朝代表
-- 执行顺序: 002

CREATE TABLE dynasties (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(50) NOT NULL UNIQUE,
    name_en         VARCHAR(100),
    start_year      FLOAT NOT NULL,
    end_year        FLOAT NOT NULL,
    color           VARCHAR(7) NOT NULL,
    description     TEXT,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT chk_dynasty_years CHECK (start_year < end_year)
);

CREATE INDEX idx_dynasties_years ON dynasties (start_year, end_year);

-- 初始种子数据
INSERT INTO dynasties (name, name_en, start_year, end_year, color, sort_order, description) VALUES
('夏', 'Xia', -2070, -1600, '#8B7355', 1, '约前2070年-约前1600年'),
('商', 'Shang', -1600, -1046, '#4A708B', 2, '约前1600年-前1046年'),
('西周', 'Western Zhou', -1046, -771, '#CD853F', 3, '前1046年-前771年'),
('东周', 'Eastern Zhou', -770, -256, '#DAA520', 4, '前770年-前256年'),
('秦', 'Qin', -221, -207, '#2F4F4F', 5, '前221年-前207年'),
('西汉', 'Western Han', -202, 8, '#B22222', 6, '前202年-公元8年'),
('新', 'Xin', 9, 23, '#696969', 7, '公元9年-23年'),
('东汉', 'Eastern Han', 25, 220, '#CD5C5C', 8, '公元25年-220年'),
('三国', 'Three Kingdoms', 220, 280, '#8B4513', 9, '220年-280年'),
('西晋', 'Western Jin', 265, 316, '#556B2F', 10, '265年-316年'),
('东晋', 'Eastern Jin', 317, 420, '#6B8E23', 11, '317年-420年'),
('南北朝', 'Southern and Northern Dynasties', 420, 589, '#9ACD32', 12, '420年-589年'),
('隋', 'Sui', 581, 618, '#FF8C00', 13, '581年-618年'),
('唐', 'Tang', 618, 907, '#C41E3A', 14, '618年-907年'),
('五代十国', 'Five Dynasties and Ten Kingdoms', 907, 960, '#A0522D', 15, '907年-960年'),
('北宋', 'Northern Song', 960, 1127, '#4682B4', 16, '960年-1127年'),
('南宋', 'Southern Song', 1127, 1279, '#5F9EA0', 17, '1127年-1279年'),
('辽', 'Liao', 916, 1125, '#8B8682', 18, '916年-1125年'),
('金', 'Jin', 1115, 1234, '#BDB76B', 19, '1115年-1234年'),
('元', 'Yuan', 1271, 1368, '#4169E1', 20, '1271年-1368年'),
('明', 'Ming', 1368, 1644, '#DC143C', 21, '1368年-1644年'),
('清', 'Qing', 1644, 1912, '#FFD700', 22, '1644年-1912年');
