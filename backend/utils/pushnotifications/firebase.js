const admin=require('firebase-admin');

const serviceAccount=require('./jobportal.json');

// Check if app is already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
module.exports=admin;