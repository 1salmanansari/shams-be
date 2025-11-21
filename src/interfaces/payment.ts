export interface IPaymentAdd {
    customerId: string;
    amount: number;
    mode: string;
    remark?: string;
    date: number;
}

export interface IPaymentEdit extends IPaymentAdd {
    id?: string;
}
