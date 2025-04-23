module.exports = (Sequelize, Datatypes) => {
    const Ride = Sequelize.define("Rides", {
        captainId: Datatypes.INTEGER,
        userId: Datatypes.INTEGER,
        pickUp: Datatypes.STRING,
        dropOf: Datatypes.STRING,
        status: {
            type: Datatypes.ENUM('requested', 'accepted', 'started', 'completed'),
            defaultValue: "requested",
        },
    });

    return Ride;
};
