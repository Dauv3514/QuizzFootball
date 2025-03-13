import { createClient } from 'redis';

const redisClient = createClient({
    url: "redis://127.0.0.1:6379"
});

redisClient.on("error", (err) => console.error("❌ Redis Error:", err));
redisClient.on("connect", () => console.log("✅ Connecté à Redis"));

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error("Erreur lors de la connexion à Redis", err);
    }
};

export { redisClient, connectRedis };