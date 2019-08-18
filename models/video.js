'use strict';
module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    title: DataTypes.STRING,
    date: DataTypes.DATE
  }, {timestamps: false});
  Video.associate = function(models) {
    // associations can be defined here
  };
  return Video;
};