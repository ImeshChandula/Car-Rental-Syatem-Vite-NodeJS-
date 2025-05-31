import initializeFirebase from "../config/firebase.js";
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const { db } = initializeFirebase();
const userCollection = db.collection('users');

const UserService = {
    // Create a new user
    async create(userData) {
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
    },

    // Compare password
    async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    },

    // Get a user by email
    async findByEmail(email) {
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
    },

    // Find user by Google ID
    async findByGoogleId(googleId) {
        try {
            const userRef = await userCollection.where('googleId', '==', googleId).get();
            
            if (userRef.empty){
                return null;
            }

            const userDoc = userRef.docs[0];
            return new User(userDoc.id, userDoc.data());
        } catch (error) {
            console.error('Error finding user by Google ID:', error);
            throw error;
        }
    },

    // Get all users
    async findAll() {
        try {
            const usersRef = await userCollection.get();

            if (usersRef.empty) {
                return [];
            }

            return usersRef.docs.map(doc => new User(doc.id, doc.data()));
        } catch (error) {
            console.error('Error finding all users:', error);
            throw error;
        }
    },

    // Get a user by ID
    async findById(id) {
        try {
            const userDoc = await userCollection.doc(id).get();
            if (!userDoc.exists) {
                return null;
            }
        
            const userData = userDoc.data();
            return new User(userDoc.id, userData);
        } catch (error) {
            console.error('Error finding user for that ID:', error);
            throw error;
        }
    },

    // Update a user
    async updateById(id, updateData) {
        try {
            const userDoc = await userCollection.doc(id).get();

            if (!userDoc.exists) {
                return false;
            }

            // Hash password if it's being updated
            if (updateData.password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }
            
            updateData.updatedAt = new Date().toISOString();
        
            await userCollection.doc(id).update(updateData);
        
            const updatedUser = await UserService.findById(id);
            return updatedUser;
        } catch (error) {
            throw error;
        }
    },

    // Delete a user
    async deleteById(id) {
        try {
            const userDoc = await userCollection.doc(id).get();

            if (!userDoc.exists) {
                return false;
            }

            await userCollection.doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
};

export default UserService;