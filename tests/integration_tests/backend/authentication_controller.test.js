import bent from 'bent'
import { connect, clearDatabase, closeDatabase } from '../../db_handler';

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

  test('Register user', async () => {

    const post = bent('http://localhost:12032/', 'POST', 'json', 200);
    const body = {
      firstname: 'Test',
      email: 'testing@gmail.local',
      password: 'TestPassword123!', 
      repeated_password: 'TestPassword123!',
      role: 'student',
      accept_conditions: true,
      accept_research: true
    };
    const res = await post('register', body);
  
    // Searches the user in the database
    const user = await User.findOne({ email: 'testing@gmail.local' })
    expect(user.firstname).toBeTruthy()
    expect(user.email).toBeTruthy()
  
    done()
  });

  test('Login user', async () => {
    
  });
});