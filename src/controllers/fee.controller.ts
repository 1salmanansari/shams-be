import { Request, Response } from "express";
import * as FeeService from "../services/fee.service";
import i18n from "../i18n/en";
import { parseMsg } from "../utils/helper";
import { IGet } from "types/common";

const MODULE = "fee";

export const add = async (req: Request, res: Response) => {
	try {
		const data = await FeeService.create(req.body);
		res.status(201).json({ message: parseMsg(i18n.PASS_POST, MODULE), data });
	} catch (error) {
		res.status(500).json({
			error: parseMsg(i18n.FAIL_POST, MODULE),
			details: (error as Error).message,
		});
	}
};

export const get = async (req: Request, res: Response) => {
	try {
		const payload: IGet = {};

		if (req?.query?.year) payload.academicYear = String(req.query.year); // year => ACADEMIC YEAR eg: 2025-2026
		if (req?.query?.id) payload.studentId = String(req.query.id); // id => STUDENT ID
		if (req?.query?.class) payload.classId = String(req.query.class); // id => CLASS ID
		if (req?.query?.school) payload.schoolId = String(req.query.school); // id => SCHOOL ID
		if (req?.query?.page) payload.page = Number(req.query.page);
		if (req?.query?.limit) payload.limit = Number(req.query.limit);
		if (req?.query?.detail) payload.detail = String(req.query.detail); // eg: ALL

		let data;
		if (payload?.page) {
			data = await FeeService.fetchByPagination({ ...payload });
		} else {
			data = await FeeService.fetch({ ...payload });
			data = { list: data }; // normalize response shape
		}

		res.status(200).json({ data });
	} catch (error) {
		res.status(500).json({
			error: parseMsg(i18n.FAIL_FETCH, MODULE),
			details: (error as Error).message,
		});
	}
};

export const getDetail = async (req: Request, res: Response) => {
	try {
		const data = await FeeService.fetchById(req.params.id);
		res.status(201).json({ data });
	} catch (error) {
		res.status(500).json({
			error: parseMsg(i18n.FAIL_FETCH, MODULE),
			details: (error as Error).message,
		});
	}
};

export const set = async (req: Request, res: Response) => {
	try {
		const data = await FeeService.update(req.params.id, req.body);
		res.status(201).json({ message: parseMsg(i18n.PASS_UPDATE, MODULE), data });
	} catch (error) {
		res.status(500).json({
			error: parseMsg(i18n.FAIL_UPDATE, MODULE),
			details: (error as Error).message,
		});
	}
};

export const remove = async (req: Request, res: Response) => {
	try {
		if (req?.headers?.action === "HARD") await FeeService.remove(req.params.id);
		await FeeService.removeVirtual(req.params.id);
		res.status(201).json({ message: parseMsg(i18n.PASS_REMOVE, MODULE) });
	} catch (error) {
		res.status(500).json({
			error: parseMsg(i18n.FAIL_DELETE, MODULE),
			details: (error as Error).message,
		});
	}
};
