
export function getLoginTranslations(language: string) {
  if (language === 'lv') {
    return {
      title: 'Lietotāja konts',
      login: 'Ielogoties',
      register: 'Reģistrēties',
      email: 'E-pasts',
      password: 'Parole',
      confirmPassword: 'Apstiprini paroli',
      forgotPassword: 'Aizmirsi paroli?',
      firstName: 'Vārds',
      lastName: 'Uzvārds',
      phoneNumber: 'Telefona numurs',
      loginDescription: 'Ielogojies vai izveido jaunu kontu',
      invalidCredentials: 'Nepareizs e-pasts vai parole',
      resetPasswordSent: 'Norādījumi paroles atjaunošanai nosūtīti uz e-pastu',
      registrationError: 'Reģistrācijas kļūda',
      registrationSuccess: 'Reģistrācija veiksmīga! Lūdzu, pārbaudiet savu e-pastu.',
      loginLoading: 'Notiek ielogošanās...',
      registrationLoading: 'Notiek reģistrācija...',
      passwordMismatch: 'Paroles nesakrīt',
      invalidEmail: 'Lūdzu, ievadiet derīgu e-pasta adresi',
      requiredField: 'Šis lauks ir obligāts',
      passwordTooShort: 'Parolei jābūt vismaz 6 simbolus garai',
      phoneOptional: '(neobligāts)',
      countryCode: 'Valsts kods',
      loginSuccess: 'Veiksmīga ielogošanās!'
    };
  }
  
  if (language === 'ru') {
    return {
      title: 'Учетная запись',
      login: 'Войти',
      register: 'Зарегистрироваться',
      email: 'Электронная почта',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      forgotPassword: 'Забыли пароль?',
      firstName: 'Имя',
      lastName: 'Фамилия',
      phoneNumber: 'Телефонный номер',
      loginDescription: 'Войдите или создайте новую учетную запись',
      invalidCredentials: 'Неверный email или пароль',
      resetPasswordSent: 'Инструкция по сбросу пароля отправлена на ваш email',
      registrationError: 'Ошибка регистрации',
      registrationSuccess: 'Регистрация успешна! Пожалуйста, проверьте свою электронную почту.',
      loginLoading: 'Выполняется вход...',
      registrationLoading: 'Выполняется регистрация...',
      passwordMismatch: 'Пароли не совпадают',
      invalidEmail: 'Пожалуйста, введите корректный email',
      requiredField: 'Это поле обязательно',
      passwordTooShort: 'Пароль должен содержать не менее 6 символов',
      phoneOptional: '(необязательно)',
      countryCode: 'Код страны',
      loginSuccess: 'Вход выполнен успешно!'
    };
  }
  
  // English (default)
  return {
    title: 'User Account',
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot password?',
    firstName: 'First Name',
    lastName: 'Last Name',
    phoneNumber: 'Phone Number',
    loginDescription: 'Login or create a new account',
    invalidCredentials: 'Invalid email or password',
    resetPasswordSent: 'Password reset instructions sent to your email',
    registrationError: 'Registration error',
    registrationSuccess: 'Registration successful! Please check your email.',
    loginLoading: 'Logging in...',
    registrationLoading: 'Registering...',
    passwordMismatch: 'Passwords do not match',
    invalidEmail: 'Please enter a valid email address',
    requiredField: 'This field is required',
    passwordTooShort: 'Password must be at least 6 characters long',
    phoneOptional: '(optional)',
    countryCode: 'Country Code',
    loginSuccess: 'Successfully logged in!'
  };
}
