const initializeFirebase = require("../config/firebase");
const bcrypt = require('bcryptjs');

const { db } = initializeFirebase();
const userCollection = db.collection('users');

class User {
    constructor (id, data) {
        this.id = id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.phone = data.phone;
        this.licenseNumber = data.licenseNumber;
        this.role = data.role || 'customer'; // 'manager', 'owner'
        this._isPasswordModified = false;

        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    // Create a new user
    static async create(userData) {
        try {
            // Validate userData
            if (!userData || !userData.email || !userData.password) {
                throw new Error('Email and password are required');
            }

            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);

            const userRef = await userCollection.add({...userData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            return new User(userRef.id, userData);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    };

    // Compare password
    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    };

    // Get a user by email
    static async findByEmail(email) {
        try {
            const userRef = await userCollection.where('email', '==', email).get();
            
            if (userRef.empty){
                return null;
            }

            const userDoc = userRef.docs[0];
            return new User(userDoc.id, userDoc.data());
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    };
}

module.exports = User;