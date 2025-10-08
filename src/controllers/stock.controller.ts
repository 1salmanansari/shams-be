import { Request, Response } from "express";
import * as StockService from "../services/stock.service";
import i18n from "../i18n/en";
import { parseMsg } from "utils/helper";

export const addStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await StockService.addItem(req.body);
        res.status(201).json({ message: parseMsg(i18n.PASS_POST, 'stock item'), current });
    } catch (error) {
        res.status(500).json({
            error: parseMsg(i18n.FAIL_POST, 'stock item'),
            details: (error as Error).message,
        });
    }
};

export const getStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const isLite = Boolean(req?.headers?.lite || "")
        const current = await StockService.getItems(isLite);
        res.json(current);
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_FETCH, 'stock item'), details: (error as Error).message });
    }
};

export const getStockItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const isLite = Boolean(req?.headers?.lite || "")
        const current = await StockService.getItemById(req.params.id, isLite);
        if (!current) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, 'stock item') });
            return;
        }
        res.json(current);
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_FETCH, 'stock item'), details: (error as Error).message });
    }
};

export const setInventory = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await StockService.updateQty(req.params.id, Number(req?.params?.qty || -1));
        if (!current) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, 'stock item') });
            return;
        }
        res.json({ message: parseMsg(i18n.PASS_UPDATE, 'stock item'), current });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_UPDATE, 'stock item'), details: (error as Error).message });
    }
};

export const updateStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await StockService.updateItem(req.params.id, req.body);
        if (!current) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, 'stock item') });
            return;
        }
        res.json({ message: parseMsg(i18n.PASS_UPDATE, 'stock item'), current });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_UPDATE, 'stock item'), details: (error as Error).message });
    }
};

export const deleteStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await StockService.deleteItem(req.params.id);
        if (!current) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, 'stock item') });
            return;
        }
        res.json({ message: parseMsg(i18n.PASS_REMOVE, 'stock item') });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_DELETE, 'stock item'), details: (error as Error).message });
    }
};
