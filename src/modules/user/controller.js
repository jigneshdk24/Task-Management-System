const { success, error } = require("../../helpers/responseBuilder/response");
const M = require("../../helpers/constants/messages");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../models");

const JWT_SECRET = process.env.JWT_SECRET;

// register
const register = async (req, res) => {
  const { name, email, contact, password, is_admin = 0 } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return error(res, M.user.exists, 400);

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      contact,
      password: hashedPassword,
      is_admin,
    });

    return success(res, M.user.registered, newUser);
  } catch (e) {
    return error(res, M.common.serverError, 500);
  }
};

// login
const login = async (req, res) => {
  const { email, password: payloadPassword } = req.body;
  try {
    const existingUser = await User.findOne({
      where: { email },
      attributes: [
        "id",
        "name",
        "email",
        "password",
        "contact",
        "created_at",
        "updated_at",
        "is_admin",
        "is_first_login",
      ],
    });
    if (!existingUser) return error(res, M.user.notFound, 404);

    const hashedPassword = existingUser.password;
    const isPasswordValid = await bcrypt.compare(payloadPassword, hashedPassword);
    if (!isPasswordValid) return error(res, M.user.invalidCredentials, 401);

    if (!JWT_SECRET) return error(res, M.common.serverError, 500);

    if (existingUser.is_first_login === 1) {
      existingUser.is_first_login = 0;
      await existingUser.save();
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser.id, is_admin: existingUser.is_admin },
      JWT_SECRET,
      { expiresIn: "10d" }
    );

    return success(res, M.user.loginSuccess, {
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        contact: existingUser.contact,
        is_admin: existingUser.is_admin,
        createdAt: existingUser.created_at,
      },
      token,
    });
  } catch (e) {
    return error(res, M.common.serverError, 500);
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(userId);
    if (!user) return error(res, M.user.notFound, 404);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return error(res, M.user.invalidCredentials, 401);

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    if (user.is_first_login === 1) user.is_first_login = 0;
    await user.save();
    return success(res, M.user.passwordChanged);
  } catch (e) {
    return error(res, M.common.serverError, 500);
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return error(res, M.user.notFound, 404);

    const resetToken = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "15m" });
    return success(res, M.user.resetTokenCreated, { resetToken });
  } catch (e) {
    return error(res, M.common.serverError, 500);
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    const payload = jwt.verify(resetToken, JWT_SECRET);
    const user = await User.findOne({ where: { email: payload.email } });
    if (!user) return error(res, M.user.notFound, 404);

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();
    return success(res, M.user.passwordReset);
  } catch (e) {
    return error(res, M.common.invalidToken, 400);
  }
};

module.exports = { register, login, changePassword, forgotPassword, resetPassword };


