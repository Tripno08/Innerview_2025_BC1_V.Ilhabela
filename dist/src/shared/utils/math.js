"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundToDecimalPlaces = exports.calculatePercentage = exports.average = exports.sum = void 0;
const sum = (a, b) => a + b;
exports.sum = sum;
const average = (numbers) => {
    if (!numbers || numbers.length === 0)
        return 0;
    return numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
};
exports.average = average;
const calculatePercentage = (value, total) => {
    if (total === 0)
        return 0;
    return (value / total) * 100;
};
exports.calculatePercentage = calculatePercentage;
const roundToDecimalPlaces = (num, decimalPlaces = 2) => {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(num * factor) / factor;
};
exports.roundToDecimalPlaces = roundToDecimalPlaces;
//# sourceMappingURL=math.js.map