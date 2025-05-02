import { PGlite } from 'https://cdn.jsdelivr.net/npm/@electric-sql/pglite/dist/index.js';

const db = new PGlite('idb://patiendb');

await db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    name TEXT,
    age INTEGER,
    gender TEXT,
    address TEXT,
    contact TEXT
  );
`);
document.getElementById("patient-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const age = parseInt(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;
  const address = document.getElementById("address").value;
  const contact = document.getElementById("contact").value;

  await db.exec(`
    INSERT INTO patients (name, age, gender, address, contact)
    VALUES ('${name}', ${age}, '${gender}', '${address}', '${contact}');
  `);

  alert("Patient registration successful!");
  e.target.reset();
  showPatientDetails();
});

async function showPatientDetails() {
  const result = await db.query("SELECT * FROM patients");
  document.getElementById("query-result").textContent = JSON.stringify(result.rows, null, 2);
}


window.runSQL = async function () {
  const query = document.getElementById("sql-query").value;
  try {
    const result = await db.query(query);
    document.getElementById("query-result").textContent = JSON.stringify(result.rows, null, 2);
  } catch (e) {
    document.getElementById("query-result").textContent = "Error: " + e.message;
  }
};

const bc = new BroadcastChannel("patient_sync");
bc.onmessage = () => {
  console.log("Data updated in another tab");
  showPatientDetails();
};

// On load, show existing data
showPatientDetails();
