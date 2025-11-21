import { Request, Response } from "express";
import * as CustomerService from "../services/customer.service";
import { io } from "../server";
import i18n from "../i18n/en";
import { ADD_CUSTOMER } from "socket/events/emit";
import { parseMsg } from "utils/helper";
const MODULE = 'customer';

export const addCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await CustomerService.addCustomer(req.body);
        io.emit(ADD_CUSTOMER, current);
        res.status(201).json({ message: parseMsg(i18n.PASS_POST, MODULE), data: current });
    } catch (error) {
        res.status(500).json({
            error: parseMsg(i18n.FAIL_POST, MODULE),
            details: (error as Error).message,
        });
    }
};

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
    try {
        const isLite = Boolean(req?.headers?.lite || "")
        const isAll = Boolean(req?.headers?.all || "");
        const page = Number(req?.params?.page || 0);
        const limit = Number(req?.params?.limit || 0);

        if (isAll) {
            const current = await CustomerService.getAllCustomers(isLite);
            res.json({ data: current });
        } else {
            const current = await CustomerService.getCustomers({ page, limit, isLite });
            res.json({ data: current });
        }
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_FETCH, MODULE), details: (error as Error).message });
    }
};

export const getCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const isLite = Boolean(req?.headers?.lite || "")
        const current = await CustomerService.getCustomerById(req.params.id, isLite);
        if (!current) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json({ data: current });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_FETCH, MODULE), details: (error as Error).message });
    }
};

export const getCustomerStatement = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const data = await CustomerService.getCustomerStatement(id);

        if (!data) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, "customer") });
            return;
        }

        res.json({ data });
    } catch (error) {
        res.status(500).json({
            error: parseMsg(i18n.FAIL_FETCH, "customer"),
            details: (error as Error).message,
        });
    }
};

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await CustomerService.updateCustomer(req.params.id, req.body);
        if (!current) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json({ message: parseMsg(i18n.PASS_UPDATE, MODULE), data: current });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_UPDATE, MODULE), details: (error as Error).message });
    }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await CustomerService.deleteCustomer(req.params.id);
        if (!current) {
            res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
            return;
        }
        res.json({ message: parseMsg(i18n.PASS_REMOVE, MODULE) });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_DELETE, MODULE), details: (error as Error).message });
    }
};
