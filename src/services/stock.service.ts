import { IAdd, IEdit } from "interfaces/stock";
import Stock from "../models/stock.modal";
import { PROJECT_STOCK_BRIEF, PROJECT_STOCK_LITE } from "projection/stock";

export const addItem = async (data: IAdd) => {
    const customer = new Stock(data);
    return await customer.save();
};

export const getItems = async (isLite: boolean) => {
    const project = isLite ? PROJECT_STOCK_LITE : PROJECT_STOCK_BRIEF;
    return {
        list: await Stock.find({}, project).lean(),
        count: await Stock.countDocuments()
    };
};

export const overview = async () => {
    return {
        list: await Stock.find({}, PROJECT_STOCK_LITE).limit(5).lean(),
    };
};

export const getItemById = async (id: string, isLite?: Boolean) => {
    const project = isLite ? PROJECT_STOCK_LITE : PROJECT_STOCK_BRIEF;
    return await Stock.findOne({ id }, project).lean();
};

export const updateQty = async (id: string, qty: number) => {
    return await Stock.findOneAndUpdate({ id }, { available: qty, updatedAt: Date.now() }, { new: true });
};

export const updateItem = async (id: string, data: IEdit) => {
    return await Stock.findOneAndUpdate({ id }, { ...data, updatedAt: Date.now() }, { new: true });
};

export const deleteItem = async (id: string) => {
    return await Stock.findOneAndDelete({ id });
};
