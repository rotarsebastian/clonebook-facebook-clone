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
            return value.length >= 2 && value.length <= 50 && /^[\p{L} .'-]+$/u.test(value);
        case 'last_name':
            return value.length >= 2 && value.length <= 50 && /^[\p{L} .'-]+$/u.test(value);
        case 'gender':
            return value.length >= 4 && value.length <= 6 && /^[\p{L} .'-]+$/u.test(value);
        case 'birthdate':
            return value.length === 10 && /^\d{4}-((0\d)|(1[012]))-(([012]\d)|3[01])$/.test(value);

        // ====================== POST VALIDATION ======================
        case 'author':
            return value.length >= 2 && value.length <= 80 && /^[\p{L} .'-]+$/u.test(value);
        case 'text':
            return value.length >= 1 && value.length <= 800;
        default:
            console.log(`Validation failed! No validation for ${type}!`);
        return false;
    }
}