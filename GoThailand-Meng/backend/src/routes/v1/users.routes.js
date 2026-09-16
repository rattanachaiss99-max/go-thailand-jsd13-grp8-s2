import { Router } from "express";
import { users } from "../../fakeDB/fakeUsers.js";

export const router = Router();

// Read users
router.get("/", (req, res, next) => {
  try {
    //   console.log(req);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Create user
router.post("/", (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "username, email and password are required!" });
    }

    const highestId = users.reduce(
      (max, user) => Math.max(max, Number(user.id)),
      0,
    );

    const nextId = String(highestId + 1);

    const newUser = {
      id: nextId,
      username: username,
      email: email,
      password: password,
    };

    users.push(newUser);

    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// Update user
router.put("/:id", (req, res, next) => {
  try {
    const user = users.find((u) => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "username, email and password are required!" });
    }

    user.username = username;
    user.email = email;
    user.password = password;

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// Delete user
router.delete("/:id", (req, res, next) => {
  try {
    const index = users.findIndex((u) => u.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "User not found!" });
    }

    const [deleted] = users.splice(index, 1);

    return res.json(deleted);
  } catch (err) {
    next(err);
  }
});
