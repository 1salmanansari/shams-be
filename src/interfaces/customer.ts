export interface IAdd {
    name: string;
    company: string;
    dialCode: string;
    gst: string;
    prev?: number;
    mobile: string;
};

export interface IEdit {
    name?: string;
    company?: string;
    dialCode?: string;
    gst?: string;
    prev?: number;
    mobile?: string;
    isActive?: boolean;
    isDelete?: boolean;
};

export interface IGet {
    page?: number;
    limit?: number;
    isLite?: boolean;
};
