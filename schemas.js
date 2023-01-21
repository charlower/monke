const Joi = require('joi');

//CONTENT SCHEMA
const title = Joi.string();
const description = Joi.string();
const tags = Joi.array().items(Joi.string()).max(3);
const stakeAmount = Joi.number();

const contentDataSchema = Joi.object({
  title: title.required(),
  description: description.required(),
  tags: tags,
  nftCost: stakeAmount.required(),
  type: Joi.string(),
});

//USER SCHEMA
const walletAddress = Joi.string();
const date = Joi.number();
const userName = Joi.string();
const species = Joi.string();
const content = Joi.array();

const userDataSchema = Joi.object({
  userName: userName.required(),
  walletAddress: walletAddress.required(),
  date: date.required(),
  species: species.required(),
  content: content.required(),
});

const updateUserDataSchema = Joi.object({
  userName: userName.required(),
  walletAddress: walletAddress.required(),
});

const authDataSchema = Joi.object({
  walletAddress: walletAddress.required(),
});

module.exports = {
  '/upload_file': contentDataSchema,
  '/create_user': userDataSchema,
  '/update_user': updateUserDataSchema,
  '/auth': authDataSchema,
};
