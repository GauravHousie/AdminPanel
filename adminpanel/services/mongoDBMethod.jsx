import { MongoClient } from "mongodb";

const uri =
  "mongodb://HousieGaurav:git123lab@ac-ts6xitf-shard-00-00.93wcpz7.mongodb.net:27017,ac-ts6xitf-shard-00-01.93wcpz7.mongodb.net:27017,ac-ts6xitf-shard-00-02.93wcpz7.mongodb.net:27017/?ssl=true&replicaSet=atlas-cntx3n-shard-0&authSource=admin&retryWrites=true&w=majority";

const { ObjectId } = require("mongodb");
const client = new MongoClient(uri);

async function HandleLiveCourtInsertOnMongoDB(court_data) {
  try {
    await client.connect();
    console.log("mongodb connected");
    const db = client.db("Pickleball_DB");
    const coll = db.collection("Courts");
    const objectId = new ObjectId(`${court_data._id}`);

    court_data._id = objectId;

    console.log(coll);
    await coll.insertOne(court_data);
    console.log("successfully inserted");
  } catch (err) {
    console.log("error", err);
    return err;
  }
}

const GetAllCourtsFromMongoDB = async () => {
  try {
    await client.connect();
    console.log("mongodb connected");
    const db = client.db("Pickleball_DB");
    const coll = db.collection("HostAddedCourts");

    // Fetch all documents from the collection
    const result = await coll.find().toArray();

    return result;
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const GetCourtFromMongoDB = async (court_id) => {
  try {
    await client.connect();
    console.log("mongodb connected");
    const db = client.db("Pickleball_DB");
    const coll = db.collection("HostAddedCourts");

    const objectId = new ObjectId(`${court_id}`);

    // Fetch all documents from the collection
    const result = await coll.find({ _id: objectId }).toArray();

    return result;
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const UpdateCourtStatusOnMongoDB = async (status, court_id) => {
  try {
    await client.connect();
    console.log("mongodb connected");
    const db = client.db("Pickleball_DB");
    const coll = db.collection("HostAddedCourts");

    const objectId = new ObjectId(`${court_id}`);

    // Fetch all documents from the collection
    const result = await coll.find({ _id: objectId }).toArray();

    console.log("result obtained is", result);
    const player_structure = { ...result[0], Status: status };

    console.log("player struct is", player_structure);
    const result2 = await coll.updateOne(
      { _id: objectId },
      { $set: player_structure }
    );

    return result;
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

export {
  GetAllCourtsFromMongoDB,
  GetCourtFromMongoDB,
  UpdateCourtStatusOnMongoDB,
  HandleLiveCourtInsertOnMongoDB,
};
