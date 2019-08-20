'use strict';
module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      }
    },
    date: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: true,
        isDate: true,
      }
    },
  }, {timestamps: false});
  Video.associate = function(models) {
    // associations can be defined here
  };
  return Video;
};