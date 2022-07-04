let click = true;

function animate_menu(x) {
    click = !click;
    console.log(click)
    if (click == false) {
        document.getElementById("overlay").style.height = "100vh";
        document.body.style.overflowY = "hidden";
        // document.getElementById("overlay").style.display = "block";
    } else {
        document.getElementById("overlay").style.height = "0";
        document.body.style.overflowY = "visible";
        // document.getElementById("overlay").style.display = "none";
    }
}