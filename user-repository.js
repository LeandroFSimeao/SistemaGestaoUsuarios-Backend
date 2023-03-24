const mongo = require("mongodb");

class UserRepository {
  constructor(collection) {
    this.collection = collection;
  }

  async findAll() {
    const result = await this.collection.find({});

    return result.toArray();
  }

  async find(id) {
    return this.collection.findOne({
      _id: new mongo.ObjectId(id),
    });
  }

  async insert(user) {
    await this.collection.insertOne(user);
    return user;
  }

  async remove(id) {
    const result = await this.collection.deleteOne({
      _id: new mongo.ObjectId(id),
    });

    return result.deletedCount;
  }

  async update(id, user) {
    const result = await this.collection.updateOne(
      { _id: new mongo.ObjectId(id) },
      { $set: user }
    );

    if (result.matchedCount === 1) {
      return await this.find(id);
    }
    return null;
  }

  async clear() {
    await this.collection.deleteMany({});
  }
}

module.exports = UserRepository;
