import { IAdd, IEdit, ITransactionItem, ITransactionMatch } from "interfaces/account";
import Acc from "../models/account.modal";
import { logData } from "utils/helper";

export const addItem = async (data: IAdd) => {
    const customer = new Acc(data);
    return await customer.save();
};

export const getItem = async (cond: ITransactionMatch) => {
    const transactions = await Acc.aggregate([
        // Stage 1: Filter active transactions
        { $match: { ...cond } },

        // Stage 2: Lookup client details
        {
            $lookup: {
                from: "customers",
                localField: "client",
                foreignField: "id",
                as: "clientDetails",
            },
        },

        // Stage 3: Unwind client details
        {
            $unwind: {
                path: "$clientDetails",
                preserveNullAndEmptyArrays: true,
            },
        },

        // Stage 4: Lookup item details for each item
        {
            $lookup: {
                from: "stocks",
                localField: "items.id",
                foreignField: "id",
                as: "itemDetails",
            },
        },

        // Stage 5: Map items with their details
        {
            $addFields: {
                items: {
                    $map: {
                        input: "$items",
                        as: "txnItem",
                        in: {
                            $mergeObjects: [
                                "$$txnItem",
                                {
                                    name: {
                                        $let: {
                                            vars: {
                                                matchedItem: {
                                                    $arrayElemAt: [
                                                        {
                                                            $filter: {
                                                                input: "$itemDetails",
                                                                as: "item",
                                                                cond: { $eq: ["$$item.id", "$$txnItem.id"] },
                                                            },
                                                        },
                                                        0,
                                                    ],
                                                },
                                            },
                                            in: "$$matchedItem.name",
                                        },
                                    },
                                    itemTotal: { $multiply: ["$$txnItem.qty", "$$txnItem.rate"] },
                                },
                            ],
                        },
                    },
                },
            },
        },

        // Stage 6: Calculate totals
        {
            $addFields: {
                clientName: "$clientDetails.name",
                itemsTotal: {
                    $reduce: {
                        input: "$items",
                        initialValue: 0,
                        in: { $add: ["$$value", { $multiply: ["$$this.qty", "$$this.rate"] }] },
                    },
                },
            },
        },

        // Stage 7: Add total amount with GST
        {
            $addFields: {
                totalAmount: {
                    $add: [
                        "$itemsTotal",
                        { $multiply: ["$itemsTotal", { $divide: ["$gst", 100] }] },
                    ],
                },
            },
        },

        // Stage 8: Remove temporary fields
        {
            $project: {
                clientDetails: 0,
                itemDetails: 0,
                _id: 0,
                __v: 0,
            },
        },

        // Stage 9: Sort
        { $sort: { createdAt: -1 } },
    ]);

    return {
        list: transactions
    }
};

export const getItems = async () => {
    return await getItem({ isDelete: false });
};

export const getItemById = async (id: string) => {
    return await getItem({ id });
};

export const updateItem = async ({ id, ...data }: IEdit) => {
    return await Acc.findOneAndUpdate({ id }, { ...data, updatedAt: Date.now() }, { new: true });
};

export const editItem = async (id: string, items: Array<ITransactionItem>) => {
    return await Acc.findOneAndUpdate({ id }, { items: [...items], updatedAt: Date.now() }, { new: true });
};

export const deleteItem = async (id: string, soft?: boolean) => {
    if (soft) {
        return await Acc.findOneAndUpdate({ id }, { isDelete: true });
    }
    return await Acc.findOneAndDelete({ id });
};
