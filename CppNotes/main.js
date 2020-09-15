var showAbout = Boolean(false);

function ToggleAbout()
{
    showAbout = !showAbout;
    var aboutDim = document.getElementById("about-dim");
    var aboutBox = document.getElementById("about");

    switch(showAbout)
    {
        case true:
            aboutDim.style.zIndex = 2;
            aboutDim.style.backgroundColor = "rgba(0, 0, 0, 0.35)";
            aboutBox.style.opacity = 1;
            aboutBox.style.top = "25vh";
            break;
        case false:
            aboutBox.style.top = "-50vh";
            aboutBox.style.opacity = 0;                                                
            aboutDim.style.backgroundColor = "rgba(0, 0, 0, 0)";
            setTimeout(function() {aboutDim.style.zIndex = -5;}, 400);
    }        
}