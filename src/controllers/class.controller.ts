import { Request, Response } from "express";
import * as ClassService from "../services/class.service";
import i18n from "../i18n/en";
import { parseMsg } from "utils/helper";
const MODULE = "class";

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const cls = await ClassService.add(req.body);
        res.status(201).json({ message: parseMsg(i18n.PASS_POST, MODULE), data: cls });
    } catch (error) {
        res.status(500).json({
            error: parseMsg(i18n.FAIL_POST, MODULE),
            details: (error as Error).message,
        });
    }
};

export const fetch = async (req: Request, res: Response): Promise<void> => {
    try {
        const classes = await ClassService.get(String(req?.query?.id || ''));
        res.json({ data: classes });
    } catch (error) {
        res.status(500).json({
            error: parseMsg(i18n.FAIL_FETCH, MODULE),
            details: (error as Error).message,
        });
    }
};

export const fetchDetail = async (req: Request, res: Response): Promise<void> => {
    try {
        const activeYear = String(req?.headers?.year || '');
        const cls = await ClassService.getDetail(req.params.id, activeYear);
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

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const cls = await ClassService.set(req.params.id, req.body);
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

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const cls = await ClassService.omit(req.params.id);
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
