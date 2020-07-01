import React, { useRef, useCallback } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
} from './styles';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { goBack } = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const emailUserRef = useRef<TextInput>(null);
  const oldPasswordUserRef = useRef<TextInput>(null);
  const passwordUserRef = useRef<TextInput>(null);
  const passwordConfirmationUserRef = useRef<TextInput>(null);

  const navigateCallBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione uma foto',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar câmera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert('Erro ao atualizar seu avatar');
          return;
        }

        const { uri, type } = response;

        const data = new FormData();

        data.append('avatar', {
          type,
          name: `${user.id}.${type ? type.split('/')[1] : 'jpeg'}`,
          uri,
        });

        api.patch('users/avatar', data).then(apiResponse => {
          updateUser(apiResponse.data);
        });
      },
    );
  }, [user.id, updateUser]);

  const handleProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string()
            .when('old_password', {
              is: val => (val ? !!val.length : false),
              then: Yup.string().required('Nova senha é obrigatório'),
            })
            .test('len', 'No mínimo 6 dígitos', val =>
              val ? val.length === 0 || val.length > 5 : true,
            ),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => (val ? !!val.length : false),
              then: Yup.string().required('Confirmação de senha é obrigatório'),
            })
            .oneOf(
              [Yup.ref('password'), null],
              'Confirmação e senha não conferem',
            ),
        });

        await schema.validate(data, { abortEarly: false });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        await updateUser(response.data);

        Alert.alert('Perfil atualizado!');

        goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um error ao atualizar seu perfil, tente novamente.',
        );
      }
    },
    [updateUser, goBack],
  );

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }}>
      <Container>
        <BackButton onPress={navigateCallBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <UserAvatarButton onPress={handleUpdateAvatar}>
          <UserAvatar source={{ uri: user.avatar_url }} />
        </UserAvatarButton>

        <View>
          <Title>Meu Perfil</Title>
        </View>
        <Form ref={formRef} initialData={user} onSubmit={handleProfile}>
          <Input
            name="name"
            autoCapitalize="words"
            icon="user"
            placeholder="Nome"
            returnKeyType="next"
            onSubmitEditing={() => {
              emailUserRef.current?.focus();
            }}
          />
          <Input
            ref={emailUserRef}
            name="email"
            autoCorrect={false}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail"
            placeholder="E-mail"
            returnKeyType="next"
            onSubmitEditing={() => {
              oldPasswordUserRef.current?.focus();
            }}
          />
          <Input
            ref={oldPasswordUserRef}
            name="old_password"
            secureTextEntry
            icon="lock"
            placeholder="Senha atual"
            textContentType="newPassword"
            returnKeyType="next"
            containerStyle={{ marginTop: 16 }}
            onSubmitEditing={() => {
              passwordUserRef.current?.focus();
            }}
          />
          <Input
            ref={passwordUserRef}
            name="password"
            secureTextEntry
            icon="lock"
            placeholder=" Nova senha"
            textContentType="newPassword"
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordConfirmationUserRef.current?.focus();
            }}
          />
          <Input
            ref={passwordConfirmationUserRef}
            name="password_confirmation"
            secureTextEntry
            icon="lock"
            placeholder="Confirmação de senha"
            textContentType="newPassword"
            returnKeyType="send"
            onSubmitEditing={() => {
              formRef.current?.submitForm();
            }}
          />

          <Button
            onPress={() => {
              formRef.current?.submitForm();
            }}
          >
            Confirmar Mudanças
          </Button>
        </Form>
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Profile;
