// ==================== ENVIRONMENT VALIDATION ====================
const validateEnvironment = () => {
    const requiredEnvVars = [
        'FIREBASE_PROJECT_ID',
        'FIREBASE_CLIENT_EMAIL',
        'FIREBASE_PRIVATE_KEY',
        'FIREBASE_STORAGE_BUCKET',
        //'SESSION_SECRET',
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:', missingVars);
        process.exit(1);
    }

    // Safe logging (only in development and without sensitive data)
    if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Environment Configuration:');
        console.log('- NODE_ENV:', process.env.NODE_ENV);
        console.log('- PORT:', process.env.PORT || 5000);
        console.log('- FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
        console.log('- FIREBASE_STORAGE_BUCKET:', process.env.FIREBASE_STORAGE_BUCKET);
        console.log('- Session secret configured:', !!process.env.SESSION_SECRET);
    }
};

export { validateEnvironment };