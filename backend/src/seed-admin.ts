import * as bcrypt from 'bcrypt';
import { connect, connection } from 'mongoose';

async function seedAdmin() {
  try {
    // Connect to MongoDB
    const MONGODB_URI =
      process.env.MONGODB_URI ||
      'mongodb+srv://vietanh142004:Matkhau1234%40@cluster0.eikmqxo.mongodb.net/lucky-money';
    await connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Admin credentials
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin already exists
    const existingAdmin = await connection
      .collection('admins')
      .findOne({ username });

    if (existingAdmin) {
      console.log(`⚠️  Admin '${username}' already exists!`);
    } else {
      // Create admin
      await connection.collection('admins').insertOne({
        username,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('✅ Admin account created successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`   Username: ${username}`);
      console.log(`   Password: ${password}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔐 Please change this password after first login!');
    }

    await connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
