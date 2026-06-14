import sqlite3, os, json

db_path = r'C:\Users\26299\WorkBuddy\2026-06-12-22-48-03\diamond-rental\server\database.sqlite'

if os.path.exists(db_path):
    os.remove(db_path)
    print('旧数据库已删除')

conn = sqlite3.connect(db_path)
conn.execute('PRAGMA encoding = "UTF-8"')
cur = conn.cursor()

# 建表
cur.executescript("""
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        role TEXT DEFAULT 'user',
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        name_jp TEXT,
        role_tag TEXT,
        description TEXT,
        personality_tags TEXT,
        skills TEXT,
        price_per_hour REAL,
        price_per_day REAL,
        avatar TEXT,
        full_body TEXT,
        banner TEXT,
        available_hours TEXT,
        rating REAL DEFAULT 5.0,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        base_price REAL,
        duration TEXT,
        category TEXT
    );
    CREATE TABLE orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        character_id INTEGER NOT NULL,
        service_id INTEGER,
        date TEXT NOT NULL,
        time_slot TEXT NOT NULL,
        duration INTEGER DEFAULT 2,
        total_price REAL,
        status TEXT DEFAULT 'pending',
        customer_name TEXT,
        customer_phone TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (character_id) REFERENCES characters(id),
        FOREIGN KEY (service_id) REFERENCES services(id)
    );
    CREATE TABLE reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        character_id INTEGER,
        order_id INTEGER,
        rating INTEGER CHECK(rating >= 1 AND rating <= 5),
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (character_id) REFERENCES characters(id),
        FOREIGN KEY (order_id) REFERENCES orders(id)
    );
""")
print('表结构创建完成')

# 管理员账号 (admin / admin123)
cur.execute('INSERT INTO users (username, password, email, phone, role, avatar) VALUES (?,?,?,?,?,?)',
    ('admin', '$2a$10$rOzN1xjc2NmwAVq2rB0Oe.Wt7ZBRQ8K5cC6hIM2.WkUq.BjBYqCCm', 'admin@diamond-rental.com', '13800138000', 'admin', '/images/avatars/admin.png'))
print('管理员已创建')

