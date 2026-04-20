export const config = {
  // demoqa выдаёт токен только пользователям, зарегистрированным через UI.
  // Юзеры, созданные через API, авторизацию не проходят — баг площадки.
  existingUser: {
    userName: process.env.TEST_USER ?? 'testuser_probe',
    password: process.env.TEST_PASSWORD ?? 'Test@1234',
    userId: process.env.TEST_USER_ID ?? '345e115e-3d26-410e-a47f-781961b30b8b',
  },
};
