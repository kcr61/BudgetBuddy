import { useState } from 'react';

function Profile() {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [username, setUsername] = useState("");

    const click = async (e) => {
        e.preventDefault();

        if (!first_name || !last_name || !age || !username) {
            alert("Please fill in all fields.");
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

            alert("User added successfully!");
            setFirstName("");
            setLastName("");
            setAge("");
            setUsername("");

        } catch (error) {
            console.error("Error adding user:", error);
            alert("There was an error adding the user.");
        }
    };

    return (
        <div className="Profile" style={{ backgroundColor: '#036704', padding: '20px', borderRadius: '10px' }}>
            <h1 style={{ color: '#fff', marginBottom: '20px' }}>Profile</h1>
            <form onSubmit={click}>
                <label style={styles.label}>
                    First Name:
                    <input
                        type="text"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={first_name}
                        required
                        style={styles.input}
                    />
                </label>
                <label style={styles.label}>
                    Last Name:
                    <input
                        type="text"
                        onChange={(e) => setLastName(e.target.value)}
                        value={last_name}
                        required
                        style={styles.input}
                    />
                </label>
                <label style={styles.label}>
                    Age:
                    <input
                        type="number"
                        onChange={(e) => setAge(e.target.value)}
                        value={age}
                        required
                        style={styles.input}
                    />
                </label>
                <label style={styles.label}>
                    Username:
                    <input
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        required
                        style={styles.input}
                    />
                </label>
                <button type="submit" style={styles.button}>Submit</button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#036704',
        borderRadius: '10px',
    },
    label: {
        color: '#fff',
        marginBottom: '10px',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderWidth: '1px',
        borderColor: '#ccc',
        borderRadius: '5px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    }
    
};

export default Profile;