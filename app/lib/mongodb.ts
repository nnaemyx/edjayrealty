import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;

const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true,
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
        // Clear stale promise so the next request can retry after Atlas/network is fixed
        globalWithMongo._mongoClientPromise = undefined;
        throw err;
      });
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  console.warn(
    "WARNING: MONGODB_URI is not defined. The app will use empty data fallbacks."
  );
}

export function getDatabaseName(): string {
  return process.env.MONGODB_DB_NAME || "edjayrealty";
}

export default clientPromise;
