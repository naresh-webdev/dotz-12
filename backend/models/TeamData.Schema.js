const mongoose = require('mongoose');

const TeamDataSchema = new mongoose.Schema({
    teamNumber: {
        type: Number,
        required: true,
    }, 
    teamKey: {
        type: String,
        required: true,
        unique: true
    },
    participantCount: {
        type: Number,
        required: true,
        min: 1,
        max: 4,
    },
    leaderName: {
        type: String,
        required: true
    },
    leaderPhoneNumber: {
        type: String,
        required: true
    },
    leaderEmail: {
        type: String,
        required: true,
        match: /.+\@.+\..+/
    },
    leaderRegisterNumber: {
        type: String,
        required: true
    },
    collegeName: {
        type: String,
        required: true
    },
    collegeId: {
        type: String,
        required: true
    },
    leaderFoodPreference: {
        type: String,
        enum: ['Vegetarian', 'Non-Vegetarian'],
        required: true
    },
    leaderGender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    hasVisited: {
        type: Boolean,
        default: false
    },
    members: {
        type: [
            {
                name: { type: String, required: true },
                email: { type: String, required: true, match: /.+\@.+\..+/ },
                phone: { type: String, required: true },
                registerNumber: { type: String, required: true },
                foodPreference: { type: String, enum: ['Vegetarian', 'Non-Vegetarian'], required: true },
                gender: { type: String, enum: ['Male', 'Female'], required: true },

                events: {
                    type: [String],
                    validate: {
                        validator: function (arr) {
                            return arr.length >= 1 && arr.length <= 4;  // min 1, max 4
                        },
                        message: 'Each member must select at least 2 events and at most 5.'
                    }
                }
            }
        ],
        validate: [arr => arr.length <= 3, 'Members array must have at most 3 elements'],
        required: true
    },
    leaderEvents: {
        type: [String],
        validate: {
            validator: function (arr) {
                return arr.length >= 2 && arr.length <= 5;  // min 2, max 5
            },
            message: 'Leader must select at least 2 events and at most 5.'
        }
    },
    // payment information
    orderId: {type: String, required: false, default: ''},
    paymentStatus: {type: String, required: false, default: 'UNPAID'},
    paymentMethod: {type: String, required: false, default: ''},
    paymentId: {type: String, required: false, default: ''},
    paymentTime: {type: Date, required: false, default: null},
    bankReference: {type: String, required: false, default: ''},

    
    paperPresentationTeamCount: {
        type: Number,
        required: false
    },
    paperPresentationTitle: {
        type: String,
        required: false
    },
    paperPresentationAbstract: {
        type: String,
        required: false
    }   

}, {
    collection: 'teamData'
});

module.exports = mongoose.model('TeamData', TeamDataSchema);
