'use strict';
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    channel_name: DataTypes.STRING
  }, {timestamps: false});
  Channel.associate = function(models) {
    // associations can be defined here
  };
  return Channel;
};