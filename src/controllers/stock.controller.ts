import { Request, Response } from "express";
import * as StockService from "../services/stock.service";
import i18n from "../i18n/en";
import { parseMsg } from "utils/helper";
const MODULE = 'stock item';

export const addStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await StockService.addItem(req.body);
        res.status(201).json({ message: parseMsg(i18n.PASS_POST, MODULE), data: current });
    } catch (error) {
        res.status(500).json({
            error: parseMsg(i18n.FAIL_POST, MODULE),
            details: (error as Error).message,
        });
    }
};

export const getStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const isLite = Boolean(req?.headers?.lite || "")
        const current = await StockService.getItems(isLite);
        res.json({ data: current });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_FETCH, MODULE), details: (error as Error).message });
    }
};

export const getStockDetails = async (req: Request, res: Response) => {
    try {
        const current = await StockService.getStockDetails(req.params.id);
        current
            ? res.json({ data: current })
            : res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, "stock item") });
    } catch (err) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_FETCH, "stock items"), details: err });
    }
};


export const getStockItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const isLite = Boolean(req?.headers?.lite || "")
        const current = await StockService.getItemById(req.params.id, isLite);
        if (!current) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json({ data: current });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_FETCH, MODULE), details: (error as Error).message });
    }
};

export const setInventory = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await StockService.updateQty(req.params.id, Number(req?.headers?.qty || -1));
        if (!current) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json({ message: parseMsg(i18n.PASS_UPDATE, MODULE), data: current });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_UPDATE, MODULE), details: (error as Error).message });
    }
};

export const updateStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await StockService.updateItem(req.params.id, req.body);
        if (!current) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json({ message: parseMsg(i18n.PASS_UPDATE, MODULE), data: current });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_UPDATE, MODULE), details: (error as Error).message });
    }
};

export const deleteStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await StockService.deleteItem(req.params.id);
        if (!current) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json({ message: parseMsg(i18n.PASS_REMOVE, MODULE) });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_DELETE, MODULE), details: (error as Error).message });
    }
};
