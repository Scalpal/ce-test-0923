import * as yup from "yup";

const createValidator = (name, schema) => schema && { [name]: yup.object().shape(schema) };

const validate = (schema) => {
  const validator = yup.object().shape(
    Object.fromEntries(
      Object.entries({
        ...createValidator("body", schema.body),
        ...createValidator("params", schema.params),
        ...createValidator("query", schema.query)
      })
    )
  );

  return async (req, res, next) => {
    try {
      await validator.validate(
        {
          body: req.body,
          params: req.params,
          query: req.query
        },
        {
          abortEarly: false
        }
      )

      next()
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        res.status(422).send({ error: error.errors })

        return;
      }

      res.status(500).send({ error: "Something went wrong" })
    }
  }
};

export default validate;