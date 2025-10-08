export const toTitleCase = (str: string): string => {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const pluralize = (str: string): string => {
    const lower = str.toLowerCase();

    if (lower.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(lower[lower.length - 2])) {
        return lower.slice(0, -1) + 'ies';
    }
    if (lower.endsWith('s') || lower.endsWith('x') || lower.endsWith('z') ||
        lower.endsWith('ch') || lower.endsWith('sh')) {
        return lower + 'es';
    }
    return lower + 's';
}

export const getCases = (label: string): Array<string> => {
    if (label) {
        return [
            label.toUpperCase(),
            label.toLowerCase(),
            toTitleCase(label),
            pluralize(label).toLowerCase(),
        ];
    };
    return [];
};

export const parseMsg = (msg: string, data: string) => {
    const [UPPER, LOWER, TITLE, PLURAL] = getCases(data);
    return msg
        .replace('<DATA>', UPPER)
        .replace('<data>', LOWER)
        .replace('<Data>', TITLE)
        .replace('<datas>', PLURAL);
};

export const logData = (key: string, data: unknown): void => {
    console.log("========================");
    console.log(`sam log ${key}`, data);
    console.log("========================");
};