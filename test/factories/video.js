const faker = require('faker');
const { Video } = require('../../models');
/**
* Generate an object which container attributes needed
* to successfully create a video instance.
* 
* @param  {Object} props
* 
* @return {Object}
*/
const data = (props = {}) => {
  const defaultProps = {
    id: faker.random.uuid(),
    title: faker.lorem.sentence(),
    date: faker.date.recent()
  };
  return Object.assign({}, defaultProps, props);
};
/**
* Generates a video instance from the properties provided.
* 
* @param  {Object} props
* 
* @return {Object}
*/
// module.export = async(props = {}) =>
//  models.Video.create(await data(props));

module.exports.VideoFactory = (props) => {
  return Video.create(data(props));
};
