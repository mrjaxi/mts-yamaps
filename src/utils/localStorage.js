export const loadState = (key) => {
    try {
        if (Array.isArray(key)) {
            const items = []
            key.forEach(item => {
                const localItem = localStorage.getItem(item);
                if(localItem === null){
                    items.push(undefined)
                } else {
                    items.push(JSON.parse(localItem))
                }
            })
            return items
        } else {
            const serializedState = localStorage.getItem(key);
            if(serializedState === null){
                return undefined;
            }
            return JSON.parse(serializedState);
        }
    } catch (err) {
        return undefined;
    }
};

export const saveState = (key, value ) => {
    try{
        const serializedState = JSON.stringify(value);
        localStorage.setItem(key, serializedState);
    } catch (err){
        return undefined;
    }
}

export const removeState = (key) => {
    try {
        localStorage.removeItem(key)
    } catch (err) {
        return undefined
    }
}
