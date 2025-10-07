export const initialStore = () => {
  // return {
  //   message: null,
  //   todos: [
  //     {
  //       id: 1,
  //       title: "Make the bed",
  //       background: null,
  //     },
  //     {
  //       id: 2,
  //       title: "Do my homework",
  //       background: null,
  //     },
  //   ],
  // };
  return {
    message: null,
    products: [
      {
        id: 1,
        name: "Audífonos Bluetooth Logitech G Pro",
        price: 1599,
        image: "https://picsum.photos/seed/ancpro/600/600",
      },
      {
        id: 2,
        name: "Teclado Mecánico RGB Razer",
        price: 1299,
        image: "https://picsum.photos/seed/rgbkbd/600/600",
      },
      {
        id: 3,
        name: "Mouse Logitech G Hero 502x",
        price: 3499,
        image: "https://picsum.photos/seed/cyclonex10/600/600",
      },
    ],
    cart: [],
    drawer: false,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };

    case "add_to_cart": {
      const { product, qty = 1 } = action.payload;
      const exist = store.cart.find((i) => i.id === product.id);
      return {
        ...store,
        cart: exist
          ? store.cart.map((i) =>
              i.id === product.id
                ? { ...i, qty: (i.qty || 1) + Number(qty) }
                : i
            )
          : [...store.cart, { ...product, qty: Number(qty) }],
      };
    }

    case "decrease_from_cart": {
      const id = action.payload;
      return {
        ...store,
        cart: store.cart
          .map((i) => (i.id === id ? { ...i, qty: (i.qty || 1) - 1 } : i))
          .filter((i) => i.qty > 0),
      };
    }

    case "remove_from_cart":
      return {
        ...store,
        cart: store.cart.filter((i) => i.id !== action.payload),
      };

    case "clear_cart":
      return { ...store, cart: [] };

    case "open_cart":
      return { ...store, drawer: true };

    case "close_cart":
      return { ...store, drawer: false };

    case "toggle_cart":
      return { ...store, drawer: !store.drawer };

    default:
      throw Error("Unknown action.");
  }
}
