import { ISchool } from "../types/common";
import School from "../models/school.modal";
import { fetchByPagination } from "./fee.service";

export const add = async (data: ISchool) => {
	const school = new School(data);
	return await school.save();
};

export const get = async () => {
	const data = await School.find();
	return {
		list: data,
	};
};

export const getDetail = async (id: string, activeYear?: string) => {
	const school = await School.findOne({ id }).lean();
	if (!school) throw new Error("FAIL: School not found");

	if (activeYear) {
		const { list } = await fetchByPagination({ detail: '1', schoolId: id, academicYear: activeYear });
		return {
			...school,
			statement: list || [],
		};
	}

	return { ...school, school: school?.name || '', };
};

export const set = async (id: string, data: ISchool) => {
	return await School.findOneAndUpdate({ id }, { ...data, updatedAt: Date.now() }, { new: true });
};

export const omit = async (id: string) => {
	return await School.findOneAndDelete({ id });
};
