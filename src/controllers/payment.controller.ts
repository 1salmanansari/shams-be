import { Request, Response } from "express";
import * as PaymentService from "../services/payment.service";
import i18n from "../i18n/en";
import { parseMsg } from "utils/helper";
const MODULE = "payment";

export const addPayment = async (req: Request, res: Response) => {
    try {
        const current = await PaymentService.addPayment(req.body);
        res.status(201).json({ message: parseMsg(i18n.PASS_POST, MODULE), data: current });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_POST, MODULE), details: error });
    }
};

export const getPayments = async (req: Request, res: Response) => {
    try {
        const customerId = String(req.query.customerId || "");
        const current = await PaymentService.getPayments(customerId);
        res.json({ data: current });
    } catch (error) {
        res.status(500).json({ error: parseMsg(i18n.FAIL_FETCH, MODULE), details: error });
    }
};

export const getPayment = async (req: Request, res: Response) => {
    try {
        const current = await PaymentService.getPaymentById(req.params.id);
        current
            ? res.json({ data: current })
            : res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
    } catch (error) {
        res.status(500).json({ error: i18n.FAIL_FETCH, details: error });
    }
};

export const updatePayment = async (req: Request, res: Response) => {
    try {
        const current = await PaymentService.updatePayment(req.params.id, req.body);
        current
            ? res.json({ message: parseMsg(i18n.PASS_UPDATE, MODULE), data: current })
            : res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
    } catch (error) {
        res.status(500).json({ error: i18n.FAIL_UPDATE, details: error });
    }
};

export const deletePayment = async (req: Request, res: Response) => {
    try {
        const current = await PaymentService.deletePayment(req.params.id);
        current
            ? res.json({ message: parseMsg(i18n.PASS_REMOVE, MODULE) })
            : res.status(404).json({ error: parseMsg(i18n.FAIL_EMPTY, MODULE) });
    } catch (error) {
        res.status(500).json({ error: i18n.FAIL_DELETE, details: error });
    }
};
