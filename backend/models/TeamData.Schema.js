const mongoose = require('mongoose');

const TeamDataSchema = new mongoose.Schema({
	// Add your fields here
    teamNumber: {
        type: Number,
        required: true,
    }, 
    participantCount: {
        type: Number,
        required: true,
        min: 1,
        max: 4,
    },
    LeaderName: {
        type: String,
        required: true
    },
    LeaderPhoneNumber: {
        type: Number,
        required: true,
        min: 1000000000,
        max: 9999999999
    },
    LeaderEmail: {
        type: String,
        required: true,
        match: /.+\@.+\..+/
    },
    LeaderRegisterNumber: {
        type: Number,
        required: true
    },
    LeaderFoodPreference: {
        type: String,
        enum: ['Vegetarian', 'Non-Vegetarian'],
        required: true
    },
    LeaderGender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    Members: {
        type: [
            {
                name: { type: String, required: true },
                email: { type: String, required: true, match: /.+\@.+\..+/ },
                phone: { type: Number, required: true, min: 1000000000, max: 9999999999 },
                registerNumber: { type: Number, required: true },
                foodPreference: { type: String, enum: ['Vegetarian', 'Non-Vegetarian'], required: true },
                gender: { type: String, enum: ['Male', 'Female'], required: true }
            }
        ],
        validate: [arr => arr.length <= 3, 'Members array must have at most 3 elements'],
        required: true
    },
    events: {
        type: [String],
        validate: [arr => arr.length <= 8, 'Events array must have at most 8 elements'],
        required: true
    },

    payment: {
        type: {
            method: { type: String, required: false },
            status: { type: String, required: false },
            order_id: { type: String, required: false },
            receipt_id: { type: String, required: false }
        },
        required: false
    }

	// Add more fields as needed
}, {
    collection: 'TeamData'
});

module.exports = mongoose.model('TeamData', TeamDataSchema);
