fetch("/")
  .then((response) => response.text())
  .then((data) => {
    console.log("✅ Backend says:", data);
    document.body.innerHTML = `<h2>${data}</h2>`;
  })
  .catch((error) => {
    console.error("❌ Error connecting to backend:", error);
    document.body.innerHTML = `<h2 style="color:red;">Backend error</h2>`;
  });
