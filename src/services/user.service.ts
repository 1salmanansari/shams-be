import User from "../models/user.modal";

export const createUser = async (data: any) => {
  const user = new User(data);
  return await user.save();
};

export const getAllUsers = async () => {
  return await User.find();
};

export const getUserById = async (id: string) => {
  return await User.findOne({ id });
};

export const updateUser = async (id: string, data: any) => {
  return await User.findOneAndUpdate({ id }, { ...data, updatedAt: Date.now() }, { new: true });
};

export const deleteUser = async (id: string, isVirtual?: boolean) => {
  if (isVirtual) {
    return await User.findOneAndUpdate({ id }, { isDelete: true, isActive: false, updatedAt: Date.now() }, { new: true });
  }
  return await User.findOneAndDelete({ id });
};

export const auth = async (email: string) => {
  return await User.findOne({ email });
};

export const authFromToken = async (id: string, token: string) => {
  try {
    return await User.findOne({ id, tokens: token });
  } catch (error) {
    return null;
  }
};