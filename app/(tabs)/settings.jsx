import React, { useState } from 'react';
import { View, Text, Switch, TextInput, StyleSheet, Modal, Pressable, TouchableOpacity } from 'react-native';

const SettingsScreen = () => {
  // User Preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  // Account Information
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  // App Settings
  const [language, setLanguage] = useState('English');
  const [textSize, setTextSize] = useState('Medium');
  const [highContrast, setHighContrast] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [textSizeModalVisible, setTextSizeModalVisible] = useState(false);

  const languages = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Russian", "Italian", "Portuguese", "Arabic", "Turkish"];
  const textSizes = ["Small", "Medium", "Large"];

  const handleSaveSettings = () => {
    setModalVisible(true);
  };

  const handleLogout = () => {
    alert('Logged out!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.switchContainer}>
        <Text style={styles.textWhite}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      {notificationsEnabled && (
        <>
          <View style={styles.switchContainer}>
            <Text style={styles.textWhite}>Email Notifications</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.textWhite}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
            />
          </View>
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
      />

      {/* Language Picker */}
      <TouchableOpacity style={styles.pickerContainer} onPress={() => setLanguageModalVisible(true)}>
        <Text style={styles.textWhite}>Language: {language}</Text>
      </TouchableOpacity>
      
      <Modal visible={languageModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {languages.map((lang) => (
              <Pressable key={lang} onPress={() => { setLanguage(lang); setLanguageModalVisible(false); }} style={styles.option}>
                <Text style={styles.textWhite}>{lang}</Text>
              </Pressable>
            ))}
            <Pressable style={styles.modalButton} onPress={() => setLanguageModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Text Size Picker */}
      <TouchableOpacity style={styles.pickerContainer} onPress={() => setTextSizeModalVisible(true)}>
        <Text style={styles.textWhite}>Text Size: {textSize}</Text>
      </TouchableOpacity>
      
      <Modal visible={textSizeModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {textSizes.map((size) => (
              <Pressable key={size} onPress={() => { setTextSize(size); setTextSizeModalVisible(false); }} style={styles.option}>
                <Text style={styles.textWhite}>{size}</Text>
              </Pressable>
            ))}
            <Pressable style={styles.modalButton} onPress={() => setTextSizeModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={styles.switchContainer}>
        <Text style={styles.textWhite}>High Contrast</Text>
        <Switch
          value={highContrast}
          onValueChange={setHighContrast}
        />
      </View>

      {/* Save Settings Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
        <Text style={styles.buttonText}>Save Settings</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {/* Save Confirmation */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Settings have been saved.</Text>
            <Pressable style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#036704',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#eee',
    color: 'black',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  pickerContainer: {
    padding: 10,
    backgroundColor: '#555',
    borderRadius: 5,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white',
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
  },
  textWhite: {
    color: 'white',
  },
  option: {
    paddingVertical: 20,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
