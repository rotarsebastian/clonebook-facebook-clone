// ====================== IMPORTS ======================
const app = require('express')();
// const rateLimit = require('express-rate-limit');

// ====================== IMPLEMENT LIMITER ======================
// const authLimiter = rateLimit({
//     windowMs: 10 * 1000, // 10 seconds
//     max: 1 // limit each ip to 4 req per windowsMs
// });
// ====================== IMPLEMENT USERS LIMITER ======================
// app.use('/users/login', rateLimit({ windowMs: 2 * 1000, max: 1 }));
// app.use('/users/register', rateLimit({ windowMs: 3 * 1000, max: 1 }));
// app.use('/users/recover', rateLimit({ windowMs: 5 * 1000, max: 1 }));
// app.use('/users/edit', rateLimit({ windowMs: 5 * 1000, max: 1 }));
// app.use('/users/logout', rateLimit({ windowMs: 5 * 1000, max: 1 }));
// app.use('/users/resetpass', rateLimit({ windowMs: 5 * 1000, max: 1 }));
// app.use('/users/reset', rateLimit({ windowMs: 5 * 1000, max: 1 }));
// app.use('/users/activate', rateLimit({ windowMs: 20 * 1000, max: 1 }));

// ====================== ROUTES ======================
const usersRoute = require(__dirname + '/./api/users');
const statusesRoute = require(__dirname + '/./api/statuses');
const postsRoute = require(__dirname + '/./api/posts');
const notifRoute = require(__dirname + '/./api/notifications');
const conversationsRoute = require(__dirname + '/./api/conversations');

// ====================== ADD ROUTES ======================
app.use('/users', usersRoute);
app.use('/statuses', statusesRoute);
app.use('/posts', postsRoute);
app.use('/notifications', notifRoute);
app.use('/conversations', conversationsRoute);

module.exports = app;
