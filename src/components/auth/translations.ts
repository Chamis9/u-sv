
export const getLoginTranslations = (languageCode: string) => {
  switch (languageCode) {
    case 'lv':
      return {
        title: 'Lietotāja konts',
        loginDescription: 'Pieslēdzieties savam kontam vai reģistrējieties, lai turpinātu.',
        login: 'Pieslēgties',
        loginLoading: 'Pieslēdzas...',
        register: 'Reģistrēties',
        registrationLoading: 'Reģistrējas...',
        email: 'E-pasta adrese',
        password: 'Parole',
        forgotPassword: 'Aizmirsi paroli?',
        resetPasswordSent: 'Paroles atjaunošanas saite nosūtīta uz jūsu e-pastu.',
        invalidCredentials: 'Nepareiza e-pasta adrese vai parole.',
        passwordMinLength: 'Parolei jāsatur vismaz 8 rakstzīmes',
        firstName: 'Vārds',
        lastName: 'Uzvārds',
        phoneNumber: 'Telefona numurs',
        countryCode: 'Valsts kods',
        confirmPassword: 'Apstiprināt paroli',
        passwordsDoNotMatch: 'Paroles nesakrīt',
        registrationSuccess: 'Reģistrācija veiksmīga! Lūdzu, pārbaudiet savu e-pastu, lai apstiprinātu kontu.',
        registrationError: 'Neizdevās reģistrēties. Lūdzu, mēģiniet vēlreiz.',
        alreadyHaveAccount: 'Jau ir konts?',
        dontHaveAccount: 'Nav konta?',
        optional: '(neobligāts)',
        termsAndConditions: 'Es piekrītu lietošanas noteikumiem un privātuma politikai.',
        acceptTerms: 'Lai turpinātu, jums jāpiekrīt noteikumiem un nosacījumiem.'
      };
    case 'ru':
      return {
        title: 'Аккаунт пользователя',
        loginDescription: 'Войдите в свою учетную запись или зарегистрируйтесь, чтобы продолжить.',
        login: 'Войти',
        loginLoading: 'Вход...',
        register: 'Зарегистрироваться',
        registrationLoading: 'Регистрация...',
        email: 'Электронная почта',
        password: 'Пароль',
        forgotPassword: 'Забыли пароль?',
        resetPasswordSent: 'Ссылка для сброса пароля отправлена на вашу электронную почту.',
        invalidCredentials: 'Неверный адрес электронной почты или пароль.',
        passwordMinLength: 'Пароль должен содержать не менее 8 символов',
        firstName: 'Имя',
        lastName: 'Фамилия',
        phoneNumber: 'Номер телефона',
        countryCode: 'Код страны',
        confirmPassword: 'Подтвердите пароль',
        passwordsDoNotMatch: 'Пароли не совпадают',
        registrationSuccess: 'Регистрация успешна! Пожалуйста, проверьте свою электронную почту, чтобы подтвердить аккаунт.',
        registrationError: 'Не удалось зарегистрироваться. Пожалуйста, попробуйте еще раз.',
        alreadyHaveAccount: 'Уже есть аккаунт?',
        dontHaveAccount: 'Нет аккаунта?',
        optional: '(необязательно)',
        termsAndConditions: 'Я согласен с условиями использования и политикой конфиденциальности.',
        acceptTerms: 'Чтобы продолжить, вы должны согласиться с условиями.'
      };
    default: // English
      return {
        title: 'User Account',
        loginDescription: 'Sign in to your account or register to continue.',
        login: 'Sign In',
        loginLoading: 'Signing in...',
        register: 'Register',
        registrationLoading: 'Registering...',
        email: 'Email',
        password: 'Password',
        forgotPassword: 'Forgot Password?',
        resetPasswordSent: 'Password reset link sent to your email.',
        invalidCredentials: 'Invalid email or password.',
        passwordMinLength: 'Password must be at least 8 characters',
        firstName: 'First Name',
        lastName: 'Last Name',
        phoneNumber: 'Phone Number',
        countryCode: 'Country Code',
        confirmPassword: 'Confirm Password',
        passwordsDoNotMatch: 'Passwords do not match',
        registrationSuccess: 'Registration successful! Please check your email to confirm your account.',
        registrationError: 'Failed to register. Please try again.',
        alreadyHaveAccount: 'Already have an account?',
        dontHaveAccount: "Don't have an account?",
        optional: '(optional)',
        termsAndConditions: 'I agree to the Terms of Service and Privacy Policy.',
        acceptTerms: 'You must agree to the terms and conditions to continue.'
      };
  }
};
