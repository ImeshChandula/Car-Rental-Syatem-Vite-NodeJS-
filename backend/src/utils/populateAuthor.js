import UserService from '../services/userService.js';

const userService = new UserService();

// Populates the `author` field with full user data
const populateAuthor = async (data) => {
    const populateOne = async (category) => {
        // Handle both string ID and object with ID
        const authorId = typeof category.author === 'string' 
            ? category.author 
            : category?.author?.id;
            
        if (authorId) {
            try {
                const user = await userService.findById(authorId);
                if (user) {
                    category.author = {
                        id: user.id,
                        email: user.email,
                        username: user.name,
                        profilePicture: user.profilePicture,
                    };
                } else {
                    category.author = null;
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                category.author = null;
            }
        }
        return category;
    };

    if (Array.isArray(data)) {
        return Promise.all(data.map(populateOne));
    } else {
        return populateOne(data);
    }
};

export default populateAuthor;
