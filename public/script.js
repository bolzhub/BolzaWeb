document.getElementById("btn").addEventListener("click", async () => {
  const res = await fetch("/api/hello");
  const data = await res.json();
  document.getElementById("msg").textContent = data.message;
});
