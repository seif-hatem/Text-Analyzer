const User = require("../models/user.model");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getUser = async (req, res) => {
  try {
    
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json(user);
    return user;
  } catch (error) {
    res.status(500).json(error);
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
    return user;
  } catch (error) {
    res.status(500).json(error);
  }
};


const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};


const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
