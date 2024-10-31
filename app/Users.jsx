import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

function User() {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [username, setUsername] = useState("");

    const click = async () => {
        // Basic validation
        if (!first_name || !last_name || !age || !username) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        const user = { first_name, last_name, age: parseInt(age), username };

        try {
            const response = await fetch("http://localhost:3000/api/user/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log("New User added");
            Alert.alert("Success", "User added successfully!");

            // Reset form fields after successful submission
            setFirstName("");
            setLastName("");
            setAge("");
            setUsername("");

        } catch (error) {
            console.error("Error adding user:", error);
            Alert.alert("Error", "There was an error adding the user.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
                style={styles.input}
                onChangeText={setFirstName}
                value={first_name}
                placeholder="Enter first name"
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
                style={styles.input}
                onChangeText={setLastName}
                value={last_name}
                placeholder="Enter last name"
            />

            <Text style={styles.label}>Age</Text>
            <TextInput
                style={styles.input}
                onChangeText={setAge}
                value={age}
                placeholder="Enter age"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Username</Text>
            <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Enter username"
            />

            <Button title="Submit" onPress={click} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default User;