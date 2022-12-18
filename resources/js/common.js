let click = true;

function animate_menu(x) {
    click = !click;
    if (click == false) {
        document.getElementById("overlay").style.height = "100vh";
        document.body.style.overflowY = "hidden";
        document.getElementById("bar1").classList.add("onClick1");
        document.getElementById("bar2").classList.add("onClick2");
        document.getElementById("bar3").classList.add("onClick3");
    } else {
        document.getElementById("overlay").style.height = "0";
        document.body.style.overflowY = "visible";
        document.getElementById("bar1").classList.remove("onClick1");
        document.getElementById("bar2").classList.remove("onClick2");
        document.getElementById("bar3").classList.remove("onClick3");
    }
}

function select_templates() {
    let select = document.getElementById('selection_templates').value;
    let main_tag = document.getElementById("main").childNodes;
    for (let i=0; i<main_tag.length; i++) {
        let template = main_tag[i];
        if (template.constructor.name != "Text") {
            if (template.classList.contains(select) == false) {
                template.style.display = "none";
            } else {
                template.style.display = "flex";
            }
        }
    }
}

window.onscroll = function() {
    let body = document.querySelector("body");
    if (body.className === "blogPost") {
        let a_list;
        let docElem = document.documentElement;
        let scrollTop = docElem['scrollTop'] || body['scrollTop'];
        let scrollBottom = (docElem['scrollHeight'] || body['scrollHeight']) - window.innerHeight;
        let scrollPercent = 8 + (scrollTop / scrollBottom * 100) + '%';

        document.getElementById("progressBar").style.setProperty("--scrollAmount", scrollPercent); 

        let header = document.querySelector("header");
        if (document.documentElement.scrollTop > 300) {
            a_list = document.querySelectorAll("nav > a");
            header.style.backgroundColor = "#ffffff"

            for (let i = 0; i < a_list.length; i++) {
                a_list[i].style.color = "#121212"
            }
        } else {
            a_list = document.querySelectorAll("nav > a");
            header.style.backgroundColor = "#080808"

            for (let i = 0; i < a_list.length; i++) {
                a_list[i].style.color = "#ffffff"
            }
        }
    };
};