import React from 'react';
import { render } from 'react-native-testing-library';
import SignIn from '../../pages/SignIn';

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(),
  };
});

describe('SignIn Page', () => {
  it('Should be able to signin', async () => {
    const { getByPlaceholder, getByText } = render(<SignIn />);

    const emailField = getByPlaceholder('E-mail');
    const emailPasswordField = getByPlaceholder('Senha');
    const buttonElement = getByText('Entrar');

    expect(emailField).toBeTruthy();
    expect(emailPasswordField).toBeTruthy();
    expect(buttonElement).toBeTruthy();
  });
});
