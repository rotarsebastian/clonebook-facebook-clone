<script>
    import moment from 'moment';
    import { register } from './../helpers/user';
    import { showNotification } from './../helpers/actionNotifications';
    import { validateForm } from './../helpers/validation';
    import Icon from 'svelte-awesome';
    import { spinner } from 'svelte-awesome/icons';

    // ====================== DYNAMIC VARIABLES ======================
    let day = parseInt(moment().format('D')), month = moment().month() + 1, year = moment().year();
    let registerFirstName = '', registerSurname = '', registerEmail = '', registerPass = '', gender, buttonLoading = false;

    // ====================== CREATE AN INTERVAL FROM A NUMBER AND THE LENGTH - Ex createNumInterval(1, 31) => 1, 2, ... ,31 ======================
    const createNumInterval = (from, length) => {
        const intervalArray = [];
        Array(length).fill('').map((item, index) => intervalArray.push(from + index));
        return intervalArray;
    }

    // ====================== CREATE ALL THE MONTH OF THE YEAR - FORMAT (Jan, Feb, ...) ======================
    const createMonthSelect = () => {
        const monthsArray = [];
        Array(12).fill('').map((item, index) => {
            monthsArray.push({ text: moment(new Date(`2000-${index + 1}-01`)).format('MMM'), number: index + 1 });
        });
        return monthsArray;
    }

    // ====================== CAPITALIZE EACH WORD AFTER A SPACE ======================
    const capitalizeEachName = text => {
        return text.trim()
            .toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    }

    // ====================== REGISTER USER ======================
    const handleRegister = async() => {

        // ====================== VALIDATION ======================
        const registerData = [ 
            { type: 'first_name', val: capitalizeEachName(registerFirstName) }, 
            { type: 'last_name', val: capitalizeEachName(registerSurname) }, 
            { type: 'birthdate', val: `${year}-${month < 10 ? '0' + month : month}-${day}` }, 
            { type: 'email', val: registerEmail.trim() }, 
            { type: 'password', val: registerPass }, 
            { type: 'gender', val: gender }, 
        ];

        const isFormValid = validateForm(registerData);
        if(!isFormValid.formIsValid) return showNotification('danger', `Invalid ${isFormValid.invalids.join(', ')}`);

        // ====================== REQUEST ======================
        buttonLoading = true;
        const res = await register(registerData);
        buttonLoading = false;

        // ====================== RESPONSE ======================
        if(res.status === 1) {
            registerFirstName = '', registerSurname = '', registerEmail = '', registerPass = '', gender = undefined;
            day = parseInt(moment().format('D')), month = moment().month() + 1, year = moment().year();
            return showNotification('success', 'An email was sent to validate your account');
        } else return showNotification('danger', res.message);
    }

</script>

