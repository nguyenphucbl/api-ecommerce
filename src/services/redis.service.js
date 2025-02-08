"use strict";

const redis = require("redis");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});
redisClient.on("error", (err) => {
  console.log("Error " + err);
});
(async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
})(); // connect to redis
const acquiredLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; //3s lock
  for (let i = 0; i < retryTimes; i++) {
    // create key, who can create key success, who can get lock
    const result = await redisClient.setNX(key, expireTime);
    console.log("🚀 ~ acquiredLock ~ result:", result);
    if (result === 1) {
      // inventory check
      const isReserved = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReserved.modifiedCount) {
        await redisClient.pExpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquiredLock,
  releaseLock,
};
