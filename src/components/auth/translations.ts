
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
