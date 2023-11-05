const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const cloudinary =require("cloudinary");


//Register a User 
exports.registerUser = catchAsyncError(async (req, res, next) => {

    const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:800,
        crop:"scale",
    })

    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });
    sendToken(user, 201, res);
})

//Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;
    //checking if user has given password and email both
    if (!email || !password) {
        return next(new ErrorHander("Please Enter Email & Password ", 400));
    }
    // when Schema is define for password select equal to false means in general password is not selected 
    //we have to explicitly select password if we want to use 

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHander("Invalid Email or Password ", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid Email or Password ", 401));
    }

    sendToken(user, 200, res);

})


//Logout User
exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpsOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})


//Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHander("User not found ", 404));
    }

    //Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

   
    const message = 'Your password reset token is :- \n\n' + resetPasswordUrl + '\n\n If you have not requested this email then, please ignore it';

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message
        });
        res.status(200).json({
            success: true,
            // message:"Email sent to ${user.email} successfully "
            message: "Email sent to " + user.email + " successfully "
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforSave: false });
        return next(new ErrorHander(error.message, 500));
    }

})


//Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHander("Reset Password Token is invalid or has been expired ", 404));
    }

    if (req.body.password != req.body.confirmPassword) {
        return next(new ErrorHander("Password does not password ", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);

})


//Get User Detail
exports.getUserDetails = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

//Update User Password
exports.updatePassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Old password is incorect  ", 401));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHander("Password does not Match ", 400));
    }

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
})

//Update User Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
  
    if(req.body.avatar !==""){
        const user= await User.findById(req.user.id);


        const imageId=user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"avatars",
            width:800,
            crop:"scale",
        })
   
    newUserData.avatar ={
        public_id:myCloud.public_id,
        url:myCloud.secure_url
    }
}
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    });
    res.status(200).json({
        success: true,
    })
})

//Get all Users (admin)
exports.getAllUser = catchAsyncError(async (req, res, next) => {

    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})


//Get single User (admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHander("User does not exist with Id " + req.params.id))
    }

    res.status(200).json({
        success: true,
        user
    })
})


//Update User Role --Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    })
})


//Delete User --Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHander("User does not exist with id : " + req.params.id));
    }

    const imageId=user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);

    User.findOneAndDelete({ _id: req.params.id })
        .then(res.status(200).json({
            success: true,
            message: " User Deleted Successful"
        })).catch(err => next(err));


})