import { Request, Response } from "express";
import * as AccountService from "../services/account.service";
import i18n from "../i18n/en";
import { parseMsg } from "utils/helper";
const MODULE = 'transaction';

export const addTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await AccountService.addItem(req.body);
        res.status(201).json({ message: parseMsg(i18n.PASS_POST, MODULE), data: current });
    } catch (error) {
        res.status(500).json({
            error: parseMsg(i18n.FAIL_POST, MODULE),
            details: (error as Error).message,
        });
    }
};

export const getTransactions = async (_req: Request, res: Response): Promise<void> => {
    try {
        const current = await AccountService.getItems();
        res.json(current);
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_FETCH, MODULE), details: (error as Error).message });
    }
};

export const getTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await AccountService.getItem({ id: req.params.id });
        if (!current) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json(current);
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_FETCH, MODULE), details: (error as Error).message });
    }
};

export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await AccountService.updateItem(req.body);
        if (!current) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json({ message: parseMsg(i18n.PASS_UPDATE, MODULE), data: current });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_UPDATE, MODULE), details: (error as Error).message });
    }
};

export const editTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = String(req?.headers?.id || '');
        const current = await AccountService.editItem(id, req?.body?.items || []);
        if (!current) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json({ message: parseMsg(i18n.PASS_UPDATE, MODULE), data: current });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_UPDATE, MODULE), details: (error as Error).message });
    }
};

export const deleteTransation = async (req: Request, res: Response): Promise<void> => {
    try {
        const isSoft = Boolean(req?.headers?.soft);
        const current = await AccountService.deleteItem(req.params.id, isSoft);
        if (!current) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json({ message: parseMsg(i18n.PASS_REMOVE, MODULE) });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_DELETE, MODULE), details: (error as Error).message });
    }
};
