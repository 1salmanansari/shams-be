export interface IAdd {
    name: string;
    type: string;
    scale: string;
    available: string;
};

export interface IEdit {
    name?: string;
    type?: string;
    scale?: string;
    available?: string;
    isActive?: string;
    isDelete?: boolean;
};
