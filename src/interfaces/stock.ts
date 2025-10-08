export interface IAdd {
    name: string;
    type: string;
    scale: string;
    cost: number;
    available: string;
};

export interface IEdit {
    name?: string;
    type?: string;
    scale?: string;
    cost?: number;
    available?: string;
    isActive?: string;
    isDelete?: boolean;
};
