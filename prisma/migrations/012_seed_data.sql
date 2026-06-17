-- 华夏时空 - 种子数据
-- 包含示例事件、地点、人物、文献数据

-- ===== 示例地点 =====
INSERT INTO historical_places (name, name_en, modern_name, start_year, end_year, geom, detail_level, dynasty_id, place_type) VALUES
('长安', 'Chang''an', '西安', -202, 907, ST_SetSRID(ST_MakePoint(108.93, 34.27), 4326), 1, 6, 'capital'),
('洛阳', 'Luoyang', '洛阳', -770, 220, ST_SetSRID(ST_MakePoint(112.45, 34.62), 4326), 1, 4, 'capital'),
('咸阳', 'Xianyang', '咸阳', -350, -207, ST_SetSRID(ST_MakePoint(108.71, 34.33), 4326), 1, 5, 'capital'),
('开封', 'Kaifeng', '开封', 960, 1127, ST_SetSRID(ST_MakePoint(114.35, 34.79), 4326), 1, 16, 'capital'),
('临安', 'Lin''an', '杭州', 1127, 1279, ST_SetSRID(ST_MakePoint(120.15, 30.27), 4326), 1, 17, 'capital'),
('大都', 'Dadu', '北京', 1271, 1368, ST_SetSRID(ST_MakePoint(116.40, 39.90), 4326), 1, 20, 'capital'),
('北京', 'Beijing', '北京', 1368, 1912, ST_SetSRID(ST_MakePoint(116.40, 39.90), 4326), 1, 21, 'capital'),
('范阳', 'Fanyang', '北京', 618, 907, ST_SetSRID(ST_MakePoint(116.40, 39.90), 4326), 2, 14, 'prefecture'),
('渔阳', 'Yuyang', '天津蓟州', 618, 907, ST_SetSRID(ST_MakePoint(117.41, 40.05), 4326), 3, 14, 'prefecture'),
('潼关', 'Tongguan', '潼关', -350, 1912, ST_SetSRID(ST_MakePoint(110.24, 34.54), 4326), 2, NULL, 'pass'),
('成都', 'Chengdu', '成都', -316, 1912, ST_SetSRID(ST_MakePoint(104.07, 30.67), 4326), 1, NULL, 'prefecture'),
('建康', 'Jiankang', '南京', 229, 589, ST_SetSRID(ST_MakePoint(118.78, 32.06), 4326), 1, NULL, 'capital'),
('广州', 'Guangzhou', '广州', -214, 1912, ST_SetSRID(ST_MakePoint(113.26, 23.13), 4326), 2, NULL, 'prefecture'),
('敦煌', 'Dunhuang', '敦煌', -111, 1912, ST_SetSRID(ST_MakePoint(94.66, 40.14), 4326), 2, NULL, 'prefecture'),
('拉萨', 'Lhasa', '拉萨', 633, 1912, ST_SetSRID(ST_MakePoint(91.11, 29.65), 4326), 2, NULL, 'capital');

