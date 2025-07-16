const mongoose = require('mongoose');

const userQuerySchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true
    },
    conversation: [
        {
            role: {
                type: String,
                enum: ['user', 'server'],
                required: true
            },
            message: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    collection: 'celebalFlyQueries',
    timestamps: true
});

const UserQuery = mongoose.model('UserQuery', userQuerySchema);
module.exports = UserQuery;
