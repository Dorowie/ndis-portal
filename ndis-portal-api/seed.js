const db = require('./database');

const predefinedServices = [
  {
    name: 'Personal Hygiene Assistance',
    category: 'Daily Personal Activities',
    description: 'Support with personal hygiene tasks',
    accent: '#d9534f',
    icon: 'self_improvement'
  },
  {
    name: 'Meal Preparation Support',
    category: 'Daily Personal Activities',
    description: 'Assistance in preparing daily meals',
    accent: '#d9534f',
    icon: 'restaurant'
  },
  {
    name: 'Community Participation Program',
    category: 'Community Access',
    description: 'Programs for community involvement',
    accent: '#b59b00',
    icon: 'groups'
  },
  {
    name: 'Social Skills Group',
    category: 'Community Access',
    description: 'Group sessions for social skill development',
    accent: '#b59b00',
    icon: 'diversity_3'
  },
  {
    name: 'Occupational Therapy',
    category: 'Therapy Supports',
    description: 'Therapy for daily living and work skills',
    accent: '#2f5bd3',
    icon: 'healing'
  },
  {
    name: 'Speech Therapy',
    category: 'Therapy Supports',
    description: 'Speech and communication therapy',
    accent: '#2f5bd3',
    icon: 'record_voice_over'
  },
  {
    name: 'Short Term Respite Accommodation',
    category: 'Respite Care',
    description: 'Temporary accommodation support',
    accent: '#7a3db8',
    icon: 'hotel'
  },
  {
    name: 'Plan Management & Coordination',
    category: 'Support Coordination',
    description: 'Managing and coordinating support plans',
    accent: '#7d7d7d',
    icon: 'assignment'
  }
];

console.log('Seeding database with predefined services...');

// Clear existing data
db.exec('DELETE FROM services');
db.exec('DELETE FROM sqlite_sequence WHERE name = "services"');

// Insert services
const insert = db.prepare(`
  INSERT INTO services (name, category, description, accent, icon)
  VALUES (@name, @category, @description, @accent, @icon)
`);

const insertMany = db.transaction((services) => {
  for (const service of services) {
    insert.run(service);
  }
});

insertMany(predefinedServices);

console.log(`Successfully seeded ${predefinedServices.length} services.`);

// Verify
const count = db.prepare('SELECT COUNT(*) as count FROM services').get();
console.log(`Total services in database: ${count.count}`);

process.exit(0);
