<script>
    import { validateForm } from './../helpers/validation';
    import { getNotificationsContext } from 'svelte-notifications';
    import Icon from 'svelte-awesome';
    import { spinner } from 'svelte-awesome/icons';
    import { recoverOrResendValidation } from './../helpers/auth';

    const { addNotification } = getNotificationsContext();
    
    let recoverEmail = 'rotar.seby1@gmail.com', buttonLoading = false;;

    const handleRecover = async() => {
        // ====================== VALIDATION ======================
        const recoverAccData = [ 
            { type: 'email', val: recoverEmail }
        ];

        const isFormValid = validateForm(recoverAccData);
        if(!isFormValid.formIsValid) return showNotification('danger', `Invalid ${isFormValid.invalids.join(', ')}`);

        buttonLoading = true;
        const res = await recoverOrResendValidation(recoverAccData);
        buttonLoading = false;

        // ====================== RESPONSE ======================
        if(res.status === 1) {
            return showNotification('success', 'An email was sent to you!');
        } else return showNotification('danger', res.message);
    }

    const showNotification = (type, text) => {
        return addNotification({
            text,
            position: 'bottom-right',
            type,
            removeAfter: 3000,
        });
    }

</script>

<div class="recoverPassContainer">
    <h1>Recover your account</h1>
    <div class="text">Just insert your email and we will handle the rest.</div>
    <form class="recoverForm" on:submit|preventDefault={handleRecover}>

        <div class="inputContainer">
            <input class="input" name="email" type="email" placeholder="Email address" bind:value={recoverEmail} />
        </div>

        <button class="recoverButton" disabled={!recoverEmail} type="submit">
            {#if buttonLoading}
                <Icon class="spinner" scale={0.75} data={spinner} pulse />
                {:else}
                Send email
            {/if}
        </button>
    </form>
</div>

<style>
    .recoverPassContainer h1 {
        color: rgb(51, 51, 51);
        font-size: 36px;
        font-family: 'Freight Medium';
        line-height: 43.2px;
        margin-bottom: 5px;
        overflow-wrap: break-word;
        text-rendering: optimizelegibility;
        -webkit-font-smoothing: subpixel-antialiased;
    }

    .recoverPassContainer .text {
        color: rgb(51, 51, 51);
        font-family: 'Freight Light';
        font-size: 19px;
        line-height: 23.94px;
        margin-bottom: 20px;
        overflow-wrap: break-word;
        text-rendering: optimizelegibility;
        -webkit-font-smoothing: subpixel-antialiased;
    }

    .recoverPassContainer {
        background-color: #e9ebee;
        margin-top: 5.25rem;
        height: calc(100vh - 5.25rem);
        padding-top: 5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .recoverButton {
        margin: 0 auto;
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
        text-align: center;
        border-radius: 5px;
        width: 15%;
        transition: .3s;
        outline: none;
    }

    .recoverButton:disabled {
        filter: brightness(1.1);
        opacity: .7;
    }
  
    .recoverForm {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .recoverForm .input {
        width: 100%;
        background-color: #fff;
        border-radius: 5px;
        border: 1px solid rgb(189, 199, 216);
        color: rgb(28, 30, 33);
        font-size: 17px;
        overflow-wrap: break-word;
        padding: 8px 10px;
        margin-bottom: .5rem;
        width: 25vw;
    }

    .recoverForm .input::placeholder {
        font-size: 18px;
        color: rgb(150, 150, 150);
        font-weight: 400;
    }

    .recoverForm .nameContainer input {
        width: 50%;
    }

    .recoverForm .nameContainer input:first-of-type {
        margin-right: .25rem;
    }

    .recoverForm .nameContainer input:last-of-type {
        margin-left: .25rem;
    }

    .recoverForm .inputContainer {
        color: #333;
        width: 100%;
    }
</style>