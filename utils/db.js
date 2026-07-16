const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || '127.0.0.1';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.db = null;
    this.connectPromise = this.client.connect()
      .then(() => {
        this.db = this.client.db(database);
      })
      .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
      });
  }

  isAlive() {
    return this.client && this.client.topology && this.client.topology.isConnected()
      ? true
      : false;
  }

  async nbUsers() {
    if (!this.db) {
      return 0;
    }
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    if (!this.db) {
      return 0;
    }
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
