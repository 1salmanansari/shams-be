export interface IPaymentAdd {
    client: string;
    amount: number;
    mode: string;
    remark?: string;
    millie: number;
};

export interface IGetPaymentQuery {
    client?: string;
    mode?: string;
}

export interface IPaymentEdit extends IPaymentAdd {
    id?: string;
}
