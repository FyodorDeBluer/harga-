document.addEventListener('DOMContentLoaded', () => {
    fetch('data.xml')
        .then(response => response.text())
        .then(xml => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, 'text/xml');
            const items = xmlDoc.getElementsByTagName('PosItem');

            document.getElementById('searchInput').addEventListener('input', function() {
                const query = this.value.toLowerCase();
                const filteredData = [];

                for (let i = 0; i < items.length; i++) {
                    const namaBarang = items[i].getElementsByTagName('Name')[0].textContent.toLowerCase();
                    if (namaBarang.includes(query)) {
                        const harga = parseFloat(items[i].getElementsByTagName('Price')[0].textContent);
                        filteredData.push({ 'Nama Barang': namaBarang, 'Harga': harga });
                    }
                }

                displayTable(filteredData);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

function displayTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="2">Tidak ada hasil pencarian</td></tr>';
        return;
    }

    data.forEach(item => {
        const tr = document.createElement('tr');
        const tdNama = document.createElement('td');
        const tdHarga = document.createElement('td');

        tdNama.textContent = item['Nama Barang'];
        tdHarga.textContent = item['Harga'];

        tr.appendChild(tdNama);
        tr.appendChild(tdHarga);
        tableBody.appendChild(tr);
    });
}
