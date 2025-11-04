import { Request, Response } from "express";
import * as SchoolService from "../services/school.service";
import { io } from "../server";
import i18n from "../i18n/en";
import { ADD_SCHOOL } from "socket/events/emit";
import { parseMsg } from "utils/helper";
const MODULE = 'school';

export const createSchool = async (req: Request, res: Response): Promise<void> => {
    try {
        const school = await SchoolService.createSchool(req.body);
        io.emit(ADD_SCHOOL, school);
        res.status(201).json({ message: parseMsg(i18n.PASS_POST, MODULE), data: school });
    } catch (error) {
        res.status(500).json({
            error: parseMsg(i18n.FAIL_POST, MODULE),
            details: (error as Error).message,
        });
    }
};

export const getSchools = async (_req: Request, res: Response): Promise<void> => {
    try {
        const schools = await SchoolService.getAllSchools();
        res.json(schools);
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_FETCH, MODULE), details: (error as Error).message });
    }
};

export const getSchool = async (req: Request, res: Response): Promise<void> => {
    try {
        const school = await SchoolService.getSchoolById(req.params.id);
        if (!school) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json({ data: school });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_FETCH, MODULE), details: (error as Error).message });
    }
};

export const updateSchool = async (req: Request, res: Response): Promise<void> => {
    try {
        const school = await SchoolService.updateSchool(req.params.id, req.body);
        if (!school) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json({ message: parseMsg(i18n.PASS_UPDATE, MODULE), data: school });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_UPDATE, MODULE), details: (error as Error).message });
    }
};

export const deleteSchool = async (req: Request, res: Response): Promise<void> => {
    try {
        const school = await SchoolService.deleteSchool(req.params.id);
        if (!school) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json({ message: parseMsg(i18n.PASS_REMOVE, MODULE) });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_DELETE, MODULE), details: (error as Error).message });
    }
};
