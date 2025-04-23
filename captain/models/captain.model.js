module.exports = (Sequelize, Datatypes) => {
    const Captain = Sequelize.define("Captains", {
        username: Datatypes.STRING,
        email: Datatypes.STRING,
        password: Datatypes.STRING,
        isAvailable: {
            type: Datatypes.BOOLEAN,
            defaultValue: false,
        },
    });

    Captain.associate = (models) => {
        Captain.hasMany(models.Verifications, { foreignKey: "captainId" });
    };

    return Captain;

};