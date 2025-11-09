import { Request, Response } from "express";
import * as StudentService from "../services/student.service";
import i18n from "../i18n/en";
import { parseMsg } from "../utils/helper";
const MODULE = "student";

export const createStudent = async (req: Request, res: Response) => {
	try {
		const student = await StudentService.createStudent(req.body);
		res.status(201).json({ message: parseMsg(i18n.PASS_POST, MODULE), data: student });
	} catch (error: any) {
		res.status(500).json({ error: parseMsg(i18n.FAIL_POST, MODULE), details: error.message });
	}
};

export const getStudents = async (req: Request, res: Response) => {
	if (req?.query?.search) {
		const students = await StudentService.searchStudents(String(req?.query?.search || ''));
		res.json({ data: students });
	} else {
		const list = await StudentService.getStudents({
			page: Number(req?.query?.page || 0),
			limit: Number(req?.query?.limit || 0),
			id: String(req?.query?.id || ""),
			schoolId: String(req?.query?.school || ""),
			classId: String(req?.query?.class || ""),
		});
		res.json({ data: list });
	}
};

export const getStudent = async (req: Request, res: Response) => {
	const student = await StudentService.getStudentById(req.params.id);
	student ? res.json({ data: student }) : res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
};

export const updateStudent = async (req: Request, res: Response) => {
	const student = await StudentService.updateStudent(req.params.id, req.body);
	student ? res.json({ message: parseMsg(i18n.PASS_UPDATE, MODULE), data: student }) : res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
};

export const deleteStudent = async (req: Request, res: Response) => {
	const student = await StudentService.deleteStudent(req.params.id);
	student ? res.json({ message: parseMsg(i18n.PASS_REMOVE, MODULE) }) : res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
};

// 📊 Student detail with class + school + fees
export const getStudentDetail = async (req: Request, res: Response) => {
	const detail = await StudentService.getStudentDetail(req.params.id);
	detail ? res.json({ data: detail }) : res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
};
