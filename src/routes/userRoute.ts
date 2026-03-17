import { Request, Response, Router } from 'express';
import requireJwt from '../middlewares/requireJwt'; // our middleware to authenticate using JWT
import UserService from '../services/UserService' // assuming you have a service

const router = Router();

// mock user info endpoint to return user data
router.get('/', requireJwt, (req: Request, res: Response) => {
  try {
    /* 
       The requireJwt middleware authenticates the request by verifying 
       the accessToken. Once authenticated, it attaches the User object 
       to req.user (see `jwt.ts`), making it availabe in the subsequent route handlers, 
       like those in userRoute.
    */
    // req.user is populated after passing through the requireJwt 
    // middleware
    const user = req.user as User;

    const veryVerySecretUserInfo = await UserService.getUser({ userId: user.id });

    // it is a mock, you MUST return only the necessary info :)
    return res.status(200).json(veryVerySecretUserInfo);
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while fetching user info', error });
  }
});

export default router;