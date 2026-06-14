const { initializeDatabase, createDefaultAdmin, queryOne, execute, getDb } = require('./database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  console.log('Starting to seed database...');

  const clearData = process.argv.includes('--clear');
  if (clearData) {
    const db = getDb();
    db.run('DELETE FROM reviews');
    db.run('DELETE FROM orders');
    db.run('DELETE FROM characters');
    db.run('DELETE FROM services');
    db.run("DELETE FROM users WHERE username != 'admin'");
    console.log('Cleared existing data');
  }

  const characters = [
    { name: '水原千鹤', name_jp: 'Mizuhara Chizuru', role_tag: '全能型', description: '外表出众、性格温柔体贴的租借女友。无论是约会陪伴还是日常相处，都能给你最完美的体验。擅长察言观色，总能给你最贴心的照顾。', personality_tags: JSON.stringify(['温柔体贴', '气质优雅', '全能陪伴']), skills: JSON.stringify(['陪伴约会', '逛街购物', '看电影', '谈心陪伴']), price_per_hour: 5000, price_per_day: 35000, avatar: '/images/characters/chizuru_avatar.svg', full_body: '/images/characters/chizuru_full.png', banner: '/images/characters/chizuru_banner.png', available_hours: JSON.stringify(['09:00-12:00', '14:00-18:00', '19:00-22:00']), rating: 4.9, status: 'active' },
    { name: '七海麻美', name_jp: 'Nanami Mami', role_tag: '温柔甜妹', description: '甜美可爱的邻家女孩类型。性格温柔，声音甜美，给人一种如沐春风的感觉。特别擅长治愈人心，是放松心情的最佳选择。', personality_tags: JSON.stringify(['甜美可爱', '温柔治愈', '善解人意']), skills: JSON.stringify(['陪伴约会', '逛街购物', '谈心陪伴', '节日陪同']), price_per_hour: 4000, price_per_day: 28000, avatar: '/images/characters/mami_avatar.svg', full_body: '/images/characters/mami_full.png', banner: '/images/characters/mami_banner.png', available_hours: JSON.stringify(['10:00-13:00', '15:00-19:00']), rating: 4.8, status: 'active' },
    { name: '更科瑠夏', name_jp: 'Sarashina Ruka', role_tag: '活泼主动', description: '元气满满的活泼女孩。主动热情，充满活力，能带给你最欢乐的约会体验。喜欢运动和外出的她，是户外活动的最佳伴侣。', personality_tags: JSON.stringify(['元气满满', '主动热情', '青春活力']), skills: JSON.stringify(['陪伴约会', '逛街购物', '看电影', '日常陪伴']), price_per_hour: 4500, price_per_day: 32000, avatar: '/images/characters/ruka_avatar.svg', full_body: '/images/characters/ruka_full.png', banner: '/images/characters/ruka_banner.png', available_hours: JSON.stringify(['09:00-12:00', '13:00-17:00', '18:00-21:00']), rating: 4.7, status: 'active' },
    { name: '樱泽墨', name_jp: 'Sakurasawa Sumi', role_tag: '羞涩纯情', description: '羞涩可爱的纯情女孩。虽然有些害羞，但非常认真专注。一旦熟悉起来，会展现出非常可爱的一面。适合喜欢安静约会的你。', personality_tags: JSON.stringify(['羞涩可爱', '纯真甜美', '认真专注']), skills: JSON.stringify(['陪伴约会', '看电影', '谈心陪伴', '日常陪伴']), price_per_hour: 3500, price_per_day: 25000, avatar: '/images/characters/sumi_avatar.svg', full_body: '/images/characters/sumi_full.png', banner: '/images/characters/sumi_banner.png', available_hours: JSON.stringify(['10:00-12:00', '14:00-17:00', '19:00-21:00']), rating: 4.9, status: 'active' }
  ];

  for (const char of characters) {
    try {
      execute(
        'INSERT OR IGNORE INTO characters (name, name_jp, role_tag, description, personality_tags, skills, price_per_hour, price_per_day, avatar, full_body, banner, available_hours, rating, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [char.name, char.name_jp, char.role_tag, char.description, char.personality_tags, char.skills, char.price_per_hour, char.price_per_day, char.avatar, char.full_body, char.banner, char.available_hours, char.rating, char.status]
      );
      console.log(`Seeded character: ${char.name}`);
    } catch (err) {
      console.error(`Error seeding character ${char.name}:`, err.message);
    }
  }

  const services = [
    { name: '陪伴约会', description: '一对一陪伴约会服务，包括聊天、散步、吃饭等日常约会活动', icon: 'date', base_price: 3000, duration: '2-4小时', category: 'basic' },
    { name: '逛街购物', description: '陪同逛街购物，提供搭配建议和购物陪伴', icon: 'shopping', base_price: 2500, duration: '2-3小时', category: 'activity' },
    { name: '看电影', description: '陪同观看电影，享受轻松的观影时光', icon: 'movie', base_price: 2000, duration: '2-3小时', category: 'entertainment' },
    { name: '谈心陪伴', description: '深度谈心陪伴，倾诉心事，获得情感支持', icon: 'chat', base_price: 3500, duration: '1-3小时', category: 'emotional' },
    { name: '节日陪同', description: '节日特别陪同服务，让节日不再孤单', icon: 'festival', base_price: 5000, duration: '4-8小时', category: 'special' },
    { name: '日常陪伴', description: '全天日常陪伴服务，从早到晚的贴心陪伴', icon: 'daily', base_price: 4000, duration: '8-12小时', category: 'full-day' }
  ];

  for (const service of services) {
    try {
      execute(
        'INSERT OR IGNORE INTO services (name, description, icon, base_price, duration, category) VALUES (?, ?, ?, ?, ?, ?)',
        [service.name, service.description, service.icon, service.base_price, service.duration, service.category]
      );
      console.log(`Seeded service: ${service.name}`);
    } catch (err) {
      console.error(`Error seeding service ${service.name}:`, err.message);
    }
  }

  const testUser = queryOne("SELECT * FROM users WHERE username = ?", ['testuser']);
  if (!testUser) {
    const hashedPassword = bcrypt.hashSync('test123', 10);
    execute(
      'INSERT INTO users (username, password, email, phone, role, avatar) VALUES (?, ?, ?, ?, ?, ?)',
      ['testuser', hashedPassword, 'test@example.com', '13900139000', 'user', '/images/avatars/default.png']
    );
    console.log('Test user created: testuser / test123');
  }

  console.log('\nDatabase seeding completed!');
  console.log('Default accounts:');
  console.log('  Admin: admin / admin123');
  console.log('  User: testuser / test123');
  
  process.exit(0);
}

(async () => {
  await initializeDatabase();
  createDefaultAdmin();
  await seedDatabase();
})();
