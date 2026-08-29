const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName:   { type: String, required: true, trim: true },
    lastName:    { type: String, required: true, trim: true },
    email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    userId:      { type: String, unique: true }, // e.g. TEN0001 / OWN0001 – auto-generated
    password:    { type: String, required: true, minlength: 6 },
    phone:       { type: String, default: '' },
    dob:         { type: String, default: '' },
    gender:      { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    role:        { type: String, enum: ['tenant', 'landlord'], default: 'tenant' },
    profilePicture: { type: String, default: '/default-profile.png' },
    address: {
        street:   { type: String, default: '' },
        area:     { type: String, default: '' },
        district: { type: String, default: '' },
        city:     { type: String, default: '' },
        state:    { type: String, default: '' },
        pincode:  { type: String, default: '' },
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
}, { timestamps: true });

// Auto-generate userId before saving
userSchema.pre('save', async function (next) {
    if (this.isNew) {
        const count = await mongoose.model('User').countDocuments();
        const prefix = this.role === 'landlord' ? 'OWN' : 'TEN';
        this.userId = `${prefix}${String(count + 1).padStart(4, '0')}`;
    }
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
