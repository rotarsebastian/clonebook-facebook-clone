<script>
	import { store } from './../stores/store.js';
    import { getAccessToken, getSpecificUser, updateProfile } from './../helpers/auth';
	import ProfileImage from './../components/MiniComponents/ProfileImage.svelte';
	import AddImages from './../components/MiniComponents/AddImages.svelte';
	import Thumb from './../components/MiniComponents/Thumb.svelte';
	import { getNotificationsContext } from 'svelte-notifications';
	import { validateForm } from './../helpers/validation';
	import Modal from './../components/Modals/Modal.svelte';
	
    const { addNotification } = getNotificationsContext();

    const showNotification = (type, text) => {
        return addNotification({
            text,
            position: 'bottom-right',
            type,
            removeAfter: 3000,
        });
	}
    
	let first_name = $store.user.first_name, last_name = $store.user.last_name;

	$: buttonDisabled = $store.selectedProfileImage ? false : true

	let oldImages = $store.user.images;
	let newImages = [];

	const setNewImages = files => {
		$store.temporaryImages = [ ...files.map(img => img.preview) ];
		setTimeout(() => {
			newImages = [ ...files ];
			buttonDisabled = false;
		}, 100);
	}

	const removeOldImage = index => {
        const newFiles = [ ...oldImages ];
		newFiles.splice(index, 1);
		oldImages = [ ...newFiles ];
		buttonDisabled = false;
	}
	
	const editProfile = async() => {
		// ====================== VALIDATION ======================
        const editProfileData = [
			{ type: 'first_name', val: first_name },
			{ type: 'last_name', val: last_name },
			{ type: 'images', val: JSON.stringify(oldImages) }
		];

        const isFormValid = validateForm(editProfileData);
		if(!isFormValid.formIsValid) return showNotification('danger', `Invalid ${isFormValid.invalids.join(', ')}`);
		
		// ====================== CREATE NEW REQUEST FORM DATA ======================
        const requestData = new FormData();

		// ====================== APPEND JSON DATA AND IMAGES ======================
        requestData.append('data', JSON.stringify(editProfileData));
		newImages.map(file => requestData.append('image', file, file.name));
		
		// ====================== GET THE PROFILE IMAGE ======================
		let newProfileImage;

		if($store.selectedProfileImage !== null) {
			if($store.selectedProfileImage.includes('blob')) {
				newProfileImage = newImages.findIndex(img => img.preview === $store.selectedProfileImage);
			} 
			else newProfileImage = oldImages.find(img => img === $store.selectedProfileImage);
		}
		const res = newProfileImage !== undefined ? await updateProfile(requestData, $store.accessToken, newProfileImage) : await updateProfile(requestData, $store.accessToken);
		
        // ====================== RESPONSE ======================
        if(res.status === 1) {
			$store.user = { ...$store.user, ...res.updatedUser };
			$store.selectedProfileImage = null;
			newImages = [];
			oldImages = $store.user.images;
            return showNotification('success', 'Profile edited successfully!');
        } 
	}
	
</script>

<Modal>
	<div class="contentContainer">
		<ProfileImage size={15} img={$store.user.images[0]} />
		<div class="userFullName">{$store.user.first_name} {$store.user.last_name}</div>

		<div class="inputContainer">
			<label for="first_name">First name</label>
			<input 
				class="input" 
				id="first_name" 
				name="first_name" 
				type="text" 
				placeholder="Your first name" 
				bind:value={first_name} 
				on:input={() => buttonDisabled = false} 
			/>
		</div>

		<div class="inputContainer">
			<label for="last_name">Last name</label>
			<input 
				class="input last" 
				id="last_name" 
				name="last_name" 
				type="text" 
				placeholder="Your last name" 
				bind:value={last_name} 
				on:input={() => buttonDisabled = false} 
			/>
		</div>

		<p class="addRemoveImages">Add / Remove profile images</p>
		<div class="thumbsContainer">
			{#each oldImages as image, index}
				<Thumb removeImage={removeOldImage} oldImage={image} index={index} />
			{/each}
			<AddImages files={newImages} setNewFiles={setNewImages} />
		</div>

		<p class="infoContainer"><span>Click:</span>Select profile picture</p>
		<p class="infoContainer"><span>Double click:</span>See images in fullscreen mode</p>
		<p class="infoContainer"><span>Info:</span>You can add maximum 5 new pictures at once</p>

		<button class="editProfileButton" on:click={editProfile} class:disabled={buttonDisabled} disabled={buttonDisabled}>
			Save changes
		</button>
	</div>
</Modal>

<style>
	.contentContainer {
		display: flex;
        align-items: center;
        flex-direction: column;
		margin-top: 5.5rem;
	}

	.userFullName {
		color: var(--black);
		font-weight: bold;
		font-size: 1.7rem;
		margin: 2rem 0;
	}

	.addRemoveImages {
		color: var(--grey);
		margin-top: 2rem;
		font-size: 1.35rem;
		margin-bottom: 1rem;
	}
	.infoContainer {
		color: var(--grey);
		margin-top: .5rem;
		font-size: .9rem;
	}

	.infoContainer:first {
		margin-top: 1.5rem;
	}
	.infoContainer:last-of-type {
		margin-bottom: .5rem;
	}

	.infoContainer span {
		font-weight: bold;
		margin-right: .2rem;
	}

	.thumbsContainer {
        display: flex;
        flex-wrap: wrap;
		justify-content: center;
		margin: 0 5rem;
	}

	.editProfileButton {
		background-color: rgb(24, 119, 242);
		border-radius: 8px;
		border: none;
		color: #fff;
		cursor: pointer;
		font-size: 15px;
		line-height: 16.08px;
		padding: .55rem 1.25rem;
		user-select: none;
		outline: none;
		display: flex;
		align-items: center;
		margin-top: 1rem;
	}

	.editProfileButton.disabled {
		opacity: .5;
	}

	.inputContainer input {
		width: 100%;
        background-color: #fff;
        border-radius: 5px;
        border: 1px solid rgb(189, 199, 216);
        color: rgb(28, 30, 33);
        font-size: 17px;
        overflow-wrap: break-word;
        padding: 8px 10px;
		margin-bottom: .75rem;
		margin-top: .35rem;
	}

	.inputContainer input.last {
		margin-bottom: 0;
	}

	.inputContainer label {
		color: var(--grey);
		font-size: 1rem;
		margin-left: .5rem;
	}

</style>