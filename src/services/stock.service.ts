import { IAdd, IEdit } from "interfaces/stock";
import Stock from "../models/stock.modal";
import Transaction from "../models/account.modal";
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

export const getStockDetails = async (id: string) => {
    // Get stock basic info
    const stock = await Stock.findOne({ id }).lean();
    if (!stock) return null;

    const initialInventory = stock.available;
    let sold = 0;
    const statement: Array<any> = [];

    // Fetch all transactions where this item was involved
    const transactions = await Transaction.aggregate([
        { $match: { "items.id": id, isDelete: false } },
        {
            $lookup: {
                from: "customers",
                localField: "client",
                foreignField: "id",
                as: "customer",
                pipeline: [{ $project: { id: 1, name: 1, company: 1 } }]
            }
        },
        { $unwind: "$customer" },
        {
            $project: {
                customer: "$customer.name",
                items: 1,
                millie: 1,
                gst: 1
            }
        }
    ]);

    for (const tx of transactions) {
        const itm = tx.items.find((i: any) => i.id === id);
        if (!itm) continue;

        const gross = itm.qty * itm.rate;
        const gstAmount = (gross * tx.gst) / 100;
        const total = gross + gstAmount;

        sold += itm.qty;

        statement.push({
            millie: tx.millie,
            customer: tx.customer,
            qty: itm.qty,
            rate: itm.rate,
            gross,
            gst: gstAmount,
            total
        });
    }

    const remaining = stock.available - sold;
    statement.sort((a, b) => a.millie - b.millie);

    return {
        id: stock.id,
        name: stock.name,
        scale: stock.scale,
        type: stock.type,
        cost: stock.cost,
        initialInventory: stock.available,
        sold,
        available: remaining,
        statement
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
