// ================================
// Port
// ================================
process.env.PORT = process.env.PORT || 3000;

// ================================
// Enviroment
// ================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================================
//  Token expiration
// ================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;
// ================================
//  Autentication SEED
// ================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

// ================================
// Data Base
// ================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;