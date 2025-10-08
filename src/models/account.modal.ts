import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import i18n from "../i18n/en";
import { ITransaction, ITransactionItem, ITransactionMethods, ITransactionModel } from "interfaces/account";

const transactionItemSchema = new Schema<ITransactionItem>(
    {
        id: {
            type: String,
            required: true,
        },
        qty: {
            type: Number,
            required: true,
            min: 0,
        },
        rate: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
);

const transactionSchema = new Schema<ITransaction, ITransactionModel, ITransactionMethods>(
    {
        id: {
            type: String,
            default: uuidv4,
            unique: true,
            index: true,
        },
        client: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        items: {
            type: [transactionItemSchema],
            required: true,
            validate: {
                validator: function (items: ITransactionItem[]) {
                    return items && items.length > 0;
                },
                message: i18n.FAIL_ACCOUNT_EMPTY,
            },
        },
        gst: {
            type: Number,
            default: 5,
            required: true,
            min: 0,
            max: 100,
        },
        mode: {
            type: String,
            required: true,
            enum: ["CASH", "CARD", "UPI", "NET_BANKING", "CHEQUE", "PENDING"],
            uppercase: true,
        },
        millie: {
            type: Number,
            default: () => Date.now(),
            required: true,
        },
        remark: {
            type: String,
            default: "",
            trim: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
            required: true,
            index: true,
        },
        createdAt: {
            type: Number,
            default: () => Date.now(),
            required: true,
            immutable: true,
        },
        updatedAt: {
            type: Number,
            default: () => Date.now(),
            required: true,
        },
    },
    {
        timestamps: false,
        collection: "transactions",
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ✅ Indexes for better query performance
transactionSchema.index({ client: 1, createdAt: -1 });
transactionSchema.index({ isDelete: 1, createdAt: -1 });
transactionSchema.index({ mode: 1 });

// ✅ Pre-save middleware to update 'updatedAt'
transactionSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// ✅ Pre-update middleware to update 'updatedAt'
transactionSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

// ✅ Virtual for calculating items total
transactionSchema.virtual("itemsTotal").get(function (this: ITransaction) {
    return this.items.reduce((total, item) => {
        return total + item.qty * item.rate;
    }, 0);
});

// ✅ Virtual for calculating total amount with GST
transactionSchema.virtual("totalAmount").get(function (this: ITransaction) {
    const subtotal = this.items.reduce((total, item) => {
        return total + item.qty * item.rate;
    }, 0);
    const gstAmount = (subtotal * this.gst) / 100;
    return subtotal + gstAmount;
});

// ✅ Instance method for soft delete
transactionSchema.methods.softDelete = async function (this: ITransaction) {
    this.isDelete = true;
    this.updatedAt = Date.now();
    return await this.save();
};

// ✅ Static method for finding active transactions
transactionSchema.statics.findActive = function () {
    return this.find({ isDelete: false }).sort({ createdAt: -1 });
};

// ✅ Static method for finding by client
transactionSchema.statics.findByClient = function (clientId: string) {
    return this.find({ client: clientId, isDelete: false }).sort({ createdAt: -1 });
};

// ✅ Export model with proper typing
const Transaction = mongoose.model<ITransaction, ITransactionModel>(
    "Transaction",
    transactionSchema
);

export default Transaction;

// ✅ USAGE EXAMPLES:

/*
// Example 1: Create a new transaction
const newTransaction = new Transaction({
    client: "CLIENT123",
    items: [
        { id: "ITEM1", qty: 2, rate: 100 },
        { id: "ITEM2", qty: 1, rate: 200 },
    ],
    gst: 18,
    mode: "UPI",
    remark: "First order",
});

await newTransaction.save();

// Example 2: Access virtual fields
console.log(newTransaction.itemsTotal);  // 400 (2*100 + 1*200)
console.log(newTransaction.totalAmount); // 472 (400 + 18% GST)

// Example 3: Soft delete
await newTransaction.softDelete();

// Example 4: Find active transactions
const activeTransactions = await Transaction.findActive();

// Example 5: Find by client
const clientTransactions = await Transaction.findByClient("CLIENT123");

// Example 6: Update transaction
await Transaction.findOneAndUpdate(
    { id: "some-id" },
    { 
        $set: { remark: "Updated remark" },
        $push: { items: { id: "ITEM3", qty: 1, rate: 150 } }
    }
);

// Example 7: Get transaction with virtuals
const transaction = await Transaction.findOne({ id: "some-id" }).lean({ virtuals: true });
console.log(transaction?.totalAmount);

// Example 8: Aggregate pipeline example
const summary = await Transaction.aggregate([
    { $match: { isDelete: false } },
    { $unwind: "$items" },
    { $group: {
        _id: "$client",
        totalRevenue: { $sum: { $multiply: ["$items.qty", "$items.rate"] } },
        transactionCount: { $sum: 1 }
    }}
]);
*/