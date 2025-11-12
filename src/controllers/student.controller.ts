import { Request, Response } from "express";
import * as StudentService from "../services/student.service";
import i18n from "../i18n/en";
import { parseMsg } from "../utils/helper";
const MODULE = "student";

export const create = async (req: Request, res: Response) => {
	try {
		const student = await StudentService.add(req.body);
		res.status(201).json({ message: parseMsg(i18n.PASS_POST, MODULE), data: student });
	} catch (error: any) {
		res.status(500).json({
			error: parseMsg(i18n.FAIL_POST, MODULE),
			details: (error as Error).message,
		});
	}
};

export const fetch = async (req: Request, res: Response) => {
	try {
		if (req?.query?.search) {
			const students = await StudentService.search(String(req?.query?.search || ''));
			res.json({ data: students });
		} else {
			const list = await StudentService.get({
				page: Number(req?.query?.page || 0),
				limit: Number(req?.query?.limit || 0),
				id: String(req?.query?.id || ""),
				schoolId: String(req?.query?.school || ""),
				classId: String(req?.query?.class || ""),
			});
			res.json({ data: list });
		}
	} catch (error: any) {
		res.status(500).json({
			error: parseMsg(i18n.FAIL_FETCH, MODULE),
			details: (error as Error).message,
		});
	}
};

export const fetchDetail = async (req: Request, res: Response) => {
	try {
		const activeYear = String(req?.headers?.year || '');
		const student = await StudentService.getDetail(req.params.id, activeYear);
		student ? res.json({ data: student }) : res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
	} catch (error: any) {
		res.status(500).json({
			error: parseMsg(i18n.FAIL_FETCH, MODULE),
			details: (error as Error).message,
		});
	}
};

export const update = async (req: Request, res: Response) => {
	try {
		const student = await StudentService.set(req.params.id, req.body);
		student ? res.json({ message: parseMsg(i18n.PASS_UPDATE, MODULE), data: student }) : res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
	} catch (error: any) {
		res.status(500).json({
			error: parseMsg(i18n.FAIL_UPDATE, MODULE),
			details: (error as Error).message,
		});
	}
};

export const omit = async (req: Request, res: Response) => {
	try {
		if (req?.headers?.action === "HARD") await StudentService.remove(req.params.id);
		await StudentService.removeCloud(req.params.id);
		res.status(201).json({ message: parseMsg(i18n.PASS_REMOVE, MODULE) });
	} catch (error: any) {
		res.status(500).json({
			error: parseMsg(i18n.FAIL_DELETE, MODULE),
			details: (error as Error).message,
		});
	}
};