<div class="registerContainer">

    <h1>Create a new account</h1>
    <div class="text">It's quick and easy.</div>
    <form class="registerForm" on:submit|preventDefault={handleRegister}>

        <!-- FIRST NAME & LAST NAME & EMAIL & PASSWORD -->
        <div class="nameContainer">
            <input class="input" name="first_name" type="text" placeholder="First name" bind:value={registerFirstName} />
            <input class="input" name="surname" type="text" placeholder="Surname" bind:value={registerSurname} />
        </div>

        <div class="inputContainer">
            <input class="input" name="email" type="email" placeholder="Email address" bind:value={registerEmail} />
        </div>

        <div class="inputContainer">
            <input class="input" name="password" type="password" placeholder="New password" bind:value={registerPass} />
        </div>

        <!-- BIRTHDATE -->
        <label class="label">Birthday</label>

        <div class="selectContainer">
            <select bind:value={day} name="day" id="day">
                {#each createNumInterval(1, 31) as day}
                    <option value={day}>{day}</option>
                {/each}
            </select>

            <select bind:value={month} name="month" id="month">
                {#each createMonthSelect() as month}
                    <option value={month.number}>{month.text}</option>
                {/each}
            </select>

            <select bind:value={year} name="year" id="year">
                {#each createNumInterval(moment().year() - 115, 116) as year}
                    <option value={year}>{year}</option>
                {/each}
            </select>
        </div>

        <!-- GENDER -->
        <label class="label">Gender</label>

        <div class="genderContainer">
            <label>
                <input type=radio bind:group={gender} value={'Female'}>
                Female
            </label>

            <label>
                <input type=radio bind:group={gender} value={'Male'}>
                Male
            </label>
        </div>

        <!-- REGISTER BUTTON -->
        <button class="registerButton" disabled={!registerFirstName || !registerSurname || !registerEmail || !registerPass || !gender} type="submit">
            {#if buttonLoading}
                <Icon class="spinner" scale={1.25} data={spinner} pulse />
                {:else}
                Sign Up
            {/if}
        </button>
    </form>

</div>

<style>
    .registerContainer {
        background-color: #e9ebee;
        margin-top: 5.25rem;
        height: calc(100vh - 5.25rem);
        padding-top: 5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .registerButton {
        margin: 0 auto;
        border: none;
        background-color: rgb(105, 167, 78);
        background-image:linear-gradient(rgb(103, 174, 85), rgb(87, 136, 67));
        box-shadow:rgb(164, 227, 136) 0px 1px 1px 0px inset;
        color: #fff;
        font-size: 19px;
        font-family: 'Freight Medium';
        text-rendering: optimizelegibility;
        cursor: pointer;
        text-shadow: 0 1px 2px rgba(0,0,0,.5);
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 7px 20px;
        min-width: 194px;
        border-radius: 5px;
        width: 15%;
        transition: .3s;
        outline: none;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 2.25rem;
    }

    .registerButton:disabled {
        filter: brightness(1.1);
        opacity: .7;
    }

    .genderContainer {
        display: flex;
        margin-top: 10px;
        margin-bottom: 5px;
        justify-content: center;
    }

    .genderContainer input {
        width: 20px;
        height: 18px;
        margin-right: 4px;
    }

    .genderContainer label {
        color: #1d2129;
        font-size: 18px;
        font-weight: normal;
        line-height: 18px;
        padding: 0 10px 0 3px;
        display: flex;
        align-items: center;
    }

    .selectContainer {
        display: flex;
        justify-content: space-evenly;
        width: 60%;
    }

    .selectContainer select {
        outline: none;
        align-items: center;
        background-color: rgb(255, 255, 255);
        border: 1px solid rgb(204, 208, 213);
        border-radius: 5px; 
        color: rgb(28, 30, 33);
        font-size :13px;
        height: 30px;
        width: 63px;
        writing-mode: horizontal-tb;
        -webkit-appearance: menulist-button;
        -webkit-font-smoothing: subpixel-antialiased;
        -webkit-rtl-ordering: logical;
    }

    .registerContainer .label {
        color: #90949c;
        font-size: 16px;
        font-weight: bold;
        margin: 10px 0;
        text-align: center;
    }

    .registerContainer h1 {
        color: rgb(51, 51, 51);
        font-size: 36px;
        font-family: 'Freight Medium';
        line-height: 43.2px;
        margin-bottom: 5px;
        overflow-wrap: break-word;
        text-rendering: optimizelegibility;
        -webkit-font-smoothing: subpixel-antialiased;
    }

    .registerContainer .text {
        color: rgb(51, 51, 51);
        font-family: 'Freight Light';
        font-size: 19px;
        line-height: 23.94px;
        margin-bottom: 20px;
        overflow-wrap: break-word;
        text-rendering: optimizelegibility;
        -webkit-font-smoothing: subpixel-antialiased;
    }

    .registerForm {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .registerForm .input {
        width: 100%;
        background-color: #fff;
        border-radius: 5px;
        border: 1px solid rgb(189, 199, 216);
        color: rgb(28, 30, 33);
        font-size: 17px;
        overflow-wrap: break-word;
        padding: 8px 10px;
        margin-bottom: .5rem;
    }

    .registerForm .input::placeholder {
        font-size: 18px;
        color: rgb(150, 150, 150);
        font-weight: 400;
    }

    .registerForm .nameContainer {
        display: flex;
        width: 100%;
        justify-content: space-between;
    }

    .registerForm .nameContainer input {
        width: 50%;
    }

    .registerForm .nameContainer input:first-of-type {
        margin-right: .25rem;
    }

    .registerForm .nameContainer input:last-of-type {
        margin-left: .25rem;
    }

    .registerForm .inputContainer {
        color: #333;
        width: 100%;
    }
</style>