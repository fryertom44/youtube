'use strict';
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    channel_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      }
    }
  }, {timestamps: false});

  Channel.associate = function(models) {
    // associations can be defined here
  };
  return Channel;
};