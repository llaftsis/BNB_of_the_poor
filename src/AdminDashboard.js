import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users from the server.
        fetch('https://localhost:5000/api/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    function jsonToXml(jsonObj) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';
    
        for (const [key, values] of Object.entries(jsonObj)) {
            xml += `  <${key}>\n`;
            for (const value of values) {
                xml += `    <item>\n`;
                for (const [subKey, subValue] of Object.entries(value)) {
                    xml += `      <${subKey}>${subValue}</${subKey}>\n`;
                }
                xml += `    </item>\n`;
            }
            xml += `  </${key}>\n`;
        }
        xml += '</root>';
        return xml;
    }

    const handleExportData = async (format) => {
        const response = await fetch('https://localhost:5000/api/export-data');
        const data = await response.json();
        let blob;
        let fileName;
        if (format === 'json') {
            blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            fileName = 'data.json';
        } else if (format === 'xml') {
            const xml = jsonToXml(data);
            blob = new Blob([xml], { type: 'application/xml' });
            fileName = 'data.xml';
        }
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h2>Διαχείριση Χρηστών</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                    <Link to={`/user-details/${user.id}`}>{user.username}</Link></li>
                ))}
            </ul>
            <button onClick={() => handleExportData('json')}>Εξαγωγή σε JSON</button>
            <button onClick={() => handleExportData('xml')}>Εξαγωγή σε XML</button>

        </div>
    );

}

export default AdminDashboard;
