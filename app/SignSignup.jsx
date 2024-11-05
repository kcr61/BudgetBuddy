import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const SignInSignUpScreen = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [username, setUsername] = useState('');

  // Trigger Face ID 
  useEffect(() => {
    if (!isSignUp) {
      handleFaceIDAuth();
    }
  }, [isSignUp]);

  const handleFaceIDAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert("Error", "Face ID is not supported on this device.");
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert("Error", "No Face ID or biometric enrolled.");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Please authenticate to sign in",
        fallbackLabel: "Use Passcode",
        disableDeviceFallback: false,
      });

      if (result.success) {
        Alert.alert("Success", "Authentication Successful!");
        onAuthSuccess();
      } else {
        Alert.alert("Authentication Failed", "Please try again.");
      }
    } catch (error) {
      console.error("Error with Face ID authentication:", error);
      Alert.alert("Error", "An error occurred with Face ID authentication.");
    }
  };

  const handleAuth = async () => {
    if (isSignUp) {
      // Validation for sign up
      if (!email || !password || !firstName || !lastName || !age || !username) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }

      const user = {
        first_name: firstName,
        last_name: lastName,
        age: parseInt(age),
        username,
        email,
        password,
      };

      try {
        const response = await fetch("http://localhost:3000/api/user/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        Alert.alert("Success", "User registered successfully!");
        onAuthSuccess();

        setFirstName("");
        setLastName("");
        setAge("");
        setUsername("");
        setEmail("");
        setPassword("");
      } catch (error) {
        console.error("Error registering user:", error);
        Alert.alert("Error", "There was an error registering the user.");
      }
    } else {
      // Handle sign in
      if (!email || !password) {
        Alert.alert("Error", "Please enter both email and password.");
        return;
      }
      handleFaceIDAuth();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {isSignUp && (
        <>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
        </>
      )}

      <Button title={isSignUp ? 'Sign Up' : 'Sign In'} onPress={handleAuth} />
      <Button
        title={isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
        onPress={() => setIsSignUp(!isSignUp)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#036704',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
  },
});

export default SignInSignUpScreen;
