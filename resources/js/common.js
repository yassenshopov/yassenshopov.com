let click = true;

function animate_menu(x) {
    click = !click;
    if (click == false) {
        document.getElementById("overlay").style.height = "100vh";
        document.body.style.overflowY = "hidden";
        document.getElementById("bar1").classList.add("onClick1");
        document.getElementById("bar2").classList.add("onClick2");
        document.getElementById("bar3").classList.add("onClick3");
        // document.getElementById("overlay").style.display = "block";
    } else {
        document.getElementById("overlay").style.height = "0";
        document.body.style.overflowY = "visible";
        document.getElementById("bar1").classList.remove("onClick1");
        document.getElementById("bar2").classList.remove("onClick2");
        document.getElementById("bar3").classList.remove("onClick3");
        // document.getElementById("overlay").style.display = "none";
    }
}