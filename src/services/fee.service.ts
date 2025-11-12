import mongoose from "mongoose";
import School from "../models/school.modal";
import Fee from "../models/fee.modal";
import Class from "../models/class.modal";
import Student from "../models/student.modal";
import { v4 as uuidv4 } from "uuid";
import { IFee, IGet } from "../types/common";

export const create = async ({ inAdvance = false, ...payload }: IFee) => {
	const student = await Student.findOne({ id: payload.studentId });
	if (!student) throw new Error("FAIL: Student not found");

	const sec = await Class.findOne({ id: payload.classId });
	if (!sec) throw new Error("FAIL: Class not found");

	let academicYear = payload.academicYear;
	if (inAdvance) {
		const [start] = academicYear.split("-").map(Number);
		const nextStart = start + 1;
		academicYear = `${nextStart}-${nextStart + 1}`;
	}

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const feeRecord = new Fee({
			id: uuidv4(),
			...payload,
			academicYear,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});

		const saved = await feeRecord.save({ session });

		if (!inAdvance) {
			const updateRes = await Student.findOneAndUpdate(
				{ id: student.id },
				{ $inc: { paid: payload.amount } },
				{ session, new: true }
			);

			if (!updateRes) {
				throw new Error("FAIL: Could not update student payment record");
			}
		}

		await session.commitTransaction();
		session.endSession();

		return saved;
	} catch (err) {
		await session.abortTransaction();
		session.endSession();
		throw err;
	}
};


export const fetch = async (payload: IGet) => Fee.find({ ...payload });

export const fetchById = async (id: string) => {
	const data = await Fee.findOne({ id });
	if (!data) throw new Error("FAIL: Record not found");

	const student = await Student.findOne({ id: data.studentId });
	if (!student) throw new Error("FAIL: Student not found");

	const sec = await Class.findOne({ id: data.classId });
	if (!sec) throw new Error("FAIL: Class not found");

	const school = await School.findOne({ id: data.studentId });
	if (!school) throw new Error("FAIL: School not found");

	return {
		...data,
		school: school.name,
		student: `${student.firstName} ${student.lastName}`,
		class: sec.name,
	};
};

export const fetchByPagination = async ({ page = 1, limit = 10, detail, ...rest }: IGet) => {
	const skip = (page - 1) * limit;
	const baseQuery = { ...rest };

	let list = await Fee.find(baseQuery).skip(skip).limit(limit).lean();
	if (!list.length) return { list: [], count: 0, page, pages: 0 };

	if (detail) {
		const isFromSchool = !!rest.schoolId && !rest.classId && !rest.studentId;
		const isFromClass = !!rest.classId && !rest.studentId;

		if (isFromSchool) {
			const classIds = [...new Set(list.map((x) => x.classId))];
			const studentIds = [...new Set(list.map((x) => x.studentId))];

			const [students, classes] = await Promise.all([
				Student.find({ id: { $in: studentIds } }).select("id firstName lastName").lean(),
				Class.find({ id: { $in: classIds } }).select("id name section").lean(),
			]);

			const mapStudent = new Map(students.map((s) => [s.id, `${s.firstName} ${s.lastName}`]));
			const mapClass = new Map(classes.map((c) => [c.id, { name: c.name, section: c.section }]));

			list = list.map((f) => ({
				...f,
				student: mapStudent.get(f.studentId) || "",
				class: mapClass.get(f.classId)?.name || "",
				section: mapClass.get(f.classId)?.section || "",
			}));
		}

		if (isFromClass) {
			const [school, students] = await Promise.all([
				School.findOne({ id: rest.schoolId }).select("id name").lean(),
				Student.find({ id: { $in: list.map((x) => x.studentId) } }).select("id firstName lastName").lean(),
			]);

			const studentMap = new Map(students.map((s) => [s.id, `${s.firstName} ${s.lastName}`]));

			list = list.map((f) => ({
				...f,
				school: school?.name || "",
				student: studentMap.get(f.studentId) || "",
			}));
		}

		if (detail === 'ALL') {
			const schoolIds = [...new Set(list.map((x) => x.schoolId))];
			const classIds = [...new Set(list.map((x) => x.classId))];
			const studentIds = [...new Set(list.map((x) => x.studentId))];

			const [students, classes, schools] = await Promise.all([
				Student.find({ id: { $in: studentIds } }).select("id firstName lastName").lean(),
				Class.find({ id: { $in: classIds } }).select("id name section").lean(),
				School.find({ id: { $in: schoolIds } }).select("id name").lean(),
			]);

			const mapSchool = new Map(schools.map((s) => [s.id, s.name]));
			const mapStudent = new Map(students.map((s) => [s.id, `${s.firstName} ${s.lastName}`]));
			const mapClass = new Map(classes.map((c) => [c.id, { name: c.name, section: c.section }]));

			list = list.map((f) => ({
				...f,
				student: mapStudent.get(f.studentId) || "",
				class: mapClass.get(f.classId)?.name || "",
				section: mapClass.get(f.classId)?.section || "",
				school: mapSchool.get(f.schoolId) || "",
			}));
		}
	}

	const count = page === 1 ? await Fee.countDocuments(baseQuery) : 0;
	const pages = page === 1 ? Math.ceil(count / limit) : undefined;

	return { list, count, page, pages };
};


export const update = async (id: string, payload: IFee) => Fee.findOneAndUpdate({ id }, { ...payload, updatedAt: Date.now() }, { new: true });

export const remove = async (id: string) => Fee.findOneAndDelete({ id });

export const removeVirtual = async (id: string) => Fee.findOneAndUpdate({ id }, { isDelete: true, isActive: false, updatedAt: Date.now() }, { new: true });
