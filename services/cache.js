const mongoose = require("mongoose");
const redis = require("redis");
const client = redis.createClient();

const { promisify } = require("util");
const getHashAsync = promisify(client.hget).bind(client);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || "default");
    return this;
};

mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        })
    );


    const cachedValue = await getHashAsync(this.hashKey, key);
    const document = JSON.parse(cachedValue);

    if (document) {
        console.log("serving cache", this.mongooseCollection.name);
        return document;
    };

    console.log("serving mongo")
    const blogs = await exec.apply(this, arguments);
    client.hset(this.hashKey, key, JSON.stringify(blogs));
    return blogs;
}

module.exports = {
    clearHash(hashKey) {
        console.log("clearing");
        client.del(JSON.stringify(hashKey));
    }
}