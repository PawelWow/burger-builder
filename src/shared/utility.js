export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const checkIsValid = (value, rules) => {
    let isValid = true;
    if (!rules) {
        // Nie ma reguł, więc zawsze walidny
        return true;
    }

    if(rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength){
        isValid = value.length >= rules.minLength && isValid;
    }

    if(rules.maxLength){
        isValid = value.length <= rules.maxLength && isValid;
    }

    if(rules.isEmail){
        // gotowiec: https://emailregex.com/
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        isValid = pattern.test(value) && isValid;
    }
    
    if(rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid;
    }

    return isValid;
}