module.exports = (Sequelize, Datatypes) => {
    const user = Sequelize.define("uber_users", {
        username: Datatypes.STRING,
        password: Datatypes.STRING,
        email: Datatypes.STRING,
        phoneNumber: Datatypes.STRING,
        oauth_id: Datatypes.STRING,
    });

    return user;
};
