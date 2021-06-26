// import models
const User = require('./User');
const Vote = require('./Vote');

Vote.belongsTo(User, {
    foreignKey: "user_id"
});

User.belongsToMany(Vote, {
    foreignKey: "vote_id",
});

module.exports = {
    Vote,
    User,
};