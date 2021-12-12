fetch('/api/v1/listeffects')
    .then(response => response.json())
    .then(effects => {
        console.log(effects)
        let output = ""
        for(let effect in effects){
            output += "<button class='btn btn-success' type='button' onclick='setEffect(\"" + effects[effect].name + "\")'>" + effects[effect].niceName + "</button><br><br>"
        }
        document.getElementById('effects').innerHTML = output
    });
function setEffect(name){
    fetch('/api/v1/seteffect?name=' + name)
}