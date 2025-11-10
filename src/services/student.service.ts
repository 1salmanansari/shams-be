import Student from "../models/student.modal";
import Class from "../models/class.modal";
import School from "../models/school.modal";
import Fee from "../models/fee.modal";
import { PipelineStage } from "mongoose";

export const createStudent = async (data: any) => new Student(data).save();

export const getStudents = async (options?: {
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
			$lookup: {
				from: "fees",
				let: { studentId: "$id" },
				pipeline: [
					{ $match: { $expr: { $eq: ["$studentId", "$$studentId"] } } },
					{
						$group: {
							_id: null,
							totalPaid: { $sum: { $ifNull: ["$paidAmount", 0] } },
							totalPending: { $sum: { $ifNull: ["$pendingAmount", 0] } },
						},
					},
				],
				as: "feeSummary",
			},
		},
		{ $unwind: { path: "$feeSummary", preserveNullAndEmptyArrays: true } },
		{
			$addFields: {
				name: { $concat: ["$firstName", " ", "$lastName"] },
				class: "$classInfo.name",
				section: "$classInfo.section",
				fee: "$classInfo.fee",
				paid: { $ifNull: ["$feeSummary.totalPaid", 0] },
				pending: {
					$cond: {
						if: { $gt: ["$classInfo.fee", 0] },
						then: {
							$max: [
								{ $subtract: ["$classInfo.fee", { $ifNull: ["$feeSummary.totalPaid", 0] }] },
								0,
							],
						},
						else: { $ifNull: ["$feeSummary.totalPending", 0] },
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
				section: 1,
				gender: 1,
				mobile: 1,
				email: 1,
				schoolId: 1,
				classId: 1,
				paid: 1,
				fee: 1,
				pending: 1,
				isActive: 1,
				createdAt: 1,
			},
		},
		{ $sort: { createdAt: -1 } },
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
		page: 0,
	};
};

export const getStudentById = async (id: string) => Student.findOne({ id, isDelete: false });

export const updateStudent = async (id: string, data: any) =>
	Student.findOneAndUpdate({ id }, { ...data, updatedAt: Date.now() }, { new: true });

export const deleteStudent = async (id: string) =>
	Student.findOneAndUpdate({ id }, { isDelete: true, isActive: false, updatedAt: Date.now() }, { new: true });

// 🔍 Search by name, mobile, or enrollment
export const searchStudents = async (query: string) => {
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


// 📊 Get detailed student + class + school + fee summary
export const getStudentDetail = async (studentId: string) => {
	const student = await Student.findOne({ id: studentId, isDelete: false });
	if (!student) return null;

	const classInfo = await Class.findOne({ id: student.classId });
	const school = await School.findOne({ id: student.schoolId });
	const currentYear = new Date().getFullYear();

	const fees = await Fee.aggregate([
		{ $match: { studentId, year: currentYear } },
		{
			$group: {
				_id: null,
				totalPaid: { $sum: "$paidAmount" },
				totalPending: { $sum: "$dueAmount" },
			},
		},
	]);

	return {
		student,
		classInfo,
		school,
		totalPaid: fees[0]?.totalPaid || 0,
		totalPending: fees[0]?.totalPending || 0,
	};
};
