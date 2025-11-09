import Fee from "../models/fee.modal";
import Class from "../models/class.modal";
import Student from "../models/student.modal";
import { v4 as uuidv4 } from "uuid";

export const createFeeRecord = async (data: any) => {
	const existing = await Fee.findOne({
		studentId: data.studentId,
		academicYear: data.academicYear,
	});
	if (existing)
		throw new Error("Fee record already exists for this academic year.");

	const initialPaid = data.paidAmount || 0;
	const pendingAmount = data.totalAmount - initialPaid;

	// ✅ Include initial payment in the payments history
	const initialPayments =
		initialPaid > 0
			? [
				{
					id: uuidv4(),
					amount: initialPaid,
					date: Date.now(),
					mode: data.mode || "CASH",
					note: data.remarks || "Initial payment at record creation",
				},
			]
			: [];

	const record = new Fee({
		...data,
		paidAmount: initialPaid,
		pendingAmount,
		payments: initialPayments,
	});

	return await record.save();
};

export const addPayment = async (
	studentId: string,
	academicYear: string,
	payment: any
) => {
	const fee = await Fee.findOne({ studentId, academicYear });
	if (!fee) throw new Error("Fee record not found.");

	fee.paidAmount += payment.amount;
	fee.pendingAmount = Math.max(fee.totalAmount - fee.paidAmount, 0);

	// ✅ Record this payment in history
	fee.payments.push({
		id: uuidv4(),
		amount: payment.amount,
		date: Date.now(),
		mode: payment.mode || "CASH",
		note: payment.note || "",
	});

	fee.updatedAt = Date.now();
	return await fee.save();
};

export const getFeeSummary = async (studentId: string, academicYear: string) => {
	const fee = await Fee.findOne({ studentId, academicYear });
	if (fee) {
		return {
			studentId: fee.studentId,
			academicYear: fee.academicYear,
			total: fee.totalAmount,
			paid: fee.paidAmount,
			pending: fee.pendingAmount,
			payments: fee.payments,
			isNewRecord: false
		};
	}

	const student = await Student.findOne({ id: studentId });
	if (student) {
		const studentClass = await Class.findOne({ id: student.classId });
		return {
			studentId,
			academicYear,
			total: studentClass?.fee || 0,
			paid: 0,
			pending: studentClass?.fee || 0,
			payments: [],
			isNewRecord: true
		};
	}

	throw new Error("No fee record found for student.");
};

export const resetFeesForNewYear = async ({ prev, next }: { prev: string; next: string; }) => {
	const fees = await Fee.find({ academicYear: prev });

	for (const record of fees) {
		await Fee.create({
			studentId: record.studentId,
			classId: record.classId,
			schoolId: record.schoolId,
			academicYear: next,
			totalAmount: record.totalAmount,
			paidAmount: 0,
			pendingAmount: record.totalAmount,
			payments: [],
			isActiveYear: true,
		});
	}

	await Fee.updateMany({ academicYear: prev }, { isActiveYear: false });
};

export const get = async () => {
	const current = await Fee.find({});
	return {
		list: current
	};
};
