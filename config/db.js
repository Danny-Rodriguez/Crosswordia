const mongoose = require("mongoose");

async function resolveMongoUri() {
  if (process.env.E2E === "true") {
    if (process.env.MONGO_URI_TEST) return process.env.MONGO_URI_TEST;
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mem = await MongoMemoryServer.create();
    const uri = mem.getUri();
    console.log(`Using in-memory MongoDB at ${uri}`);
    process.on("SIGINT", () => mem.stop().then(() => process.exit(0)));
    process.on("SIGTERM", () => mem.stop().then(() => process.exit(0)));
    return uri;
  }
  return process.env.MONGO_URI;
}

const connectDB = async (uri) => {
  try {
    const conn = await mongoose.connect(uri, {});
    console.log(
      `MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`,
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = { connectDB, resolveMongoUri };
