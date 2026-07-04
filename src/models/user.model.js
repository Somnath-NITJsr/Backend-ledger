const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email already exists'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address'],
    },
    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: [6, 'password should contain atleast 6 characters'],
        trim: true,
        select: false, // by default the password will not be display, if the logic wants the password then it can display otherwise not
    },
    systemUser: {
        type: Boolean,
        immutable: true,
        default: false,
        select: false,
    }
}, {
    timestamps: true,
})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const hashpassword = await bcrypt.hash(this.password, 10);
    this.password = hashpassword;

    return;
})

userSchema.methods.comparePassword = async function (password) {

    return await bcrypt.compare(password, this.password);

}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;