
export function formatRate(upsRate: number): string {
    if (upsRate < 0)
        throw 'rate cannot be negative';

    let value: number;
    let units: string;
    if (upsRate < 1) {
        value = upsRate * 60;
        units = 'upm';
    } else {
        value = upsRate;
        units = 'ups';
    }

    const formattedValue = Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
    return `${formattedValue} ${units}`;
}