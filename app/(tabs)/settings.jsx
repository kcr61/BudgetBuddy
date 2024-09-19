import React, { useState } from 'react';
import { View, Text, Switch, TextInput, Button, StyleSheet, Modal, Pressable, Picker } from 'react-native';

const SettingsScreen = () => {
  // User Preferences
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  const handleSaveSettings = () => {
    // Save settings
    setModalVisible(true);
  };

  const handleLogout = () => {
    alert('Logged out!');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Settings</Text>

      {/* User Preferences */}
      <View style={styles.switchContainer}>
        <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      {notificationsEnabled && (
        <>
          <View style={styles.switchContainer}>
            <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Email Notifications</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
            />
          </View>
        </>
      )}

      {}
      <TextInput
        style={[styles.input, { color: isDarkMode ? '#fff' : '#000', backgroundColor: isDarkMode ? '#444' : '#eee' }]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={[styles.input, { color: isDarkMode ? '#fff' : '#000', backgroundColor: isDarkMode ? '#444' : '#eee' }]}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
      />

      {}
      <View style={styles.pickerContainer}>
        <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Language</Text>
        <Picker
          selectedValue={language}
          onValueChange={(itemValue) => setLanguage(itemValue)}
        >
          <Picker.Item label="English" value="English" />
          <Picker.Item label="Spanish" value="Spanish" />
          <Picker.Item label="French" value="French" />
          <Picker.Item label="German" value="German" />
          <Picker.Item label="Chinese" value="Chinese (Simplified)" />
          <Picker.Item label="Japanese" value="Japanese" />
          <Picker.Item label="Korean" value="Korean" />
          <Picker.Item label="Russian" value="Russian" />
          <Picker.Item label="Italian" value="Italian" />
          <Picker.Item label="Portuguese" value="Portuguese" />
          <Picker.Item label="Arabic" value="Arabic" />
          <Picker.Item label="Turkish" value="Turkish" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Text Size</Text>
        <Picker
          selectedValue={textSize}
          onValueChange={(itemValue) => setTextSize(itemValue)}
        >
          <Picker.Item label="Small" value="Small" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="Large" value="Large" />
        </Picker>
      </View>

      <View style={styles.switchContainer}>
        <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>High Contrast</Text>
        <Switch
          value={highContrast}
          onValueChange={setHighContrast}
        />
      </View>

      <Button title="Save Settings" onPress={handleSaveSettings} />

      <Button title="Logout" color="#ff4d4d" onPress={handleLogout} />

      {/*Save Confirmation */}
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
    backgroundColor: '#8aecc7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  pickerContainer: {
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
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
  },
});

export default SettingsScreen;
