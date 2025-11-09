import { Request, Response } from "express";
import * as ClassService from "../services/class.service";
import i18n from "../i18n/en";
import { parseMsg } from "utils/helper";
const MODULE = "class";

export const createClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const cls = await ClassService.createClass(req.body);
        res.status(201).json({ message: parseMsg(i18n.PASS_POST, MODULE), data: cls });
    } catch (error) {
        res.status(500).json({
            error: parseMsg(i18n.FAIL_POST, MODULE),
            details: (error as Error).message,
        });
    }
};

export const getClasses = async (_req: Request, res: Response): Promise<void> => {
    try {
        const classes = await ClassService.getAllClasses();
        res.json({ data: classes });
    } catch (error) {
        res.status(500).json({
            error: parseMsg(i18n.FAIL_FETCH, MODULE),
            details: (error as Error).message,
        });
    }
};

export const getClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const cls = await ClassService.getClassById(req.params.id);
        if (!cls) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json({ data: cls });
    } catch (error) {
        res.status(500).json({
            error: parseMsg(i18n.FAIL_FETCH, MODULE),
            details: (error as Error).message,
        });
    }
};

export const updateClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const cls = await ClassService.updateClass(req.params.id, req.body);
        if (!cls) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json({ message: parseMsg(i18n.PASS_UPDATE, MODULE), data: cls });
    } catch (error) {
        res.status(500).json({
            error: parseMsg(i18n.FAIL_UPDATE, MODULE),
            details: (error as Error).message,
        });
    }
};

export const deleteClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const cls = await ClassService.deleteClass(req.params.id);
        if (!cls) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json({ message: parseMsg(i18n.PASS_REMOVE, MODULE) });
    } catch (error) {
        res.status(500).json({
            error: parseMsg(i18n.FAIL_DELETE, MODULE),
            details: (error as Error).message,
        });
    }
};
