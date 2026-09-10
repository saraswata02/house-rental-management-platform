const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName:   { type: String, required: true, trim: true },
    lastName:    { type: String, required: true, trim: true },
    email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    userId:      { type: String, unique: true }, // e.g. TEN0001 / OWN0001 – auto-generated
    tenantUserId: { type: String, unique: true, sparse: true },
    ownerUserId: { type: String, unique: true, sparse: true },
    password:    { type: String, required: true, minlength: 6 },
    phone:       { type: String, default: '' },
    dob:         { type: String, default: '' },
    gender:      { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    role:        { type: String, enum: ['tenant', 'landlord'], default: 'tenant' },
    roles:       { type: [{ type: String, enum: ['tenant', 'landlord'] }], default: [] },
    roleSelected: { type: Boolean, default: false },
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
    subscriptionPlan: { type: String, enum: ['free', 'pro'], default: 'free' },
}, { timestamps: true });

// Auto-generate userId before saving
userSchema.pre('save', async function () {
    if (this.tenantUserId && !this.roles.includes('tenant')) {
        this.roles.push('tenant');
    }
    if (this.ownerUserId && !this.roles.includes('landlord')) {
        this.roles.push('landlord');
    }
    if (!this.roles.includes(this.role)) {
        this.roles.push(this.role);
    }

    if (this.roleSelected || this.userId) {
        this.roleSelected = true;
        const idField = this.role === 'landlord' ? 'ownerUserId' : 'tenantUserId';
        const prefix = this.role === 'landlord' ? 'OWN' : 'TEN';

        if (!this[idField] || !this[idField].startsWith(prefix)) {
            const legacyId = this.userId && this.userId.startsWith(prefix) ? this.userId : '';
            if (legacyId) {
                this[idField] = legacyId;
            } else {
                const count = await mongoose.model('User').countDocuments({ [idField]: new RegExp(`^${prefix}`) });
                this[idField] = `${prefix}${String(count + 1).padStart(4, '0')}`;
            }
        }

        this.userId = this[idField];
    }
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
