
export const currencyFormatter = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return '';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};