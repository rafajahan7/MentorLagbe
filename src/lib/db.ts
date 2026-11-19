
import clientPromise from "./mongodb";

const client = await clientPromise;

const db = client.db("mentorlagbe");

export default db;
