// ================================
// Port
// ================================
process.env.PORT = process.env.PORT || 3000;

// ================================
// Enviroment
// ================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================================
// Enviroment
// ================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://josniel:TGBEcSigwIIVYNpZ@cluster0.bmiwl.mongodb.net/cafe';
}
process.env.URLDB = urlDB;