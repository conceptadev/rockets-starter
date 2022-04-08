import { User, UserFactory } from '@concepta/nestjs-user';

const userFactory = new UserFactory(User);
userFactory.define();
