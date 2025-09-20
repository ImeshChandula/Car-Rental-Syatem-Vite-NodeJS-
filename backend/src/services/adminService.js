import BaseService from './Base/BaseService.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';


class AdminService extends BaseService{
    constructor () {
        super('admin', Admin, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at',
            idField: 'admin_id'
        });
    }

    async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

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

    async findByNIC(nic) {
        try {
            const docs = await this.findByFilter('nic', '==', nic);
        
            if (docs.length === 0){
                return null
            }

            return docs[0];
        } catch (error){
            throw error;
        }
    }

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

export default AdminService;