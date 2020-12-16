/* eslint-disable no-console */
import {
  PrismaClient,
  // User,
  UserCreateArgs,
  UserRole,
} from '@prisma/client';
import Faker from 'faker';
import Ora from 'ora';
// import { AbsenceReason, AbsenceType } from '../interfaces';
import hashPassword from '../utils/hashPassword';

const NUMBER_USERS = 10;
const NUM_ORG_REJECTED = 1;
const NUM_ORG_APPROVED = 2;
const NUM_ORG_SUBMITTED = 3;
const NUM_ORG_DRAFT = 2;

if (
  NUM_ORG_REJECTED + NUM_ORG_APPROVED + NUM_ORG_SUBMITTED + NUM_ORG_DRAFT >
  NUMBER_USERS
) {
  console.log(
    'Number of organizations specified greater than number of org users'
  );
  process.exit(1);
}

// function generateFieldsAcrossTimestamps(
//   key: ProfileFieldKey,
//   generateValue: () => unknown
// ): ProfileFieldCreateWithoutUserInput[] {
//   return Array(12)
//     .fill(null)
//     .map(
//       (_, index: number) =>
//         new Date(
//           `2020-${String(index + 1).padStart(2, '0')}-${String(
//             Faker.random.number({
//               min: 1,
//               max: 28,
//             })
//           ).padStart(2, '0')}T12:00:00+00:00`
//         )
//     )
//     .map(
//       (date: Date) =>
//         <ProfileFieldCreateWithoutUserInput>{
//           key,
//           value: String(generateValue()),
//           createdAt: date,
//         }
//     );
// }

export default async function seedDatabase(): Promise<void> {
  const prisma = new PrismaClient();
  const clearAllMessage = Ora('Cleaning up previous seeded information');
  try {
    // const users = await prisma.user.findMany({
    //   where: {
    //     email: {
    //       endsWith: '@nbjc.dev',
    //     },
    //   },
    // });
    // await prisma.userInvite.deleteMany({
    //   where: {
    //     user_id: {
    //       in: users.map((user: User) => user.id),
    //     },
    //   },
    // });
    // await prisma.absence.deleteMany({
    //   where: {
    //     userId: {
    //       in: users.map((user: User) => user.id),
    //     },
    //   },
    // });
    // await prisma.profileField.deleteMany({
    //   where: {
    //     userId: {
    //       in: users.map((user: User) => user.id),
    //     },
    //   },
    // });
    await prisma.user.deleteMany({
      where: {
        email: {
          endsWith: '@nbjc.dev',
        },
      },
    });
    clearAllMessage.text = 'Cleaned up previous seeded information';
    clearAllMessage.succeed();
  } catch (err) {
    clearAllMessage.fail(
      `Could not clean up previous seeded information\n\n${err.message}`
    );
    process.exit(1);
  }

  const adminCreateMessage = Ora(`Creating admin user`).start();
  try {
    await prisma.user.create({
      data: {
        email: 'admin@nbjc.dev',
        hashedPassword: hashPassword('password'),
        role: 'admin',
      },
    });
    adminCreateMessage.text = 'Created the admin user.';
    adminCreateMessage.succeed();
  } catch (err) {
    adminCreateMessage.fail(`Creating the admin user failed\n\n${err.message}`);
  }

  const orgUsersCreateMessage = Ora(
    `Creating ${NUMBER_USERS} org users`
  ).start();
  const mockOrgUsers: UserCreateArgs[] = Array(NUMBER_USERS)
    .fill(null)
    .map((_value: null, index: number) => {
      return {
        data: {
          email: `org${index}@nbjc.dev`,
          hashedPassword: hashPassword('password'),
          role: UserRole.organization,
          organization: {},
        },
      };
    });
  try {
    await Promise.all(mockOrgUsers.map(prisma.user.create));
    orgUsersCreateMessage.text = 'Created 10 org users.';
    orgUsersCreateMessage.succeed();
  } catch (err) {
    orgUsersCreateMessage.fail(`Creating org users failed\n\n${err.message}`);
  }

  const modUsersCreateMessage = Ora(
    `Creating ${NUMBER_USERS} org users`
  ).start();
  const mockModUsers: UserCreateArgs[] = Array(NUMBER_USERS)
    .fill(null)
    .map((_value: null, index: number) => {
      return {
        data: {
          email: `mod${index}@nbjc.dev`,
          hashedPassword: hashPassword('password'),
          role: UserRole.moderator,
        },
      };
    });
  try {
    await Promise.all(mockModUsers.map(prisma.user.create));
    modUsersCreateMessage.text = 'Created 10 mod users.';
    modUsersCreateMessage.succeed();
  } catch (err) {
    modUsersCreateMessage.fail(`Creating mod users failed\n\n${err.message}`);
  }

  process.exit(0);
}

seedDatabase();
