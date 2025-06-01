import { Request, Response } from "express";
import * as SchoolService from "@/services/school.service";
import { io } from "@/server";

export const createSchool = async (req: Request, res: Response) => {
    try {
        const school = await SchoolService.createSchool(req.body);
        io.emit("school:created", school);
        res.status(201).json({ message: "School created", school });
    } catch (error) {
        res.status(500).json({ error: "Failed to create school", details: error });
    }
};

export const getSchools = async (_req: Request, res: Response) => {
    const schools = await SchoolService.getAllSchools();
    res.json(schools);
};

export const getSchool = async (req: Request, res: Response) => {
    const school = await SchoolService.getSchoolById(req.params.id);
    school ? res.json(school) : res.status(404).json({ error: "School not found" });
};

export const updateSchool = async (req: Request, res: Response) => {
    const school = await SchoolService.updateSchool(req.params.id, req.body);
    school ? res.json(school) : res.status(404).json({ error: "School not found" });
};

export const deleteSchool = async (req: Request, res: Response) => {
    const school = await SchoolService.deleteSchool(req.params.id);
    school ? res.json({ message: "School deleted" }) : res.status(404).json({ error: "School not found" });
};
