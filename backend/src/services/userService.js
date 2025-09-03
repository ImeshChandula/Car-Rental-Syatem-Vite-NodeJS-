import BaseService from './Base/BaseService.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';



class UserService extends BaseService{
    constructor () {
        super('users', User, {
            createdAtField: 'createdAt',
            updatedAtField: 'updatedAt',
            idField: 'id'
        });
    }

    // Compare password
    async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Get a user by email
    async findByEmail(email) {
        try {
            const docs = await this.findByFilter('email', '==', email);
        
            if (docs.length === 0){
                return null
            }

            return docs[0];
        } catch (error){
            throw error;
        }
    }

    // Find user by Google ID
    async findByGoogleId(googleId) {
        try {
            const docs = await this.findByFilter('googleId', '==', googleId);
        
            if (docs.length === 0){
                return null
            }

            return docs[0];
        } catch (error){
            throw error;
        }
    }

};

export default UserService;