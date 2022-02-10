import { User, UserFactory } from '@rockts-org/nestjs-user';

const userFactory = new UserFactory(User);
userFactory.define();
