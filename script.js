
  .catch((error) => {
    console.error("❌ Error connecting to backend:", error);
    document.body.innerHTML = `<h2 style="color:red;">Backend error</h2>`;
  });
<script>
  document.getElementById('agreeCheckbox').addEventListener('change', function () {
    const button = document.getElementById('recruitBtn');
    button.disabled = !this.checked;
  });
</script>
