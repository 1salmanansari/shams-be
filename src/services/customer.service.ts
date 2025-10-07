import { IAdd, IEdit, IGet } from "interfaces/customer";
import Customer from "../models/customer.modal";
import { PROJECT_CUSTOMER_BRIEF, PROJECT_CUSTOMER_LITE } from "projection/customer";

export const addCustomer = async (data: IAdd) => {
    const customer = new Customer(data);
    return await customer.save();
};

export const getAllCustomers = async (isLite: boolean) => {
    const project = isLite ? PROJECT_CUSTOMER_LITE : PROJECT_CUSTOMER_BRIEF;
    return {
        list: await Customer.find().projection(project).lean(),
    };
};

export const getCustomers = async ({ page = 0, limit = 0, isLite }: IGet) => {
    const project = isLite ? PROJECT_CUSTOMER_LITE : PROJECT_CUSTOMER_BRIEF;
    const currentPage = Math.max(1, page || 1);
    const currentLimit = Math.max(1, limit || 10);
    const skip = (currentPage - 1) * currentLimit;

    if (!page && !limit) {
        const count = await Customer.countDocuments();
        const totalPages = Math.ceil(count / currentLimit);
        const data = await Customer.find().skip(skip).limit(currentLimit).projection(project).lean();
        return {
            list: data,
            page: currentPage,
            pages: totalPages,
        };
    }

    const data = await Customer.find().skip(skip).limit(currentLimit).projection(project).lean();
    return {
        list: data,
        page: currentPage,
    };

};

export const getCustomerById = async (id: string, isLite?: Boolean) => {
    const project = isLite ? PROJECT_CUSTOMER_LITE : PROJECT_CUSTOMER_BRIEF;
    return await Customer.findOne({ id }).projection(project);
};

export const updateCustomer = async (id: string, data: IEdit) => {
    return await Customer.findOneAndUpdate({ id }, { ...data, updatedAt: Date.now() }, { new: true });
};

export const deleteCustomer = async (id: string) => {
    return await Customer.findOneAndDelete({ id });
};
