const endpoint = "http://localhost:5000/files";
const buttonSubmit = document.querySelector(".input-submit");
const buttonDelete = document.querySelector(".button-delete");

const showData = (f) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <tr class="pt-3">
      <th scope="row">${f.urutan}</th>
      <td class="file-name">
      <button type="button" class="btn active btn-sm button-download" data-bs-toggle="button" aria-pressed="true" data-hashed-filename=${f.file}>${f.nama_file}</button>
      </td>
      <td class="d-flex gap-4 justify-content-center align-items-center">
      <div class="input-group mb-3 w-25">
      <input type="number" class="form-control new-urutan" placeholder="Ubah Urutan" data-id=${f.id}/>
      </div>
      
      <button type="button" class="btn btn-danger button-delete" data-id=${f.id}>Delete</button>
      </td>
    </tr>
  `;

  const newUrutanInput = row.querySelector(".new-urutan");

  newUrutanInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const idToUpdate = newUrutanInput.getAttribute("data-id");
      const newUrutan = newUrutanInput.value;
      updateUrutan(idToUpdate, newUrutan, row);
    }
  });

  const deleteButton = row.querySelector(".button-delete");
  deleteButton.addEventListener("click", () => {
    const idToDelete = deleteButton.getAttribute("data-id");
    deleteData(idToDelete);
  });

  const downloadButton = row.querySelector(".button-download");
  downloadButton.addEventListener("click", () => {
    const hashedFilename = downloadButton.getAttribute("data-hashed-filename");
    downloadFile(hashedFilename);
  });

  return row;
};

const updateUrutan = async (id, newUrutan, row) => {
  row.style.backgroundColor = "yellow";

  try {
    const response = await fetch(`http://localhost:5000/files/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urutan: newUrutan }),
    });

    const result = await response.json();

    if (result.success) {
      // Memanggil showData untuk memperbarui tampilan
      const updatedData = await fetchDataForId(id);
      const updatedRow = showData(updatedData);

      // Menggantikan row lama dengan row yang diperbarui
      row.parentNode.replaceChild(updatedRow, row);
    } else {
      console.error("Error updating urutan:", result.error);
    }
  } catch (error) {
    console.error("Error updating urutan:", error);
  }
};

const downloadFile = (hashedFilename) => {
  window.location.href = `http://localhost:5000/download/${hashedFilename}`;
};

const fetchDataForId = async (id) => {
  const response = await fetch(`http://localhost:5000/files/${id}`);
  const data = await response.json();
  return data;
};

const deleteData = (id) => {
  fetch(`http://localhost:5000/files/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': 'Bearer ' + token, // Jika memerlukan otorisasi
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Data deleted:", result);
      // Lakukan sesuatu setelah berhasil menghapus
    })
    .catch((error) => {
      console.error("Error deleting data:", error);
    });
};

buttonSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  const inputFile = document.querySelector(".input-file");
  const urutan = document.querySelector(".urutan");

  const formData = new FormData();
  formData.append("file", inputFile.files[0]); // Ambil file dari input
  formData.append("urutan", urutan.value);

  fetch("http://localhost:5000/files", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Response:", result);
      // Handle response as needed
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

fetch(endpoint)
  .then((data) => data.json())
  .then((result) => {
    const tableBody = document.getElementById("table-body");
    result.forEach((f) => {
      const row = showData(f);
      tableBody.appendChild(row);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
