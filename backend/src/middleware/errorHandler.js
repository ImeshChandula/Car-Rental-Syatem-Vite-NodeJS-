// Error handling middleware
const errorHandling = (err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({ message: 'Server error', error: process.env.NODE_ENV === 'development' ? err.message : {} });
};

export default errorHandling;