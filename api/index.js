import client from "./database.js"

const connect = async () => {
    try {
        await client.connect();
        console.log("Host:", client.host);
        console.log("Port:", client.port);
        console.log("User:", client.user);
        console.log("Connecté à la base de données :", client.database);
        // const app = express();
        // app.listen(8800, () => {
        //     console.log('Backend server est lancé!');
        // });
    } catch (err) {
        console.error('Erreur de connexion à la base de données:', err);
    }
}

connect();