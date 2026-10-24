import formidable from "formidable";

export default function (options = {}) {
  return function (req, res, next) {
    // These cannot have a body at all, so don't even attempt it
    if (req.method === "GET" || req.method === "DELETE") return next();

    // If the form is not of the right type, we skip parsing it
    if (
      !req.headers ||
      !req.headers["content-type"] ||
      !req.headers["content-type"].includes("multipart/form-data")
    ) {
      return next();
    }

    // Extensions by default are nice
    if (typeof options.keepExtensions === "undefined") {
      options.keepExtensions = true;
    }

    if (options.hash) {
      options.hashAlgorithm = options.hash;
    }

    const form = formidable(options);

    form.parse(req, function (err, fields, files) {
      if (err) return next(err);
      // formidable returns every value as an array; keep the last one, as before
      req.body = {};
      for (let field in fields) {
        req.body[field] = fields[field].at(-1);
      }
      req.files = {};
      for (let name in files) {
        const file = files[name].at(-1);
        req.files[name] = {
          path: file.filepath,
          name: file.originalFilename,
          type: file.mimetype,
          size: file.size,
          modified: file.lastModifiedDate,
        };
      }
      next();
    });
  };
};
