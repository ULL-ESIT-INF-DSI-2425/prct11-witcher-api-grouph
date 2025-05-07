import { app } from './app.js';
import dotenv from 'dotenv';
import { connectToDatabase } from './db/mongoose.js';

dotenv.config({ path: "dev.env" });

const PORT = process.env.PORT || 3000;

connectToDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