-- ===== 示例事件 =====
INSERT INTO historical_events (name, start_year, end_year, start_month, start_day, event_type, dynasty_id, importance, detail_level, summary, is_lunar) VALUES
('秦统一六国', -221, -221, NULL, NULL, 'political', 5, 1, 1, '秦王嬴政灭齐，完成统一六国大业，建立中国第一个中央集权制帝国', FALSE),
('陈胜吴广起义', -209, -209, 7, 1, 'rebellion', 5, 2, 1, '陈胜、吴广在大泽乡起义，揭开了秦末农民战争的序幕', TRUE),
('楚汉之争', -206, -202, NULL, NULL, 'war', 6, 1, 1, '项羽与刘邦争夺天下的战争，最终刘邦获胜建立西汉', FALSE),
('张骞出使西域', -138, -126, NULL, NULL, 'diplomatic', 6, 2, 1, '张骞奉汉武帝之命出使西域，开辟了丝绸之路', FALSE),
('王莽篡汉', 9, 23, NULL, NULL, 'political', 7, 2, 1, '外戚王莽篡夺西汉政权，建立新朝', FALSE),
('赤壁之战', 208, 208, NULL, NULL, 'war', 9, 1, 2, '孙刘联军在赤壁大败曹操，奠定三国鼎立格局', TRUE),
('五胡乱华', 304, 439, NULL, NULL, 'war', 12, 1, 1, '匈奴、鲜卑、羯、氐、羌等少数民族入侵中原，西晋灭亡', FALSE),
('淝水之战', 383, 383, NULL, NULL, 'war', 12, 2, 1, '东晋在淝水击败前秦，保全了南方汉族政权', FALSE),
('隋统一南北', 589, 589, NULL, NULL, 'political', 13, 1, 1, '隋文帝杨坚灭陈，结束近三百年的南北分裂', FALSE),
('玄武门之变', 626, 626, 7, 2, 'political', 14, 1, 2, '秦王李世民在玄武门发动政变，杀太子李建成，后即位为唐太宗', TRUE),
('贞观之治', 627, 649, NULL, NULL, 'reform', 14, 1, 1, '唐太宗李世民在位期间的盛世，政治清明，经济繁荣', FALSE),
('安史之乱', 755, 763, 12, 16, 'war', 14, 1, 1, '安禄山、史思明叛乱，唐朝由盛转衰的转折点', TRUE),
('黄巢起义', 875, 884, NULL, NULL, 'rebellion', 14, 2, 1, '黄巢率农民军攻入长安，沉重打击了唐朝统治', FALSE),
('靖康之变', 1127, 1127, NULL, NULL, 'collapse', 16, 1, 1, '金兵攻破开封，掳走徽钦二帝，北宋灭亡', FALSE),
('蒙古灭宋', 1279, 1279, NULL, NULL, 'war', 20, 1, 1, '元军在崖山海战中消灭南宋残余势力，统一中国', FALSE),
('郑和下西洋', 1405, 1433, NULL, NULL, 'diplomatic', 21, 2, 1, '明成祖派郑和七次下西洋，到达东南亚、印度洋、东非', FALSE),
('土木堡之变', 1449, 1449, NULL, NULL, 'war', 21, 2, 2, '明英宗亲征瓦剌被俘，明朝由盛转衰', FALSE),
('万历三大征', 1592, 1600, NULL, NULL, 'war', 21, 2, 1, '明朝在万历年间进行的三次大规模军事行动', FALSE),
('甲申之变', 1644, 1644, 3, 19, 'collapse', 21, 1, 1, '李自成攻入北京，崇祯帝自缢，明朝灭亡', TRUE),
('鸦片战争', 1840, 1842, NULL, NULL, 'war', 22, 1, 1, '英国发动侵华战争，中国近代史的开端', FALSE),
('太平天国运动', 1851, 1864, NULL, NULL, 'rebellion', 22, 1, 1, '洪秀全领导的农民起义，建立太平天国政权', FALSE),
('辛亥革命', 1911, 1912, 10, 10, 'rebellion', 22, 1, 1, '武昌起义爆发，推翻清朝统治，建立中华民国', FALSE);

-- ===== 示例事件-地点关联 =====
INSERT INTO event_places (event_id, place_id, role, sort_order) VALUES
-- 安史之乱
((SELECT id FROM historical_events WHERE name='安史之乱'), (SELECT id FROM historical_places WHERE name='范阳'), 'origin', 1),
((SELECT id FROM historical_events WHERE name='安史之乱'), (SELECT id FROM historical_places WHERE name='长安'), 'capital', 2),
((SELECT id FROM historical_events WHERE name='安史之乱'), (SELECT id FROM historical_places WHERE name='洛阳'), 'battlefield', 3),
((SELECT id FROM historical_events WHERE name='安史之乱'), (SELECT id FROM historical_places WHERE name='潼关'), 'battlefield', 4),
-- 赤壁之战
((SELECT id FROM historical_events WHERE name='赤壁之战'), (SELECT id FROM historical_places WHERE name='建康'), 'capital', 1),
-- 玄武门之变
((SELECT id FROM historical_events WHERE name='玄武门之变'), (SELECT id FROM historical_places WHERE name='长安'), 'capital', 1),
-- 靖康之变
((SELECT id FROM historical_events WHERE name='靖康之变'), (SELECT id FROM historical_places WHERE name='开封'), 'capital', 1),
-- 甲申之变
((SELECT id FROM historical_events WHERE name='甲申之变'), (SELECT id FROM historical_places WHERE name='北京'), 'capital', 1);

