
export enum EPaymentMode {
    CASH = "CASH",
    UPI = "UPI",
    ACCOUNT = "ACCOUNT",
    CHEQUE = "CHEQUE",
};

export interface ISchool {
    id?: string;
    email: string;
    name: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
};

export interface IClass {
    id?: string;
    schoolId: string;
    name: string;
    section: string;
    fee: string;
    ct: string;
};

export interface IStudent {
    id?: string;
    enrollmentNo: string;
    schoolId: string;
    classId: string;
    firstName: string;
    lastName: string;
    gender: string;
    paid?: number;
    mobile: string
    email: string;
    dob?: string;
    address?: string;
};

export interface IFee {
    id?: string;
    studentId: string;
    classId: string;
    schoolId: string;
    academicYear: string;
    amount: number;
    mode: EPaymentMode;
    note?: string;
    inAdvance?: boolean;
};

export interface IGet {
    studentId?: string;
    schoolId?: string;
    classId?: string;
    academicYear?: string;
    page?: number;
    limit?: number;
    detail?: string;
};
