import { connect, clearDatabase, closeDatabase } from '../../../db_handler';
import Useritem from '../../../../backend/models/user_model';

describe('Adding users', () => {

  /**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await connect());

/**
* Clear all test data after every test.
*/
afterEach(async () => await clearDatabase());

/**
* Remove and close the db and server.
*/
afterAll(async () => await closeDatabase());

  test('Insert new user', async () => {
    //const users = db.collection('users');

    const userData = {
        firstname: 'Dwenguino', 
        email: 'noreply@dwengo.org', 
        password: 'fLEtMTypULFdxydG', 
        acceptGeneralConditions: true, 
        acceptResearchConditions: true 
    };

    const validUser = new Useritem(userData);
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.firstname).toBe(userData.firstname);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
    expect(savedUser.acceptGeneralConditions).toBe(userData.acceptGeneralConditions);
    expect(savedUser.acceptResearchConditions).toBe(userData.acceptResearchConditions);

    expect(savedUser.role).toEqual('student');
    expect(savedUser.status).toEqual('pending');
    expect(savedUser.dateCreated).toBeDefined();
    expect(savedUser.acceptGeneralconditionsTimestamp).toBeDefined();
    expect(savedUser.acceptResearchConditionsTimestamp).toBeDefined();

  });

  test('Insert two users with same email address', async () => {
    const userData = {
      firstname: 'Dwenguino', 
      email: 'noreply@dwengo.org', 
      password: 'fLEtMTypULFdxydG', 
      acceptGeneralConditions: true, 
      acceptResearchConditions: true 
    };

    const userData2 = {
      firstname: 'Dwenguino2', 
      email: 'noreply@dwengo.org', 
      password: 'fLEtMTypULFdxydG', 
      acceptGeneralConditions: true, 
      acceptResearchConditions: true 
    }

    const validUser = new Useritem(userData);
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.firstname).toBe(userData.firstname);
    expect(savedUser.email).toBe(userData.email);

    const validUser2 = new Useritem(userData2);

    await expect(validUser2.save()).rejects.toThrow();
  });
});