import User from "../model/user_model.js";

export const getUsers = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      const error = new Error("Access restricted");
      error.statusCode = 403;
      throw error;
    }
    const users = await User.find();
    res.status(200).json({
      status: "success",
      number_of_users: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  console.log("Request Params:", req.params); // Debugging

  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const user = await User.findById(id).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role && req.user.role === "admin") user.role = role;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    await user.save();
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    await User.deleteOne({ _id: id });

    res.status(200).json({
      status: "success",
      message: "User Deleted",
    });
    next();
  } catch (e) {
    next(e);
  }
};
