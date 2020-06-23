import { getNotificationsContext } from 'svelte-notifications';

const { addNotification } = getNotificationsContext();

// ====================== ADD NOTIFICATION ======================
export const showNotification = (type, text) => {
    return addNotification({
        text,
        position: 'bottom-right',
        type,
        removeAfter: 3000,
    });
}