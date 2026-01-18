//theme functions

const stylesheet = document.getElementById("colortheme");
const btnThemeChange = document.getElementById("btnThemeChange");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    theme("light")
}

function switchTheme() {

    if (stylesheet.getAttribute("href") === "assets/css/light.css") {
        theme("dark");
    } else {
        theme("light");
    }
}

function setTheme(theme) {
    localStorage.setItem("theme", theme);
}

function theme(theme) {
    if (theme === "dark") {
        stylesheet.setAttribute("href", "assets/css/dark.css");
        btnThemeChange.src = "assets/icons/icon_toLight.svg";
        setTheme("dark");
    } else {
        stylesheet.setAttribute("href", "assets/css/light.css");
        btnThemeChange.src = "assets/icons/icon_toDark.svg";
        setTheme("light");
    }
}


btnThemeChange.addEventListener("click", function(){
    switchTheme()
})