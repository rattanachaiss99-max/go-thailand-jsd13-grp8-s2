require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5001;

// Connect to MongoDB Atlas first, then start listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 [User-Service] Server is running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
  });
});
