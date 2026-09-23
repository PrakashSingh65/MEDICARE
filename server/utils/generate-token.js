import jwt from 'jsonwebtoken';

export const generateToken = (userOrId, res, extraData = {}) => {
    let userId = userOrId;
    let role = extraData.role || 'patient';
    let email = extraData.email || '';
    let username = extraData.username || '';

    if (typeof userOrId === 'object' && userOrId !== null) {
        userId = userOrId._id || userOrId.id;
        role = userOrId.role || extraData.role || 'patient';
        email = userOrId.email || extraData.email || '';
        username = userOrId.username || extraData.username || '';
    }

    // Normalize 'user' role to 'patient'
    if (role === 'user') {
        role = 'patient';
    }

    const secret = process.env.JWT_SECRET_TOKEN || 'medicare_jwt_secret_token_2026';
    const token = jwt.sign(
        { userId, role, email, username },
        secret,
        { expiresIn: '7d' }
    );

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        path: '/',
    });

    return token;
};