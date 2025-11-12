import { Request, Response } from "express";
import * as SchoolService from "../services/school.service";
import { io } from "../server";
import i18n from "../i18n/en";
import { ADD_SCHOOL } from "socket/events/emit";
import { parseMsg } from "utils/helper";
const MODULE = 'school';

export const create = async (req: Request, res: Response): Promise<void> => {
	try {
		const school = await SchoolService.add(req.body);
		io.emit(ADD_SCHOOL, school);
		res.status(201).json({ message: parseMsg(i18n.PASS_POST, MODULE), data: school });
	} catch (error) {
		res.status(500).json({
			error: parseMsg(i18n.FAIL_POST, MODULE),
			details: (error as Error).message,
		});
	}
};

export const fetch = async (_req: Request, res: Response): Promise<void> => {
	try {
		const schools = await SchoolService.get();
		res.json({ data: schools });
	} catch (error) {
		res.status(500).json({ error: parseMsg(i18n.FAIL_FETCH, MODULE), details: (error as Error).message });
	}
};

export const fetchDetail = async (req: Request, res: Response): Promise<void> => {
	try {
		const activeYear = String(req?.headers?.year || '');
		const school = await SchoolService.getDetail(req.params.id, activeYear);
		if (!school) {
			res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
			return;
		}
		res.json({ data: school });
	} catch (error) {
		res.status(500).json({ error: parseMsg(i18n.FAIL_FETCH, MODULE), details: (error as Error).message });
	}
};

export const update = async (req: Request, res: Response): Promise<void> => {
	try {
		const school = await SchoolService.set(req.params.id, req.body);
		if (!school) {
			res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
			return;
		}
		res.json({ message: parseMsg(i18n.PASS_UPDATE, MODULE), data: school });
	} catch (error) {
		res.status(500).json({ error: parseMsg(i18n.FAIL_UPDATE, MODULE), details: (error as Error).message });
	}
};

export const remove = async (req: Request, res: Response): Promise<void> => {
	try {
		const school = await SchoolService.omit(req.params.id);
		if (!school) {
			res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
			return;
		}
		res.json({ message: parseMsg(i18n.PASS_REMOVE, MODULE) });
	} catch (error) {
		res.status(500).json({ error: parseMsg(i18n.FAIL_DELETE, MODULE), details: (error as Error).message });
	}
};
