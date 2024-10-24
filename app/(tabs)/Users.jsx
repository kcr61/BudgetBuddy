import { useState } from 'react';

function User() {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [username, setUsername] = useState("");

    const click = async (e) => {
        e.preventDefault();

        // Basic validation
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

            console.log("New User added");
            alert("User added successfully!");

            // Reset form fields after successful submission
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
        <div className="User">
            <h5>First Name</h5>
            <input
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={first_name}
                required // Optional: makes the field required
            />
            <br />
            <h5>Last Name</h5>
            <input
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={last_name}
                required // Optional: makes the field required
            />
            <br />
            <h5>Age</h5>
            <input
                type="number"
                onChange={(e) => setAge(e.target.value)}
                value={age}
                required // Optional: makes the field required
            />
            <br />
            <h5>Username</h5>
            <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                required // Optional: makes the field required
            />
            <br /><br />
            <button onClick={click}>Submit</button>
        </div>
    );
}

export default User;