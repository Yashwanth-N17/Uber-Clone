const userModel = require("../models/user.model");

// This function creates a new user in the database. It takes the user's first name, last name, email, and password as input.
// It first checks if the required fields (firstname, email, password) are provided.
// If any required field is missing, it throws an error.
// If all fields are present, it uses the userModel to create a new user record in the database and returns the created user object.
module.exports.createUser = async ({
  firstname,
  lastname,
  email,
  password,
}) => {
  if (!firstname || !email || !password) {
    throw new Error("All Fields Are required!");
  }

  const user = userModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
  });
  return user;
};
