const DROPDOWN_URL = "https://script.google.com/macros/s/AKfycbzmFr3NsisU6my9FuyIZ2z1gmkwUf6tFl-vT8mPW6JiVRNbKGxS4Z9Wsj6UKlMAh7Rk/exec";
const SUBMIT_URL = "https://script.google.com/macros/s/AKfycbwQMfKfeQH-TJjsLgMsDdcpA-vD5RDlNO0EFLNHb0YuexQ3MrPMu6Emqj7VxrW1Rz12/exec";

let materials = [];

const materialInput = document.getElementById("materialInput");
const materialList = document.getElementById("materialList");
const hiddenMaterialInput = document.getElementById("selectedMaterial");

// Fetch materials from Google Sheet
fetch(DROPDOWN_URL)
  .then(res => res.json())
  .then(data => {
    materials = data;
  });

// Render dropdown based on filter
function renderDropdown(filteredList) {
  materialList.innerHTML = "";
  filteredList.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    li.onclick = () => {
      materialInput.value = item;
      hiddenMaterialInput.value = item;
      materialList.style.display = "none";
    };
    materialList.appendChild(li);
  });
  materialList.style.display = filteredList.length ? "block" : "none";
}

// Show filtered dropdown only on input
materialInput.addEventListener("input", () => {
  const search = materialInput.value.trim().toLowerCase().split(/\s+/);
  const filtered = materials.filter(item =>
    search.every(word => item.toLowerCase().includes(word))
  );
  renderDropdown(filtered);
  hiddenMaterialInput.value = ""; // reset hidden input
});

// Show all options when focused (if typed, still filters)
materialInput.addEventListener("focus", () => {
  if (materialInput.value === "") {
    renderDropdown(materials);
  }
});

// Hide dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!document.getElementById("dropdownWrapper").contains(e.target)) {
    materialList.style.display = "none";
  }
});

// Handle form submit
document.getElementById("myForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!hiddenMaterialInput.value) {
    alert("Please select a material from the list.");
    return;
  }

  const form = e.target;
  const formData = new FormData(form);
  const data = {};
  formData.forEach((val, key) => data[key] = val);

  document.getElementById("status").textContent = "Submitting...";

  try {
    await fetch(SUBMIT_URL, {
      method: "POST",
      body: JSON.stringify(data)
    });
    document.getElementById("status").textContent = "Form submitted successfully!";
    form.reset();
    hiddenMaterialInput.value = "";
    materialList.style.display = "none";
  } catch (err) {
    document.getElementById("status").textContent = "Submission failed!";
  }
});
