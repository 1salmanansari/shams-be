import School from "../models/school.modal";

export const createSchool = async (data: any) => {
	const school = new School(data);
	return await school.save();
};

export const getAllSchools = async () => {
	const data = await School.find();
	return {
		list: data,
	};
};

export const getSchoolById = async (id: string) => {
	return await School.findOne({ id });
};

export const updateSchool = async (id: string, data: any) => {
	return await School.findOneAndUpdate({ id }, { ...data, updatedAt: Date.now() }, { new: true });
};

export const deleteSchool = async (id: string) => {
	return await School.findOneAndDelete({ id });
};
