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

export const kebabCase = string => string
.replace(/([a-z])([A-Z])/g, "$1-$2")
.replace(/[\s_,/]+/g, '-')
.toLowerCase()