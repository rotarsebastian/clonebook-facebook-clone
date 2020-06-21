import moment from 'moment';

export const parseDate = (date, forChat) => {
    const yesterday = moment().subtract(1, 'days').startOf('day');
    const isYesterday = moment(date).isSame(yesterday, 'd');

    if(moment().diff(moment(date), 'days') >= 1 && !isYesterday) return `${moment(date).format('D MMMM')} at ${moment(date).format('HH:mm')}`;
    else if(isYesterday) return `Yesterday at ${moment(date).format('HH:mm')}`;
    else if(moment().diff(moment(date), 'hours') > 1) return `${moment().diff(moment(date), 'hours')} hrs`;
    else if(moment().diff(moment(date), 'hours') === 1) return `1 hr`;
    else if(moment().diff(moment(date), 'minutes') > 1) return `${moment().diff(moment(date), 'minutes')} mins`;
    else if(moment().diff(moment(date), 'minutes') === 1) return `${moment().diff(moment(date), 'minutes')} min`;
    else return forChat ? '1min' : 'Just now';
}