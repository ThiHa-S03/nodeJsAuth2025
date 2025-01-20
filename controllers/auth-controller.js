const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerController = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;
    const checkExistingUser = await User.findOne({
      $or: [{ userName, email }],
    });
    if (checkExistingUser) {
      res.status(400).json({
        success: false,
        message: "User is already exist with either same username or email",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newlyCreateUser = new User({
      userName: userName,
      email: email,
      password: hashedPassword,
      role: role || "user",
    });

    await newlyCreateUser.save();
    if (newlyCreateUser) {
      res.status(201).json({
        success: true,
        message: "User registed successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User not registered successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something wrong",
    });
  }
};
const logInController = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName: userName });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid username of password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credential",
      });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        userName: user.userName,
        role: user.role,
      },
      process.env.JWT_SECRECT_KEY,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      success: true,
      message: "logged in successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something wrong",
    });
  }
};
const changePasswordController = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "You are not logged In",
      });
    }
    const oldedPassword = user.password;
    const isPasswordMatch = await bcrypt.compare(oldPassword, oldedPassword);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "The old password is not correct",
      });
    }
    const salt = await bcrypt.genSalt(10);
    console.log("newPassword =>", typeof newPassword);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = newHashedPassword;
    user.save();
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something wrong",
    });
  }
};
module.exports = {
  registerController,
  logInController,
  changePasswordController,
};
