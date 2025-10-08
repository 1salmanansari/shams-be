import { Document, Model } from "mongoose";

export interface ITransactionMatch {
    isDelete?: boolean;
    id?: string;
}

export interface ITransactionItem {
    id: string;
    qty: number;
    rate: number;
};

export interface ITransaction extends Document, ITransactionMethods {
    id: string;
    client: string;
    items: ITransactionItem[];
    gst: number;
    mode: string;
    millie: number;
    remark: string;
    isDelete: boolean;
    createdAt: number;
    updatedAt: number;
    // Virtuals
    totalAmount?: number;
    itemsTotal?: number;
};

export interface IAdd {
    client: string;
    items: ITransactionItem[];
    gst: number;
    mode: string;
    millie: number;
    remark: string;
};

export interface IEdit extends IAdd {
    id?: string;
};

export interface ITransactionMethods {
    softDelete(): Promise<ITransaction>;
}

export interface ITransactionModel extends Model<ITransaction, {}, ITransactionMethods> {
    findActive(): Promise<ITransaction[]>;
    findByClient(clientId: string): Promise<ITransaction[]>;
};
