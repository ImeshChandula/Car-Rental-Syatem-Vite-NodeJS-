import BaseService from './BaseService.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';



class UserService extends BaseService{
    constructor () {
        super('users', User, {
            createdAtField: 'createdAt',
            updatedAtField: 'updatedAt'
        });
    }

    // Override create user with hashed password
    async create(userData) {
        try {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);

            const timestamp = new Date().toISOString();
            const userRef = await this.collection.add({
                ...userData,
                [this.timestampFields.createdAt]: timestamp,
                [this.timestampFields.updatedAt]: timestamp
            });

            return new this.ModelClass(userRef.id, userData);
        } catch (error) {
            throw error;
        }
    }

    // Compare password
    async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Get a user by email
    async findByEmail(email) {
        return this.findByFilter('email', '==', email);
    }

    // Find user by Google ID
    async findByGoogleId(googleId) {
        return this.findByFilter('googleId', '==', googleId);
    }

    // Override update user with hashed password
    async updateById(id, updateData) {
        try {
            const userDoc = await this.collection.doc(id).get();

            if (!userDoc.exists) {
                return false;
            }

            // Hash password if it's being updated
            if (updateData.password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }
            
            updateData[this.timestampFields.updatedAt] = new Date().toISOString();
        
            await this.collection.doc(id).update(updateData);
        
            const updatedUser = await this.findById(id);
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

};

export default UserService;