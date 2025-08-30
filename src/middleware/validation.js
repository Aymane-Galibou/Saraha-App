



export const validation = (schema) => {
  return (req, res, next) => {
    let validationResults = [];
    
    for (const key of Object.keys(schema)) {
      const {error} = schema[key].validate(req[key], {
        abortEarly: false,
      });

      if (error) {
        validationResults.push(error.details.map((d)=> ({message:d.message})));
      }
    }

    if (validationResults.length > 0) {

      return res.status(400).json({ error: validationResults });
    }
    next();
  };
};
