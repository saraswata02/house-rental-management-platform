export const getWishlist = () => {

    return JSON.parse(localStorage.getItem("wishlist")) || [];

};

export const addToWishlist = (property) => {

    const wishlist = getWishlist();

    const exists = wishlist.find(item => item.id === property.id);

    if (!exists) {

        wishlist.push(property);

        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

    }

};

export const removeFromWishlist = (id) => {

    const wishlist = getWishlist().filter(
        item => item.id !== id
    );

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

};

export const isWishlisted = (id) => {

    return getWishlist().some(
        item => item.id === id
    );

};