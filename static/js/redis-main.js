        let client;
        let allRecords = [];
        let profiles = [];
        let currentMode = 'insert';

        function saveConnection() {
            const profileName = document.getElementById('profileName').value;
            const host = document.getElementById('host').value;
            const port = document.getElementById('port').value;
            const password = document.getElementById('password').value;
            
            const newProfile = { profileName, host, port, password };
            profiles.push(newProfile);
            localStorage.setItem('redisProfiles', JSON.stringify(profiles));
            alert('Profile saved!');
            displayProfiles();
            clearForm();
        }

        function clearForm() {
            document.getElementById('profileName').value = '';
            document.getElementById('host').value = '';
            document.getElementById('port').value = '';
            document.getElementById('password').value = '';
        }

        function displayProfiles() {
            const profileList = document.getElementById('profileList');
            profileList.innerHTML = '<h3>Saved Profiles:</h3>';
            profiles.forEach((profile, index) => {
                const profileItem = document.createElement('div');
                profileItem.className = 'profile-item';
                profileItem.innerHTML = `
                    <span class="profile-name" onclick="loadProfile(${index})">${profile.profileName}</span>
                    <i class="fas fa-trash delete-profile" onclick="deleteProfile(${index})"></i>
                `;
                profileList.appendChild(profileItem);
            });
        }

        function loadProfile(index) {
            const profile = profiles[index];
            document.getElementById('profileName').value = profile.profileName;
            document.getElementById('host').value = profile.host;
            document.getElementById('port').value = profile.port;
            document.getElementById('password').value = profile.password;
        }

        function deleteProfile(index) {
            if (confirm('Are you sure you want to delete this profile?')) {
                profiles.splice(index, 1);
                localStorage.setItem('redisProfiles', JSON.stringify(profiles));
                displayProfiles();
            }
        }

        function testConnection() {
            const host = document.getElementById('host').value;
            const port = document.getElementById('port').value;
            const password = document.getElementById('password').value;

            // In a real-world scenario, you'd want to use a server-side API to test the connection
            // For this example, we'll just simulate a successful connection
            setTimeout(() => {
                alert('Connection test successful!');
            }, 1000);
        }

        function connect() {
            const host = document.getElementById('host').value;
            const port = document.getElementById('port').value;
            const password = document.getElementById('password').value;

            // In a real-world scenario, you'd want to use a server-side API to establish the connection
            // For this example, we'll just simulate a successful connection
            setTimeout(() => {
                document.getElementById('connectionForm').style.display = 'none';
                document.getElementById('recordList').style.display = 'block';
                loadRecords();
            }, 1000);
        }

        function cancel() {
            clearForm();
        }

        function loadRecords() {
            // Simulated records
            allRecords = [
                { key: 'user:1', value: '{"name": "John Doe", "email": "john@example.com"}' },
                { key: 'user:2', value: '{"name": "Jane Smith", "email": "jane@example.com"}' },
                { key: 'product:1', value: '{"name": "Red Widget", "price": 9.99}' },
                { key: 'product:2', value: '{"name": "Blue Gadget", "price": 14.99}' },
                { key: 'order:1', value: '{"user": "user:1", "product": "product:1", "quantity": 2}' }
            ];

            displayRecords(allRecords);
        }

        function displayRecords(records) {
            const recordsContainer = document.getElementById('records');
            recordsContainer.innerHTML = '';

            records.forEach(record => {
                const recordElement = document.createElement('div');
                recordElement.className = 'record-item';
                recordElement.innerHTML = `
                    <input type="checkbox" class="record-checkbox" data-key="${record.key}">
                    <div class="record-content" onclick="showUpdateForm('${record.key}')">
                        <strong>${record.key}:</strong> ${record.value}
                    </div>
                `;
                recordsContainer.appendChild(recordElement);
            });
        }

        function searchRecords() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            
            if (searchTerm === '') {
                displayRecords(allRecords);
                return;
            }

            const filteredRecords = allRecords.filter(record => 
                record.key.toLowerCase().includes(searchTerm) || 
                record.value.toLowerCase().includes(searchTerm)
            );

            displayRecords(filteredRecords);

            // Highlight the search term
            const recordItems = document.querySelectorAll('.record-content');
            recordItems.forEach(item => {
                const regex = new RegExp(searchTerm, 'gi');
                item.innerHTML = item.innerHTML.replace(regex, match => `<span class="highlight">${match}</span>`);
            });
        }

        function showInsertForm() {
            currentMode = 'insert';
            document.getElementById('formTitle').textContent = 'Insert Record';
            document.getElementById('recordKey').value = '';
            document.getElementById('recordValue').value = '';
            document.getElementById('recordForm').style.display = 'block';
        }

        function showUpdateForm(key) {
            currentMode = 'update';
            document.getElementById('formTitle').textContent = 'Update Record';
            const record = allRecords.find(r => r.key === key);
            document.getElementById('recordKey').value = record.key;
            document.getElementById('recordValue').value = record.value;
            document.getElementById('recordForm').style.display = 'block';
        }

        function saveRecord() {
            const key = document.getElementById('recordKey').value;
            const value = document.getElementById('recordValue').value;

            if (key && value) {
                if (currentMode === 'insert') {
                    // In a real-world scenario, you'd want to use a server-side API to insert the record
                    allRecords.push({ key, value });
                    alert(`Record inserted: ${key}`);
                } else {
                    // In a real-world scenario, you'd want to use a server-side API to update the record
                    const index = allRecords.findIndex(record => record.key === key);
                    if (index !== -1) {
                        allRecords[index].value = value;
                        alert(`Record updated: ${key}`);
                    } else {
                        alert(`Record with key ${key} not found.`);
                    }
                }
                displayRecords(allRecords);
                cancelRecordForm();
            } else {
                alert('Both key and value are required.');
            }
        }

        function cancelRecordForm() {
            document.getElementById('recordForm').style.display = 'none';
        }

        function deleteSelectedRecords() {
            const selectedCheckboxes = document.querySelectorAll('.record-checkbox:checked');
            const selectedKeys = Array.from(selectedCheckboxes).map(checkbox => checkbox.dataset.key);

            if (selectedKeys.length === 0) {
                alert('Please select at least one record to delete.');
                return;
            }

            if (confirm(`Are you sure you want to delete ${selectedKeys.length} record(s)?`)) {
                // In a real-world scenario, you'd want to use a server-side API to delete the records
                allRecords = allRecords.filter(record => !selectedKeys.includes(record.key));
                displayRecords(allRecords);
                alert(`${selectedKeys.length} record(s) deleted.`);
            }
        }

        // Load saved profiles on page load
        window.onload = function() {
            const savedProfiles = localStorage.getItem('redisProfiles');
            if (savedProfiles) {
                profiles = JSON.parse(savedProfiles);
                displayProfiles();
            }
        };
