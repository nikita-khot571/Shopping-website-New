async function fetchProducts() {
  const query = `
    query {
      products {
        id
        name
        price
        description
        image_url
      }
    }
  `;
  const res = await fetch("http://localhost:4000/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  return data.data.products;
}

async function renderProducts() {
  const products = await fetchProducts();
  const container = document.getElementById("products");
  container.innerHTML = products.map(p => `
    <div class="col-md-4">
      <div class="card mb-4 shadow-sm">
        <img src="${p.image_url}" class="card-img-top" alt="${p.name}">
        <div class="card-body">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text">${p.description || ""}</p>
          <p><strong>$${p.price}</strong></p>
          <button class="btn btn-primary">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join("");
}

renderProducts();
