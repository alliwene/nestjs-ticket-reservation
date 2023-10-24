describe('Reservations', () => {
  beforeAll(async () => {
    const user = {
      email: 'test@email.com',
      password: 'StrongPassword!@123',
    };
    await fetch('http://auth:3001', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  });

  test('Create Reservation', () => {});
});
