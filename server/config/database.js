const { MongoClient } = require('mongodb');

// URL de connexion MongoDB
const uri = "mongodb+srv://adam:Nabil24081973@music.mi5tp.mongodb.net/?retryWrites=true&w=majority&appName=Music";

let db = null;

// Fonction pour se connecter à MongoDB
const connectDB = async () => {
  try {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connecté à MongoDB");
    db = client.db('music'); // 'music' est le nom de ta base de données
  } catch (err) {
    console.error('Erreur de connexion à MongoDB', err);
  }
};

// Exporter la fonction pour se connecter à la base de données
module.exports = { connectDB, db };
