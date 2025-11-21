import { IAdd, IEdit, ITransactionItem, ITransactionMatch } from "interfaces/account";
import Acc from "../models/account.modal";
import { PipelineStage } from "mongoose";

export const addItem = async (data: IAdd) => {
    const customer = new Acc(data);
    return await customer.save();
};

export const getItem = async ({ clients = [], products = [], modes = [], ...rest }: ITransactionMatch, limit?: number) => {

    const orConditions: Array<Record<string, unknown>> = [];
    if (clients?.length) orConditions.push({ client: { $in: clients } });
    if (products?.length) orConditions.push({ "items.id": { $in: products } });
    if (modes?.length) orConditions.push({ mode: { $in: modes } });

    const matchStage = orConditions.length > 0 ? { ...rest, $or: orConditions } : { ...rest };

    const pipeline: PipelineStage[] = [
        { $match: { ...matchStage } },
        {
            $lookup: {
                from: "customers",
                localField: "client",
                foreignField: "id",
                as: "clientDetails",
                pipeline: [
                    { $project: { _id: 0, id: 1, name: 1, company: 1, mobile: 1, gst: 1 } }
                ]
            },
        },
        { $unwind: { path: "$clientDetails", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "stocks",
                localField: "items.id",
                foreignField: "id",
                as: "itemDetails",
                pipeline: [
                    { $project: { _id: 0, id: 1, name: 1, scale: 1, cost: 1 } }
                ]
            },
        },
        {
            $addFields: {
                items: {
                    $map: {
                        input: "$items",
                        as: "txnItem",
                        in: {
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
                                in: {
                                    id: "$$txnItem.id",
                                    qty: "$$txnItem.qty",
                                    rate: "$$txnItem.rate",
                                    name: "$$matchedItem.name",
                                    scale: "$$matchedItem.scale",
                                    cost: "$$matchedItem.cost",
                                    gross: { $multiply: ["$$txnItem.qty", "$$txnItem.rate"] },
                                },
                            },
                        },
                    },
                },
            },
        },
        {
            $addFields: {
                clientName: "$clientDetails.name",
                itemsTotal: {
                    $reduce: {
                        input: "$items",
                        initialValue: 0,
                        in: { $add: ["$$value", "$$this.gross"] },
                    },
                },
            },
        },
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
        {
            $project: {
                _id: 0,
                __v: 0,
                clientDetails: 0,
                itemDetails: 0,
            },
        },
        { $sort: { createdAt: -1 } },
        {
            $facet: {
                list: limit && limit > 0 ? [{ $limit: limit }] : [],
                count: [{ $count: "total" }],
            },
        },
        {
            $project: {
                list: 1,
                total: { $ifNull: [{ $arrayElemAt: ["$count.total", 0] }, 0] },
            },
        },
    ];

    const [result] = await Acc.aggregate(pipeline);
    return { list: result.list, count: result.total };
};

export const overview = async () => {
    return await getItem({ isDelete: false }, 5);
};

export const getItems = async (filters?: {
    clients?: string[];
    products?: string[];
    modes?: string[];
}) => {
    return await getItem({ isDelete: false, ...filters });
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
