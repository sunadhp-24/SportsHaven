import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const Register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const profile_pic = req.file ? req.file.path : null;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      profile_pic,
    });
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json("User not found");

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return res.status(401).json("Wrong credentials");

    const token = jwt.sign({ id: user.userid }, process.env.SECRET_KEY);
    const { password: _, ...userRes } = user.get({ plain: true });
    return res
      .status(200)
      .cookie("token", token, { httpOnly: true })
      .json({ user: userRes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    res.status(200).json({
      username: user.username,
      profile_pic: user.profile_pic,
      activelobby: user.activelobby,
      currentlobby: user.currentlobby,
      userid: user.userid,
    });
  } catch (error) {
    next(error);
  }
};
