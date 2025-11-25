import { IAdd, IEdit, IGet } from "interfaces/customer";
import Customer from "../models/customer.modal";
import Payment from "../models/payment.modal";
import Acc from "../models/account.modal";
import { PROJECT_CUSTOMER_BRIEF, PROJECT_CUSTOMER_LITE } from "projection/customer";

export const addCustomer = async (data: IAdd) => {
    const customer = new Customer(data);
    return await customer.save();
};

export const getAllCustomers = async (isLite: boolean) => {
    const project = isLite ? PROJECT_CUSTOMER_LITE : PROJECT_CUSTOMER_BRIEF;
    return {
        list: await Customer.find({}, project).lean()
    };
};

export const getCustomers = async ({ page = 0, limit = 0, isLite }: IGet) => {
    const project = isLite ? PROJECT_CUSTOMER_LITE : PROJECT_CUSTOMER_BRIEF;
    const currentPage = Math.max(1, page || 1);
    const currentLimit = Math.max(1, limit || 10);
    const skip = (currentPage - 1) * currentLimit;
    const count = await Customer.countDocuments();

    if (!page && !limit) {
        const totalPages = Math.ceil(count / currentLimit);
        const data = await Customer.find({}, project).skip(skip).limit(currentLimit).lean();
        return {
            list: data,
            count,
            page: currentPage,
            pages: totalPages,
        };
    }

    const data = await Customer.find({}, project).skip(skip).limit(currentLimit).lean();
    return {
        list: data,
        count,
        page: currentPage,
    };

};

export const getCustomerById = async (id: string, isLite?: Boolean) => {
    const project = isLite ? PROJECT_CUSTOMER_LITE : PROJECT_CUSTOMER_BRIEF;
    return await Customer.findOne({ id }, project);
};

export const getCustomerStatement = async (client: string) => {
    const customer = await Customer.findOne({ id: client }).lean();
    if (!customer) return null;

    // 1) fetch all transactions (purchases)
    const purchases = await Acc.find({ client: client, isDelete: false })
        .select("id gst items millie")
        .lean();

    // 2) fetch all payments
    const payments = await Payment.find({ client })
        .select("amount mode millie remark")
        .lean();

    // compute PURCHASE totals
    let totalPurchase = 0;
    let totalGst = 0;

    const purchaseStatements = purchases.map((t) => {
        const gross = t.items.reduce((sum, it) => sum + it.qty * it.rate, 0);
        const gstAmount = (gross * t.gst) / 100;
        const total = gross + gstAmount;

        totalPurchase += total;
        totalGst += gstAmount;

        return {
            type: "PURCHASE",
            millie: t.millie,
            gross,
            gst: gstAmount,
            total
        };
    });

    // compute PAYMENT total
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    const paymentStatements = payments.map((p) => ({
        type: "PAYMENT",
        millie: p.millie,
        amount: p.amount,
        mode: p.mode,
        remark: p.remark || ""
    }));

    // merge + sort
    const statement = [...purchaseStatements, ...paymentStatements].sort(
        (a, b) => a.millie - b.millie
    );

    return {
        client,
        customerName: customer.name,
        prevPending: customer.prev,
        totalPurchase,
        totalGst,
        totalPaid,
        statement
    };
};

export const updateCustomer = async (id: string, data: IEdit) => {
    return await Customer.findOneAndUpdate({ id }, { ...data, updatedAt: Date.now() }, { new: true });
};

export const updateCustomerPayment = async (client: string, amount: number) => {
    const customer = await Customer.findOne({ id: client });
    if (!customer) return null;

    customer.prev = Math.max(0, (customer.prev || 0) - amount);
    customer.updatedAt = Date.now();

    return await customer.save();
};

export const deleteCustomer = async (id: string) => {
    return await Customer.findOneAndDelete({ id });
};
