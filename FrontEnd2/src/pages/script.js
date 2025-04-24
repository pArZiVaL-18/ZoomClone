const tiles = document.querySelectorAll("video");

tiles.forEach((tile) => {
    tile.addEventListener("click", () => {
        console.log("video clicked");
        tile.classList.toggle("expanded");
    });
});
