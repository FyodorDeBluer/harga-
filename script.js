document.addEventListener('DOMContentLoaded', () => {
    const items = [];
    const correctPassword = 'KJ434';
    let editIndex = -1;

    fetch('data.xml')
        .then(response => response.text())
        .then(xml => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, 'text/xml');
            const xmlItems = xmlDoc.getElementsByTagName('PosItem');

            for (let i = 0; i < xmlItems.length; i++) {
                const namaBarang = xmlItems[i].getElementsByTagName('Name')[0].textContent;
                const harga = parseFloat(xmlItems[i].getElementsByTagName('Price')[0].textContent);
                items.push({ 'Nama Barang': namaBarang, 'Harga': harga });
            }

            document.getElementById('searchInput').addEventListener('input', function() {
                const query = this.value.toLowerCase();
                const filteredData = items.filter(item => item['Nama Barang'].toLowerCase().includes(query));
                displayTable(filteredData);
            });

            displayTable(items);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    document.getElementById('addItemForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const itemName = document.getElementById('itemName').value;
        const itemPrice = parseFloat(document.getElementById('itemPrice').value);
        const password = document.getElementById('addItemPassword').value;

        if (password === correctPassword) {
            items.push({ 'Nama Barang': itemName, 'Harga': itemPrice });
            displayTable(items);
            this.reset();
        } else {
            alert('Password salah!');
        }
    });

    document.getElementById('editItemForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const itemName = document.getElementById('editItemName').value;
        const itemPrice = parseFloat(document.getElementById('editItemPrice').value);
        const password = document.getElementById('editItemPassword').value;

        if (password === correctPassword) {
            items[editIndex]['Nama Barang'] = itemName;
            items[editIndex]['Harga'] = itemPrice;
            displayTable(items);
            closeModal();
        } else {
            alert('Password salah!');
        }
    });

    function displayTable(data) {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3">Tidak ada hasil pencarian</td></tr>';
            return;
        }

        data.forEach((item, index) => {
            const tr = document.createElement('tr');
            const tdNama = document.createElement('td');
            const tdHarga = document.createElement('td');
            const tdAksi = document.createElement('td');
            const deleteButton = document.createElement('button');
            const editButton = document.createElement('button');

            tdNama.textContent = item['Nama Barang'];
            tdHarga.textContent = item['Harga'];
            deleteButton.textContent = 'Hapus';
            editButton.textContent = 'Edit';
            editButton.classList.add('edit'); // Pastikan tombol edit menggunakan kelas edit

            deleteButton.addEventListener('click', () => {
                const password = prompt('Masukkan password untuk menghapus barang:');
                if (password === correctPassword) {
                    data.splice(index, 1);
                    displayTable(data);
                } else {
                    alert('Password salah!');
                }
            });

            editButton.addEventListener('click', () => openModal(item, index));

            tdAksi.appendChild(editButton);
            tdAksi.appendChild(deleteButton);
            tr.appendChild(tdNama);
            tr.appendChild(tdHarga);
            tr.appendChild(tdAksi);
            tableBody.appendChild(tr);
        });
    }

    function openModal(item, index) {
        const modal = document.getElementById('editModal');
        const closeBtn = modal.querySelector('.close');
        const editItemName = document.getElementById('editItemName');
        const editItemPrice = document.getElementById('editItemPrice');
        const editItemPassword = document.getElementById('editItemPassword');

        editItemName.value = item['Nama Barang'];
        editItemPrice.value = item['Harga'];
        editIndex = index;

        modal.style.display = 'block';

        closeBtn.addEventListener('click', closeModal);

        window.onclick = function(event) {
            if (event.target === modal) {
                closeModal();
            }
        };
    }

    function closeModal() {
        const modal = document.getElementById('editModal');
        modal.style.display = 'none';
    }
});
