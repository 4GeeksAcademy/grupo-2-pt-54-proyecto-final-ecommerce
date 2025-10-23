export const initialStore = () => {
  return {
    message: null,
    access_token : '',
    products: [
      {
        id: 1,
        name: "Audífonos Bluetooth Logitech G Pro",
        price: 1599,
        image: "https://picsum.photos/seed/ancpro/600/600",
      },
      {
        id: 2,
        name: "Mouse inalámbrico Logitech",
        price: 499,
        image: "https://picsum.photos/seed/mouse/600/600",
      },
    ],
    categories: [],
    searchResults: [],
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

    case "load_categories":
      return {
        ...store,
        categories: action.payload,
      };

    case "load_products":
      return {
        ...store,
        products: action.payload,
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
          .map((i) =>
            i.id === id ? { ...i, qty: (i.qty || 1) - 1 } : i
          )
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

    case "set_search_results":
      return { ...store, searchResults: [...action.payload.products] };

    default:
      throw Error("Unknown action.");
  }
}