-- ===== 示例人物 =====
INSERT INTO persons (name, courtesy_name, birth_year, death_year, dynasty_id, person_type, summary) VALUES
('秦始皇', NULL, -259, -210, 5, 'emperor', '中国第一位皇帝，统一六国，建立秦朝'),
('刘邦', '季', -256, -195, 6, 'emperor', '汉朝开国皇帝，即汉高祖'),
('汉武帝', NULL, -156, -87, 6, 'emperor', '西汉第七位皇帝，开疆拓土，独尊儒术'),
('张骞', '子文', -164, -114, 6, 'official', '西汉外交家，开辟丝绸之路'),
('曹操', '孟德', 155, 220, 9, 'general', '东汉末年杰出的政治家、军事家、文学家'),
('诸葛亮', '孔明', 181, 234, 9, 'official', '蜀汉丞相，杰出的政治家、军事家'),
('李世民', NULL, 598, 649, 14, 'emperor', '唐太宗，开创贞观之治'),
('安禄山', NULL, 703, 757, 14, 'general', '安史之乱发动者'),
('郭子仪', NULL, 697, 781, 14, 'general', '平定安史之乱的名将'),
('岳飞', '鹏举', 1103, 1142, 17, 'general', '南宋抗金名将'),
('朱元璋', '国瑞', 1328, 1398, 21, 'emperor', '明朝开国皇帝，即明太祖'),
('郑和', NULL, 1371, 1433, 21, 'official', '明朝航海家，七下西洋'),
('康熙帝', NULL, 1654, 1722, 22, 'emperor', '清朝第四位皇帝，开创康乾盛世'),
('洪秀全', NULL, 1814, 1864, 22, 'other', '太平天国运动领导者'),
('孙中山', '逸仙', 1866, 1925, 22, 'other', '辛亥革命领导者，中华民国国父');

-- ===== 示例人物-事件关联 =====
INSERT INTO person_events (person_id, event_id, role) VALUES
((SELECT id FROM persons WHERE name='安禄山'), (SELECT id FROM historical_events WHERE name='安史之乱'), '发动者'),
((SELECT id FROM persons WHERE name='郭子仪'), (SELECT id FROM historical_events WHERE name='安史之乱'), '平叛将领'),
((SELECT id FROM persons WHERE name='李世民'), (SELECT id FROM historical_events WHERE name='玄武门之变'), '发动者'),
((SELECT id FROM persons WHERE name='李世民'), (SELECT id FROM historical_events WHERE name='贞观之治'), '主导者'),
((SELECT id FROM persons WHERE name='张骞'), (SELECT id FROM historical_events WHERE name='张骞出使西域'), '执行者'),
((SELECT id FROM persons WHERE name='岳飞'), (SELECT id FROM historical_events WHERE name='靖康之变'), '抗金将领'),
((SELECT id FROM persons WHERE name='朱元璋'), (SELECT id FROM historical_events WHERE name='甲申之变'), NULL),
((SELECT id FROM persons WHERE name='孙中山'), (SELECT id FROM historical_events WHERE name='辛亥革命'), '领导者');

-- ===== 示例因果链 =====
INSERT INTO event_causality (cause_event_id, effect_event_id, causality_type, strength, description) VALUES
((SELECT id FROM historical_events WHERE name='安史之乱'), (SELECT id FROM historical_events WHERE name='黄巢起义'), 'background', 3, '安史之乱后藩镇割据，中央衰弱，为黄巢起义创造了条件'),
((SELECT id FROM historical_events WHERE name='王莽篡汉'), (SELECT id FROM historical_events WHERE name='赤壁之战'), 'indirect', 1, '新朝改制失败导致东汉建立，东汉末年分裂为三国'),
((SELECT id FROM historical_events WHERE name='五胡乱华'), (SELECT id FROM historical_events WHERE name='隋统一南北'), 'background', 4, '长期分裂最终走向统一'),
((SELECT id FROM historical_events WHERE name='靖康之变'), (SELECT id FROM historical_events WHERE name='蒙古灭宋'), 'indirect', 2, '北宋灭亡后南宋偏安，最终被蒙古所灭'),
((SELECT id FROM historical_events WHERE name='鸦片战争'), (SELECT id FROM historical_events WHERE name='太平天国运动'), 'trigger', 4, '鸦片战争后社会矛盾激化，直接引发太平天国运动'),
((SELECT id FROM historical_events WHERE name='甲申之变'), (SELECT id FROM historical_events WHERE name='鸦片战争'), 'indirect', 2, '明亡清兴，闭关锁国政策导致落后于西方');

-- ===== 示例文献 =====
INSERT INTO documents (title, author, dynasty_id, doc_type, start_year, end_year, summary) VALUES
('史记', '司马迁', 6, 'history', -104, -91, '中国第一部纪传体通史，记载从黄帝到汉武帝时期的历史'),
('汉书', '班固', 6, 'history', 36, 97, '中国第一部纪传体断代史，记述西汉历史'),
('资治通鉴', '司马光', 17, 'history', 1065, 1084, '编年体通史巨著，记载从战国到五代的历史'),
('三国志', '陈寿', 9, 'history', 280, 290, '记载三国时期历史的纪传体国别史'),
('旧唐书', '刘昫', 17, 'history', 940, 945, '记载唐朝历史的纪传体史书'),
('新唐书', '欧阳修', 17, 'history', 1043, 1060, '重修的唐朝史书，补充了旧唐书的不足');
