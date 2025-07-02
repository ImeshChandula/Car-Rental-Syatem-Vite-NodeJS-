import UserService from '../services/userService.js';
import generateToken from '../utils/jwtTokenCreate.js';
import sendWelcomeEmail from '../utils/sendWelcomeEmail.js';


const userService = new UserService();


//@desc     Register a new user
const register = async (req, res) => {
    try {
        const { name, email, password, phone, licenseNumber } = req.body;

        const existingUser  = await userService.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // generate a num between 1-100
        const index = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;
        
        const userData = {
            name, 
            email, 
            password, 
            phone, 
            licenseNumber, 
            profilePicture: randomAvatar,
            role: 'customer',
        };

        // send welcome email
        const result = await sendWelcomeEmail(email);
        if (!result) {
            return res.status(400).json({ message: 'welcome email sending failed' });
        }

        // Create new user
        const user = await userService.create(userData);

        // block password displaying
        user.password = undefined;

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({success: false, message: error.message });
    }
};


//@desc     User login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        const user = await userService.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const isMatch = await userService.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isAccountVerified) {
            return res.status(400).json({ message: 'Your gmail is not verified' });
        }

        // create JWT token
        const payload = {
            id: user.id,
            username: user.name,
            role: user.role,
            isAccountVerified: user.isAccountVerified,
        };

        generateToken(payload, res); 

        // block password displaying
        user.password = undefined;

        res.status(201).json({message: 'Login successful', user });
    } catch {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


//@desc     User logout
const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


//@desc     Get current user profile
const checkAuth = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userData = await userService.findById(userId);

    const user = {
        id: userData.id,
        username: userData.name,
        role: userData.role,
        isAccountVerified: userData.isAccountVerified
    };
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};



export { register, login, logout, checkAuth, };