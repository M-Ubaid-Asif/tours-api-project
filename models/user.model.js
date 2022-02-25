const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt= require('bcrypt')
const crypto = require('crypto')
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:[true,"Please provide an email"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'email is invalid']
    },
    photo:{
        type:String,
        default:"default.jpg"
    },
    password:{
        type:String,
        required:[true,"password must be required"]
    },
    passwordChangedAt:{
        type:Date,
        default: Date.now()
    },
    passwordResetToken:{
        type:String
    },
    passwordResetExpired:Date
})

userSchema.methods.correctPassword = async function(logpassword,userpassword)
{   console.log('iam working')
    return await bcrypt.compare(logpassword,userpassword)
}

userSchema.methods.changePasswordAfter =function(jwttimestamp){
    console.log('iam working',this.passwordChangedAt)
    if(this.passwordChangedAt){
        const changedAtTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
        console.log('-----time pass',changedAtTimestamp,' ','tokentime',' ',jwttimestamp)
        const data =changedAtTimestamp > jwttimestamp
        console.log(data)
        return  changedAtTimestamp > jwttimestamp
    }
    return false
}


userSchema.pre('save',async function(){
    
    // console.log('iam',this)
    if(this.isModified('password')){
        console.log('-----')
        const hashpas =await bcrypt.hash(this.password,10)
        this.password = hashpas
        console.log(this.password)
    }
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password') || this.isNew){
        return next()
    }
    this.passwordChangedAt = Date.now() - 1000;
    next()
});

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpired = Date.now() + 10*60*1000;

    console.log('===> reset Token ==>',resetToken)
    console.log('===> encrypted Token ==>',resetToken)

    return resetToken;
}


const User = mongoose.model('User',userSchema)





module.exports = User