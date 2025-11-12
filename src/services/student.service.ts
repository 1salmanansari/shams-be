import Student from "../models/student.modal";
import Class from "../models/class.modal";
import School from "../models/school.modal";
import { PipelineStage } from "mongoose";
import { IStudent } from "../types/common";
import { fetchByPagination } from "./fee.service";

export const add = async (data: IStudent) => new Student(data).save();

export const get = async (options?: {
	id?: string;
	schoolId?: string;
	classId?: string;
	page?: number;
	limit?: number;
}) => {
	const { id, schoolId, classId, page = 0, limit = 10 } = options || {};
	const skip = page > 0 ? (page - 1) * limit : 0;

	const matchStage: Record<string, string | boolean> = { isDelete: false };
	if (schoolId) matchStage.schoolId = schoolId;
	if (classId) matchStage.classId = classId;
	if (id) matchStage.id = id;

	const pipeline: PipelineStage[] = [
		{ $match: matchStage },
		{
			$lookup: {
				from: "classes",
				localField: "classId",
				foreignField: "id",
				as: "classInfo",
			},
		},
		{ $unwind: { path: "$classInfo", preserveNullAndEmptyArrays: true } },
		{
			$addFields: {
				name: { $concat: ["$firstName", " ", "$lastName"] },
				class: "$classInfo.name",
				section: "$classInfo.section",
				fee: "$classInfo.fee",
				pending: {
					$cond: {
						if: { $gt: ["$classInfo.fee", 0] },
						then: {
							$max: [
								{ $subtract: ["$classInfo.fee", { $ifNull: ["$paid", 0] }] },
								0,
							],
						},
						else: { $ifNull: ["$classInfo.fee", 0] },
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				id: 1,
				enrollmentNo: 1,
				name: 1,
				firstName: 1,
				lastName: 1,
				class: 1,
				classId: 1,
				section: 1,
				gender: 1,
				mobile: 1,
				email: 1,
				schoolId: 1,
				paid: 1,
				fee: 1,
				pending: 1,
				isActive: 1,
				createdAt: 1,
			},
		},
		{ $sort: { updatedAt: -1 } },
	];

	if (page > 0) {
		pipeline.push({ $skip: skip }, { $limit: limit });
	}

	const data = await Student.aggregate(pipeline);

	if (page === 1) {
		const totalCount = await Student.countDocuments(matchStage);
		const totalPages = Math.ceil(totalCount / limit);
		return {
			list: data,
			page,
			pages: totalPages,
			count: totalCount,
		};
	}

	return {
		list: data,
		count: page ? 0 : data.length,
		page,
	};
};

export const getDetail = async (id: string, activeYear?: string) => {
	const student = await Student.findOne({ id }).lean();
	if (!student) throw Error("FAIL: Student not found");

	const sec = await Class.findOne({ id: student.classId }).select("name section").lean();
	if (!sec) throw new Error("FAIL: Class not found");

	const school = await School.findOne({ id: student.schoolId }).select("name").lean();
	if (!school) throw new Error("FAIL: School not found");

	if (activeYear) {
		const { list } = await fetchByPagination({ detail: '1', studentId: id, schoolId: student.schoolId, classId: student.classId, academicYear: activeYear });
		return {
			...student,
			class: sec.name,
			section: sec.section,
			school: school.name,
			statement: list || [],
		};
	}

	return {
		...student,
		class: sec.name,
		section: sec.section,
		school: school.name,
	};
};

export const set = async (id: string, data: IStudent) => Student.findOneAndUpdate({ id }, { ...data, updatedAt: Date.now() }, { new: true });

export const removeCloud = async (id: string) => Student.findOneAndUpdate({ id }, { isDelete: true, isActive: false, updatedAt: Date.now() }, { new: true });

export const remove = async (id: string) => Student.findOneAndDelete({ id });

export const search = async (query: string) => {
	const regex = new RegExp(query, "i");

	const data = await Student.aggregate([
		{
			$match: {
				isDelete: false,
				$or: [
					{ firstName: regex },
					{ lastName: regex },
					{ mobile: regex },
					{ enrollmentNo: regex },
				],
			},
		},
		{
			$lookup: {
				from: "classes",
				localField: "classId",
				foreignField: "id",
				as: "classInfo",
			},
		},
		{
			$unwind: {
				path: "$classInfo",
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$addFields: {
				name: { $concat: ["$firstName", " ", "$lastName"] },
				class: "$classInfo.name",
				section: "$classInfo.section",
			},
		},
		{
			$project: {
				_id: 0,
				id: 1,
				name: 1,
				enrollmentNo: 1,
				mobile: 1,
				email: 1,
				classId: 1,
				class: 1,
				section: 1,
			},
		},
		{ $limit: 10 },
	]);
	return { list: data };
};

