import fs from "fs";
import path from "path";

// ---------------- Types
export type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
};

// ---------------- File Storage (data/products.json)
const dataPath = path.join(process.cwd(), "data", "products.json");

function ensureDataFile() {
  const dir = path.dirname(dataPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, "[]", "utf8");
}

function load(): Product[] {
  ensureDataFile();
  const text = fs.readFileSync(dataPath, "utf8");
  try {
    return JSON.parse(text) as Product[];
  } catch {
    fs.writeFileSync(dataPath, "[]", "utf8");
    return [];
  }
}

function save(arr: Product[]): void {
  ensureDataFile();
  fs.writeFileSync(dataPath, JSON.stringify(arr, null, 2), "utf8");
}

// ---------------- GraphQL Schema
export const typeDefs = `
  type Product {
    id: Int!
    name: String!
    price: Float!
    description: String
    image_url: String
  }

  type Query {
    products: [Product!]!
    product(id: Int!): Product
  }

  type Mutation {
    addProduct(
      name: String!
      price: Float!
      description: String
      image_url: String
    ): Product!
  }
`;

// ---------------- Resolvers
export const resolvers = {
  Query: {
    products: (): Product[] => load(),
    product: (_: unknown, args: { id: number }): Product | null =>
      load().find((p) => p.id === args.id) ?? null,
  },
  Mutation: {
    addProduct: (
      _: unknown,
      args: { name: string; price: number; description?: string; image_url?: string }
    ): Product => {
      const products = load();
      const nextId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      const newProduct: Product = {
        id: nextId,
        name: args.name,
        price: args.price,
        description: args.description,
        image_url: args.image_url || "https://via.placeholder.com/150"
      };
      products.push(newProduct);
      save(products);
      return newProduct;
    },
  },
};
