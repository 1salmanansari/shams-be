import { Request, Response } from "express";
import * as FeeService from "../services/fee.service";
import i18n from "../i18n/en";
import { parseMsg } from "../utils/helper";

const MODULE = "fee";

export const createFeeRecord = async (req: Request, res: Response) => {
	try {
		const data = await FeeService.createFeeRecord(req.body);
		res.status(201).json({ message: parseMsg(i18n.PASS_POST, MODULE), data });
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
};

export const addPayment = async (req: Request, res: Response) => {
	try {
		const { studentId, academicYear } = req.params;
		const data = await FeeService.addPayment(studentId, academicYear, req.body);
		res.json({ message: "Payment added successfully", data });
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
};

export const getFeeSummary = async (req: Request, res: Response) => {
	try {
		const { studentId, academicYear } = req.params;
		const data = await FeeService.getFeeSummary(studentId, academicYear);
		res.json({ data });
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
};

export const resetFees = async (req: Request, res: Response) => {
	try {
		await FeeService.resetFeesForNewYear(req.body);
		res.json({ message: "Fees reset for new academic year." });
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
};

export const getAll = async (req: Request, res: Response) => {
	try {
		const data = await FeeService.get();
		res.json({ data });
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
};
