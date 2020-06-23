const isJSON = str => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export const validateForm = formElements => {
    let formIsValid = true;
    let invalids = [];
    formElements.forEach(input => {
        if(!validateInputValue(input.type, input.val)) {
            formIsValid = false;
            invalids.push(input.type);
        }
    });
    return { formIsValid, invalids };
}

// ====================== VALIDATION FOR EACH INPUT ======================
export const validateInputValue = (type, value) => {
    switch (type) {
        // ====================== USER VALIDATION ======================
        case 'password':
            return value.length >= 6 && value.length <= 80;
        case 'email':
            return /@.+\.[A-Za-z]{2,}$/.test(value);
        case 'first_name':
            return value.length >= 2 && value.length <= 50 && /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/.test(value);
        case 'last_name':
            return value.length >= 2 && value.length <= 50 && /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/.test(value);
        case 'gender':
            return value.length >= 4 && value.length <= 6 && /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/.test(value);
        case 'birthdate':
            return value.length === 10 && /^\d{4}-((0\d)|(1[012]))-(([012]\d)|3[01])$/.test(value);
        case 'images':
            return typeof value === 'string' && isJSON(value)

        // ====================== POST VALIDATION ======================
        case 'author':
            return value.length >= 2 && value.length <= 80 && /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/.test(value);
        case 'authorImg':
            return (value && value.length < 45 && typeof value === 'string') || value === null;
        case 'text':
            return value.length >= 1 && value.length <= 800;
        default:
            console.log(`Validation failed! No validation for ${type}!`);
        return false;
    }
}