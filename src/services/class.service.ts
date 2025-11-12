import { IClass } from "types/common";
import ClassModel from "../models/class.modal";
import School from "../models/school.modal";
import { fetchByPagination } from "./fee.service";

export const add = async (data: IClass) => new ClassModel(data);

export const get = async (schoolId?: string) => {
	const filter = schoolId ? { schoolId } : {};
	const classes = await ClassModel.find(filter).lean();
	if (!classes.length) return { list: [], message: "No classes found" };

	const schoolIds = [...new Set(classes.map((cls) => cls.schoolId))];
	const schools = await School.find({ id: { $in: schoolIds } }).select("id name").lean();
	const schoolMap = new Map(schools.map((s) => [s.id, s.name]));
	const result = classes.map((cls) => ({ ...cls, school: schoolMap.get(cls.schoolId) || null, }));

	return { list: result };
};

export const getDetail = async (id: string, activeYear?: string) => {
	const cls = await ClassModel.findOne({ id }).lean();
	if (!cls) throw new Error("FAIL: Class not found");

	const school = await School.findOne({ id: cls.schoolId }).select("id name").lean();
	if (!school) throw new Error("FAIL: School not found");

	if (activeYear) {
		const { list } = await fetchByPagination({ detail: '1', classId: id, schoolId: school.id, academicYear: activeYear });
		return {
			...cls,
			school: school?.name || '',
			statement: list || [],
		};
	}

	return { ...cls, school: school?.name || '', };
};

export const set = async (id: string, data: IClass) => {
	return await ClassModel.findOneAndUpdate({ id }, { ...data, updatedAt: Date.now() }, { new: true });
};

export const omit = async (id: string) => {
	return await ClassModel.findOneAndDelete({ id });
};
