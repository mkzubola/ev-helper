function calculate() {

    const basehp = Number(document.getElementById("basehp").value)
    console.log(typeof(basehp))
    const basedef = Number(document.getElementById("basedef").value)
    const basespdef = Number(document.getElementById("basespdef").value)

    const defmultiplier = Number(document.getElementById("defmultiplier").value)
    const spdefmultiplier = Number(document.getElementById("spdefmultiplier").value)

    const leftoverpoints = Number(document.getElementById("leftoverpoints").value)

    const naturebonusavailable = document.getElementById("natureavailable").checked

    const filterresults = document.getElementById("filterresults").checked

    const filtercoefficient = Number(document.getElementById("filtercoefficient").value)
    const filterconstant = Number(document.getElementById("filterconstant").value)

    let spreads = generatespreads(leftoverpoints, naturebonusavailable)

    for (let i = 0; i < spreads.length; i++) {
        spreads[i].hpstat = calculatehp(basehp, spreads[i].hppoints)
        spreads[i].defstat = calculatedefs(basedef, spreads[i].defpoints, spreads[i].defnature)
        spreads[i].spdefstat = calculatedefs(basespdef, spreads[i].spdefpoints, spreads[i].spdefnature)
        spreads[i].tbi = calculatetbi(spreads[i].hpstat, Math.floor(spreads[i].defstat * defmultiplier), Math.floor(spreads[i].spdefstat * spdefmultiplier))
    }

    spreads.sort((a, b) => b.tbi - a.tbi)

    if (filterresults) {
        spreads = spreads.filter((a) => a.hpstat % filtercoefficient == filterconstant)
    }

    tableCreate(spreads)
}

function generatespreads(leftoverpoints, naturebonusavailable) {
    const allowedvalues = [...Array(33).keys()];
    let allpossiblespreads = []
    for (let hp of allowedvalues) {
        if (hp > leftoverpoints) {
            break
        }
        for (let def of allowedvalues) {
            if (hp + def > leftoverpoints) {
                break
            }
            for (let spdef of allowedvalues) {
                if (hp + def + spdef == leftoverpoints) {
                    if (naturebonusavailable) {
                        allpossiblespreads.push({"hppoints":hp, "defpoints": def, "spdefpoints":spdef, "defnature":1.1, "spdefnature":1})
                        allpossiblespreads.push({"hppoints":hp, "defpoints": def, "spdefpoints":spdef, "defnature":1, "spdefnature":1.1})
                    } else {
                        allpossiblespreads.push({"hppoints":hp, "defpoints": def, "spdefpoints":spdef, "defnature":1, "spdefnature":1})
                    }
                    break
                }
            }
        }
    }
    return allpossiblespreads
}

function calculatehp(basestat, points) {
    return basestat + 75 + points
}

function calculatedefs(basestat, points, naturebonus) {
    return Math.floor((basestat + 20 + points) * naturebonus)
}

function calculatetbi(hp, def, spdef) {
    return (hp * def * spdef)/(def + spdef)
}

function tableCreate(spreads) {
    const body = document.body,
          tbl = document.getElementById('resultstable');
          tbl.innerHTML = ""
    tbl.style.width = '200px';
    tbl.style.border = '1px solid black';

    const header = tbl.insertRow();
    header.insertCell().appendChild(document.createTextNode("HP"))
    header.insertCell().appendChild(document.createTextNode("Def"))
    header.insertCell().appendChild(document.createTextNode("SpDef"))
    header.insertCell().appendChild(document.createTextNode("Nature"))
    header.insertCell().appendChild(document.createTextNode("TBI"))

    for (let i = 0; i < spreads.length; i++) {
        const tr = tbl.insertRow();
        tr.insertCell().appendChild(document.createTextNode(spreads[i].hppoints));
        tr.insertCell().appendChild(document.createTextNode(spreads[i].defpoints));
        tr.insertCell().appendChild(document.createTextNode(spreads[i].spdefpoints));
        tr.insertCell().appendChild(document.createTextNode(spreads[i].defnature == 1.1 ? "Def" : spreads[i].spdefnature == 1.1 ? "SpDef" : "N/A"));
        tr.insertCell().appendChild(document.createTextNode(Math.round(spreads[i].tbi * 100) / 100));
    }
    body.appendChild(tbl);
  }