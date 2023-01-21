const _ = require('lodash');
const Schemas = require('../schemas');
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

// Pinata IPFS connect
const API_KEY = process.env.PINATA_API_KEY;
// const API_KEY = "asdf";
const API_SECRET = process.env.PINATA_API_SECRET;

module.exports = (useJoiError = false) => {
  // useJoiError determines if we should respond with the base Joi error
  // boolean: defaults to false
  const _useJoiError = _.isBoolean(useJoiError) && useJoiError;
  // enabled HTTP methods for request data validation
  const _supportedMethods = ['post', 'get'];
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  let pinataMetadata = null;
  let pinataResponse = null;
  let pinataData = null;

  const deleteFile = async (req) => {
    await fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err);
      }
      return;
    });
  };

  // return the validation middleware
  return async (req, res, next) => {
    const route = req.route.path;
    const method = req.method.toLowerCase();
    const CustomError = {
      status: 'failed',
      error: 'Invalid request data. Please review request and try again.',
    };

    if (_.includes(_supportedMethods, method) && _.has(Schemas, route)) {
      // get schema for the current route
      const _schema = _.get(Schemas, route);
      if (_schema) {
        // Validate req.body using the schema and validation options
        try {
          // If/else to check for Pinata. I couldn't do axios call in the controller, so I am doing it here.
          if (route === '/upload_file') {
            const pinataSubmitData = JSON.parse(req.body.formInputData);
            pinataMetadata = JSON.stringify({
              name: pinataSubmitData.title,
              keyvalues: { description: pinataSubmitData.description },
            });
            const { walletAddress, type } = req.body;
            const data = new FormData();
            await data.append('pinataMetadata', pinataMetadata);
            await data.append('pinataOptions', pinataOptions);
            await data.append('file', fs.createReadStream(req.file.path));
            try {
              pinataResponse = await axios.post(url, data, {
                maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
                headers: {
                  'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                  pinata_api_key: API_KEY,
                  pinata_secret_api_key: API_SECRET,
                },
              });
              pinataData = pinataResponse.data;
            } catch (err) {
              deleteFile(req);
              res.status(422).json(CustomError);
              return;
            }
            deleteFile(req);
            // Validating user input
            let valid = await _schema.validateAsync(
              JSON.parse(req.body.formInputData)
            );
            req.body = {
              ...valid,
              ...pinataData,
              walletAddress,
              type,
            };
          } else {
            // Validating user input
            req.body = await _schema.validateAsync(req.body);
          }
          return next();
        } catch (err) {
          const JoiError = {
            status: 'failed',
            error: {
              original: err._object,
              // fetch only message and type from each error
              details: _.map(err.details, ({ message, type }) => ({
                message: message.replace(/['"]/g, ''),
                type,
              })),
            },
          };
          res.status(422).json(_useJoiError ? JoiError : CustomError);
          return;
        }
      }
    }
    return next();
  };
};
