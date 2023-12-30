import e, { Router } from "express";
import HttpException from "../exceptions/httpException";
import userManager from "../managers/userManager";

const userRouter = Router();

userRouter.get('/new', (req, res, next) => {
  try {
    res.json(userManager.newUser());
  } catch (err) {
    next(new HttpException(503, err))
  }
});

userRouter.get('/get', (req, res, next) => {
  const { id } = req.query;
  const user = userManager.getUser(`${id}`);
  if (user) {
    res.json(user);
  } else {
    next(new HttpException(404, `User with id ${id} not found.`));
  }
});

userRouter.put('/settings', (req, res, next) => {
  const { id, ...query } = req.query;
  const user = userManager.getUser(`${id}`);
  if (!user) return next(new HttpException(404, `User with id ${id} not found.`));

  Object.entries(query).forEach(entry => {
    const [key, value] = entry;
    user.settings[key] = value;
  });
  res.json(user);
});

export default userRouter;
