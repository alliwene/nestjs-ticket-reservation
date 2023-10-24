describe('Reservations', () => {
  let accessToken: string;
  let ceratedReservation: { _id: string; [key: string]: any };

  beforeAll(async () => {
    const user = {
      email: 'test@email.com',
      password: 'StrongPassword!@123',
    };

    // await fetch('http://auth:3001/users', {
    //   method: 'POST',
    //   body: JSON.stringify(user),
    //   headers: { 'Content-Type': 'application/json' },
    // });

    const response = await fetch('http://auth:3001/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });

    ({ accessToken } = await response.json());
  });

  test('Create Reservation', async () => {
    const reservationBody = {
      startDate: '12/20/2022',
      endDate: '12/20/2022',
      placeId: '1024',
      invoiceId: '419',
      charge: {
        amount: 130,
      },
    };

    const response = await fetch('http://reservations:3000/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationBody),
      headers: {
        'Content-Type': 'application/json',
        Authentication: accessToken,
      },
    });

    expect(response.ok).toBeTruthy();

    ceratedReservation = await response.json();
  }, 60000);

  test('Get Reservation', async () => {
    const response = await fetch(
      `http://reservations:3000/reservations/${ceratedReservation._id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authentication: accessToken,
        },
      },
    );

    const reservation = await response.json();
    expect(ceratedReservation).toEqual(reservation);
  });
});
