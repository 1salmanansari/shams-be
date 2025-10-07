import { Request, Response } from "express";
import * as CustomerService from "../services/customer.service";
import { io } from "../server";
import i18n from "../i18n/en";
import { ADD_CUSTOMER } from "socket/events/emit";

export const addCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await CustomerService.addCustomer(req.body);
        io.emit(ADD_CUSTOMER, current);
        res.status(201).json({ message: i18n.PASS_CUSTOMER_POST, current });
    } catch (error) {
        res.status(500).json({
            error: i18n.FAIL_CUSTOMER_POST,
            details: (error as Error).message,
        });
    }
};

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
    try {
        const isLite = Boolean(req?.headers?.lite || "")
        const isAll = Boolean(req?.params?.all || "");
        const page = Number(req?.params?.page || 0);
        const limit = Number(req?.params?.limit || 0);
        if (isAll) {
            const current = await CustomerService.getAllCustomers(isLite);
            res.json(current);
        }
        const current = await CustomerService.getCustomers({ page, limit, isLite });
        res.json(current);
    } catch (error) {
        res.status(500).json({ error: i18n.FAIL_CUSTOMER_FETCH, details: (error as Error).message });
    }
};

export const getCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const isLite = Boolean(req?.headers?.lite || "")
        const current = await CustomerService.getCustomerById(req.params.id, isLite);
        if (!current) {
            res.status(404).json({ error: i18n.FAIL_CUSTOMER_EMPTY });
            return;
        }
        res.json(current);
    } catch (error) {
        res.status(500).json({ error: i18n.FAIL_CUSTOMER_FETCH, details: (error as Error).message });
    }
};

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await CustomerService.updateCustomer(req.params.id, req.body);
        if (!current) {
            res.status(404).json({ error: i18n.FAIL_CUSTOMER_EMPTY });
            return;
        }
        res.json({ message: i18n.PASS_CUSTOMER_UPDATE, current });
    } catch (error) {
        res.status(500).json({ error: i18n.FAIL_CUSTOMER_UPDATE, details: (error as Error).message });
    }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const current = await CustomerService.deleteCustomer(req.params.id);
        if (!current) {
            res.status(404).json({ error: i18n.FAIL_CUSTOMER_EMPTY });
            return;
        }
        res.json({ message: i18n.PASS_CUSTOMER_REMOVE });
    } catch (error) {
        res.status(500).json({ error: i18n.FAIL_CUSTOMER_DELETE, details: (error as Error).message });
    }
};
