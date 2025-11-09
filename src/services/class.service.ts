import ClassModel from "../models/class.modal";

export const createClass = async (data: any) => {
	const cls = new ClassModel(data);
	return await cls.save();
};

export const getAllClasses = async () => {
	const data = await ClassModel.find();
	return { list: data };
};

export const getClassById = async (id: string) => {
	return await ClassModel.findOne({ id });
};

export const updateClass = async (id: string, data: any) => {
	return await ClassModel.findOneAndUpdate(
		{ id },
		{ ...data, updatedAt: Date.now() },
		{ new: true }
	);
};

export const deleteClass = async (id: string) => {
	return await ClassModel.findOneAndDelete({ id });
};
