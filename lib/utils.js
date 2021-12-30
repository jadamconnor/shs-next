export function isEmpty(value) {
    const type = typeof val;
    if ((value !== null && type === 'object') || type === 'function') {
        const properties = Object.keys(value);
        if (properties.length === 0 || properties.size === 0) { 
            return true;
        } 
    } 
    return !value;
}