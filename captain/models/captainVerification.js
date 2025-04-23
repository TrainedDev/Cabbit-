module.exports = (Sequelize, Datatypes) => {
    const Verification = Sequelize.define("Verifications", {
        captainName: Datatypes.STRING,
        license_url: {
            type: Datatypes.STRING,
            allowNull: false
        },
        panCard_url: {
            type: Datatypes.STRING,
            allowNull: false,
        },
    });

    Verification.associate = ((models) => {
        Verification.belongsTo(models.Captains, { foreignKey: "captainId" });
    });

    return Verification;
}