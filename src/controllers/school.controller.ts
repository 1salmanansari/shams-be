import { Request, Response } from "express";
import * as SchoolService from "../services/school.service";
import { io } from "../server";
import i18n from "../i18n/en";
import { ADD_SCHOOL } from "socket/events/emit";

export const createSchool = async (req: Request, res: Response): Promise<void> => {
    try {
        const school = await SchoolService.createSchool(req.body);
        io.emit(ADD_SCHOOL, school);
        res.status(201).json({ message: i18n.PASS_SCHOOL_POST, school });
    } catch (error) {
        res.status(500).json({
            error: i18n.FAIL_SCHOOL_POST,
            details: (error as Error).message,
        });
    }
};

export const getSchools = async (_req: Request, res: Response): Promise<void> => {
    try {
        const schools = await SchoolService.getAllSchools();
        res.json(schools);
    } catch (error) {
        res.status(500).json({ error: i18n.FAIL_SCHOOL_FETCH, details: (error as Error).message });
    }
};

export const getSchool = async (req: Request, res: Response): Promise<void> => {
    try {
        const school = await SchoolService.getSchoolById(req.params.id);
        if (!school) {
            res.status(404).json({ error: i18n.FAIL_SCHOOL_EMPTY });
            return;
        }
        res.json(school);
    } catch (error) {
        res.status(500).json({ error: i18n.FAIL_SCHOOL_FETCH, details: (error as Error).message });
    }
};

export const updateSchool = async (req: Request, res: Response): Promise<void> => {
    try {
        const school = await SchoolService.updateSchool(req.params.id, req.body);
        if (!school) {
            res.status(404).json({ error: i18n.FAIL_SCHOOL_EMPTY });
            return;
        }
        res.json({ message: i18n.PASS_SCHOOL_UPDATE, school });
    } catch (error) {
        res.status(500).json({ error: i18n.FAIL_SCHOOL_UPDATE, details: (error as Error).message });
    }
};

export const deleteSchool = async (req: Request, res: Response): Promise<void> => {
    try {
        const school = await SchoolService.deleteSchool(req.params.id);
        if (!school) {
            res.status(404).json({ error: i18n.FAIL_SCHOOL_EMPTY });
            return;
        }
        res.json({ message: i18n.PASS_SCHOOL_REMOVE });
    } catch (error) {
        res.status(500).json({ error: i18n.FAIL_SCHOOL_DELETE, details: (error as Error).message });
    }
};