# 12 位角色
chars = [
    (1, '水原千鹤', 'Mizuhara Chizuru', '全能型',
     '外表出众、性格温柔体贴的租借女友。无论是约会陪伴还是日常相处，都能给你最完美的体验。擅长察言观色，总能给你最贴心的照顾。',
     ['温柔体贴','气质优雅','全能陪伴'], ['陪伴约会','逛街购物','看电影','谈心陪伴'],
     5000, 35000, '/images/characters/01_chizuru.webp', 4.9,
     ['09:00-12:00','14:00-18:00','19:00-22:00']),
    (2, '七海麻美', 'Nanami Mami', '温柔甜妹',
     '甜美可爱的邻家女孩类型。性格温柔，声音甜美，给人一种如沐春风的感觉。特别擅长治愈人心，是放松心情的最佳选择。',
     ['甜美可爱','温柔治愈','善解人意'], ['陪伴约会','逛街购物','谈心陪伴','节日陪同'],
     4000, 28000, '/images/characters/02_mami.jpg', 4.8,
     ['10:00-13:00','15:00-19:00']),
    (3, '更科瑠夏', 'Sarashina Ruka', '活泼主动',
     '元气满满的活泼女孩。主动热情，充满活力，能带给你最欢乐的约会体验。喜欢运动和外出的她，是户外活动的最佳伴侣。',
     ['元气满满','主动热情','青春活力'], ['陪伴约会','逛街购物','看电影','日常陪伴'],
     4500, 32000, '/images/characters/03_ruka.jpg', 4.7,
     ['09:00-12:00','13:00-17:00','18:00-21:00']),
    (4, '樱泽墨', 'Sakurasawa Sumi', '羞涩纯情',
     '羞涩可爱的纯情女孩。虽然有些害羞，但非常认真专注。一旦熟悉起来，会展现出非常可爱的一面。适合喜欢安静约会的你。',
     ['羞涩可爱','纯真甜美','认真专注'], ['陪伴约会','看电影','谈心陪伴','日常陪伴'],
     3500, 25000, '/images/characters/04_sumi.webp', 4.9,
     ['10:00-12:00','14:00-17:00','19:00-21:00']),
    (5, '绫野美咲', 'Ayano Misaki', '知性御姐',
     '成熟稳重的知性御姐。举止优雅，谈吐大方，无论是商务宴会还是私人约会都能完美应对，是提升格调的不二选择。',
     ['成熟稳重','知性优雅','善解人意'], ['陪伴约会','商务陪同','逛街购物','谈心陪伴'],
     5500, 38000, '/images/characters/05_ayano.png', 4.8,
     ['10:00-13:00','15:00-19:00','19:00-22:00']),
    (6, '皐月凛', 'Satsuki Rin', '高冷御姐',
     '高冷冰山美人。外表凌厉实则内心细腻，对信任的人展现温柔一面。适合喜欢挑战和征服的你。',
     ['高冷御姐','外冷内热','冰山美人'], ['陪伴约会','逛街购物','谈心陪伴','星巴克'],
     6000, 42000, '/images/characters/06_satsuki.png', 4.7,
     ['14:00-18:00','19:00-23:00']),
    (7, '渚ことみ', 'Nagisa Kotomi', '清纯学妹',
     '清纯可爱的学生妹。天真无邪的笑容，温柔善良的性格，带你重温青涩的校园恋爱感。',
     ['清纯可人','温柔善良','天真无邪'], ['陪伴约会','看电影','逛街购物','谈心陪伴'],
     3500, 24000, '/images/characters/07_nagisa.webp', 4.9,
     ['09:00-12:00','14:00-18:00']),
    (8, '玲奈', 'Rena', '元气辣妹',
     '元气满满！时尚潮流的辣妹型女孩，活泼开朗，走到哪里都是焦点。适合喜欢热闹和潮流的你。',
     ['元气辣妹','时尚潮流','开朗大方'], ['陪伴约会','逛街购物','看电影','潮流搭配'],
     4000, 28000, '/images/characters/08_rena.png', 4.6,
     ['09:00-12:00','13:00-17:00','18:00-21:00']),
    (9, '雪菜', 'Yukina', '冰雪美人',
     '如同冰雪般的绝美少女。冷艳外表下藏着一颗细腻柔软的心，只为特定的人展露温暖笑容。',
     ['冰雪美人','冷艳优雅','细腻温柔'], ['陪伴约会','茶道','观影','谈心陪伴'],
     5000, 35000, '/images/characters/09_yukina.png', 4.8,
     ['10:00-13:00','15:00-20:00']),
    (10, '遥', 'Haruka', '运动少女',
     '热爱运动的阳光女孩。活力四射，笑容治愈，是户外活动和运动约会的不二之选。',
     ['运动少女','阳光活力','开朗大方'], ['陪伴约会','户外运动','逛街购物','日常陪伴'],
     3800, 26000, '/images/characters/10_haruka.png', 4.5,
     ['09:00-12:00','14:00-18:00']),
    (11, '琴音', 'Kotone', '文艺少女',
     '热爱艺术与音乐的文艺少女。温婉知性，内心丰富，适合喜欢文艺氛围的你。',
     ['文艺少女','温婉知性','知书达理'], ['陪伴约会','音乐鉴赏','美术展览','谈心陪伴'],
     4200, 29000, '/images/characters/11_kotone.png', 4.7,
     ['10:00-13:00','14:00-18:00','19:00-21:00']),
    (12, '芽衣', 'Mei', '甜美萝莉',
     '娇小可爱的甜美萝莉。声音甜美，笑容治愈，给你最纯粹的温暖陪伴体验。',
     ['甜美萝莉','娇小可爱','温柔体贴'], ['陪伴约会','看电影','甜品探店','谈心陪伴'],
     3000, 21000, '/images/characters/12_mei.jpg', 4.9,
     ['09:00-12:00','14:00-17:00']),
]

for c in chars:
    cur.execute(
        'INSERT INTO characters (id,name,name_jp,role_tag,description,personality_tags,skills,price_per_hour,price_per_day,avatar,rating,available_hours,full_body,banner,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,"active")',
        (c[0], c[1], c[2], c[3], c[4],
         json.dumps(c[5], ensure_ascii=False),
         json.dumps(c[6], ensure_ascii=False),
         c[7], c[8], c[9], c[10],
         json.dumps(c[11], ensure_ascii=False),
         c[9], c[9]))

conn.commit()

# 验证
print('\n验证数据:')
for row in cur.execute('SELECT id, name, avatar FROM characters ORDER BY id'):
    fname = row[2].split('/')[-1] if row[2] else 'NULL'
    print(f'  ✅ #{row[0]} {row[1]} → {fname}')

count = cur.execute('SELECT COUNT(*) FROM characters').fetchone()[0]
print(f'\n角色总数: {count}')
conn.close()
print('🎉 数据库重建完成！')
