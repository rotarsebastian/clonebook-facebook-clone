const isJSON = str => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// ====================== VALIDATION FOR EACH INPUT ======================
const validateInput = (type, value) => {
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
        case 'images':
            return typeof value === 'string' && isJSON(value)

        // ====================== POST VALIDATION ======================
        case 'author':
            return value.length >= 2 && value.length <= 80 && /^[\p{L} .'-]+$/u.test(value);
        case 'authorImg':
            return (value && value.length < 45 && typeof value === 'string') || value === null;
        case 'text':
            return value.length >= 1 && value.length <= 800;
        default:
            console.log(`Validation failed! No validation for ${type}!`);
        return false;
    }
}

// ====================== VALIDATION FORM TYPE ======================
const validateFormType = (validFormElements, type) => {
    
    // ====================== CHECK FOR THE SAME FORM ELEMENTS TYPES AND ORDER ======================
    switch (type) {
        // ====================== USER VALIDATION ======================
        case 'register':
            return JSON.stringify(validFormElements) === JSON.stringify([ 'first_name', 'last_name', 'birthdate', 'email', 'password', 'gender' ]);
        case 'login':
            return JSON.stringify(validFormElements) === JSON.stringify([ 'email', 'password' ]);
        case 'recover':
            return JSON.stringify(validFormElements) === JSON.stringify([ 'email' ]);
        case 'resetpass':
            return JSON.stringify(validFormElements) === JSON.stringify([ 'password', 'password' ]);
        case 'editUser':
            return JSON.stringify(validFormElements) === JSON.stringify([ 'first_name', 'last_name', 'images' ]);
  
        case 'edit':
            return true;

        // ====================== POST VALIDATION ======================
        case 'addPost':
            return JSON.stringify(validFormElements) === JSON.stringify([ 'author', 'authorImg', 'text' ]);
        default:
            console.log(`Check failed! ${type} elements are not valid!`);
        return false;
    }
}

// ====================== VALIDATION FOR EACH FORM ELEMENT ======================
const validateForm = (form, formType) => {
    let validFormElements = [], formIsValid = true, invalidInputs = [], msg = '';

    form.map(input => {
        // ====================== HANDLE INVALID ELEMENTS ======================
        if(!validateInput(input.type, input.val)) {
            formIsValid = false;
            console.log(`${input.type} with value ${input.val} is not valid`);
            invalidInputs.push(input.type);
            msg = 'Invalid inputs';
        } 

        // ====================== PUSH VALID ELEMENTS TO VALID ELEMENTS ARRAY ======================
        else validFormElements.push(input.type);
    });

    // ====================== IF ALL THE ELEMENTS ARE VALID CHECK THE FORM STRUCTURE ======================
    if(formIsValid) { formIsValid = validateFormType(validFormElements, formType); msg = 'Invalid elements order or type!' }

    // ====================== RETURN RESULT ======================
    return formIsValid ? { status: 1 } : { status: 0, invalidInputs, msg };
}

// ====================== CHECKS IF ALL THE ELEMENTS IN THE FORM HAVE THE RIGHT FORMAT ======================
const checkFormStructure = (form, options) => {

    // ====================== CHECK ARRAY VALIDITY ======================
    if(form === undefined) return { status: 0, message: 'Invalid request!', code: 404 };
    if(Array.isArray(form) && form.length === 0) return { status: 0, message: 'Array cannot be empty!', code: 404 };

    // ====================== GETTING ALL VALID ELEMENTS ======================
    const rightElemNo = form.filter(e => e.hasOwnProperty('type') && e.hasOwnProperty('val') && Object.keys(e).length === 2).length;

    // ====================== ONLY FOR RESET PASS ======================
    if(options && options === 'resetpass') {
        if(form.length !== 3 || rightElemNo !== 2 || !form[2].hasOwnProperty('key')) return { status: 0, message: 'Invalid array elements!', code: 404 };
    } 

    // ====================== CHECKING IF ALL FORM ELEMENTS ARE VALID ======================
    else if(form.length !== rightElemNo) return { status: 0, message: 'Invalid array elements!', code: 404 };

    // ====================== EVERYTHING GOOD ======================
    return { status: 1 };
}

module.exports = { checkFormStructure, validateForm, isJSON }