const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Connect to the SQLite database
const dbPath = path.resolve(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to user database.");

    // Create a table for user profiles
    db.run(
      `CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        token TEXT NOT NULL,
        address TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        phone TEXT,
        sfsu_id TEXT
      )`,
      (err) => {
        if (err) {
          console.error("Error creating user profile", err.message);
        } else {
          console.log("User profile created successfully!");
        }
      }
    );

    //create a table for store items
    db.run(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image TEXT
      )`,
      (err) => {
        if (err) {
          console.error("Error creating products table", err.message);
        } else {
          console.log("Products table created successfully!");

          //insert store products
          const products = [
            {
              image: "ornament.webp",
              name: "SFSU ornament",
              description: "Purple ornament with school logo in the center",
              price: 19.95,
              image: "ornament.webp"
            },
            {
              image: "thermos.webp",
              name: "SFSU thermos",
              description:
                "Stainless stell thermas with SFSU logo printed on leather",
              price: 29.99,
              image: "thermos.webp"
            },
            {
              image: "pennant.webp",
              name: "SFSU pennant",
              description: "Purple and yellow SFSU pennant flag",
              price: 39.99,
              image: "pennant.webp"
            },
            {
              image: "mug.webp",
              name: "SFSU mug",
              description:
                "White mug with notable San Francisco, California icons ",
              price: 49.99,
              image: "mug.webp"
            },
            {
              image: "plushie.webp",
              name: "SFSU gator",
              description: "Stuffed alligator wearing SFSU bandana",
              price: 59.99,
              image: "plushie.webp"
            },
            {
              image: "tallcup.webp",
              name: "SFSU tall cup",
              description:
                "Silver cup printed with purple and yellow snowflakes and SFSU logo printed handle",
              price: 69.99,
              image: "tallcup.webp"
            },
          ];

          // Check if table is empty
          db.get(`SELECT COUNT(*) as count FROM products`, (err, row) => {
            if (err) {
              console.error(
                "Error checking for existing products",
                err.message
              );
            } else if (row.count > 0) {
              console.log(row.count);
              console.log(
                "Products table already has data. Skipping insertion."
              );
            } else {
              console.log("Inserting products into table...");
              products.forEach((product) => {
                db.run(
                  `INSERT OR IGNORE INTO products (name, description, price) VALUES (?, ?, ?)`,
                  [product.name, product.description, product.price],
                  (err) => {
                    if (err) {
                      console.error("Error inserting product", err.message);
                    } else {
                      console.log(
                        `Product '${product.name}' inserted successfully!`
                      );
                    }
                  }
                );
              });
            }
          });
        }
      }
    );
    // Create a table for cart items
    db.run(
      `CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES Users (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      )`,
      (err) => {
        if (err) {
          console.error("Error creating cart items", err.message);
        } else {
          console.log("Cart items created successfully!");
        }
      }
    );

    // Create a table for orders
    db.run(
      `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total REAL NOT NULL,
        FOREIGN KEY (user_id) REFERENCES Users (id)
      )`,
      (err) => {
        if (err) {
          console.error("Error creating orders", err.message);
        } else {
          console.log("Orders created successfully!");
        }
      }
    );
  }
});

module.exports = db;