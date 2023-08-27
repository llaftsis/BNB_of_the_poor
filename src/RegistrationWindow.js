import React, { useState } from 'react';

function RegistrationWindow() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Οί κωδικοί πρόσβασης δεν ταιριάζουν!");
            return;
        }

        if (phone.length !== 10) {
            alert("Το τηλέφωνο πρέπει να έχει ακριβώς 10 ψηφία");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    firstName,
                    lastName,
                    phone,
                    role
                })
            });

            const data = await response.json();

            if (data.success) {
                if (role === 'Οικοδεσπότης') {
                    alert("Ή αίτηση εγγραφής σας ως Οικοδεσπότης εκκρεμεί έγκριση.");
                } else {
                    alert("Εγγραφή επιτυχής!");
                }
            } else {
                alert("Κάτι πήγε στραβά. Δοκιμάστε ξανά.");
            }
        } catch (error) {
            alert("Σφάλμα κατά την εγγραφή. Δοκιμάστε ξανά αργότερα.");
        }
    };
    

    return (
        <div className="registration-window">
            <h2>Εγγραφή</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Όνομα Χρήστη"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Κωδικός Πρόσβασης"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Επιβεβαίωση Κωδικού"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Όνομα"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Επώνυμο"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="tel"
                    placeholder="Τηλέφωνο"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="" disabled>Επιλέξτε Ρόλο</option>
                    <option value="Ενοικιαστής">Ενοικιαστής</option>
                    <option value="Οικοδεσπότης">Οικοδεσπότης</option>
                </select>
                <button type="submit">Εγγραφή</button>
            </form>
        </div>
    );
}

export default RegistrationWindow;
