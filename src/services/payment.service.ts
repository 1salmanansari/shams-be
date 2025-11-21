import Payment from "../models/payment.modal";
import { IPaymentAdd, IPaymentEdit } from "interfaces/payment";
import { PROJECT_PAYMENT } from "projection/payment";

export const addPayment = async (data: IPaymentAdd) => {
    return new Payment(data).save();
};

export const getPayments = async (customerId?: string) => {
    const condition = customerId ? { customerId } : {};
    return {
        list: await Payment.find(condition, PROJECT_PAYMENT).sort({ date: -1 }).lean(),
        count: await Payment.countDocuments(condition),
    };
};

export const getPaymentById = async (id: string) => {
    return await Payment.findOne({ id }, PROJECT_PAYMENT).lean();
};

export const updatePayment = async (id: string, data: IPaymentEdit) => {
    const prevRecord = await Payment.findOne({ id });
    if (!prevRecord) return null;

    return await Payment.findOneAndUpdate({ id }, data, { new: true });
};

export const deletePayment = async (id: string) => {
    const record = await Payment.findOneAndDelete({ id });
    if (!record) return null;
    return record;
};
