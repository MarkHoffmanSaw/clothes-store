import { errorPrefix } from '@firebase/util';
import { useState } from 'react';

import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from '../../utils/firebase/firebase.utils';

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);

  const { displayName, email, password, confirmPassword } = formFields;

  console.log(formFields);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords are not the same!');
      return;
    }

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      const userDocRef = await createUserDocumentFromAuth({
        ...user,
        displayName,
      });

      resetFormFields();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('The user with that email already exists');
      } else {
        alert(error.message);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target; // from the tag

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div>
      <h1>Sign up with your email and password</h1>
      <form onSubmit={handleSubmit}>
        <label>Display name</label>
        <input
          type="text"
          required
          onChange={handleChange}
          name="displayName"
          value={displayName}
        />

        <label>Email</label>
        <input
          type="email"
          required
          onChange={handleChange}
          name="email"
          value={email}
        />

        <label>Password</label>
        <input
          type="password"
          required
          onChange={handleChange}
          name="password"
          value={password}
          minLength="6"
        />

        <label>Confirm password</label>
        <input
          type="password"
          required
          onChange={handleChange}
          name="confirmPassword"
          value={confirmPassword}
          minLength="6"
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;