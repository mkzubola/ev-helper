function calculate() {

    const basehp = document.getElementById("basehp").value
    const basedef = document.getElementById("basedef").value
    const basespdef = document.getElementById("basespdef").value

    const defmultiplier = document.getElementById("defmultiplier").value
    const spdefmultiplier = document.getElementById("spdefmultiplier").value

    const leftoverevs = document.getElementById("leftoverevs").value

    const naturebonusavailable = document.getElementById("natureavailable").checked

    const filterresults = document.getElementById("filterresults").checked

    const filtercoefficient = document.getElementById("filtercoefficient").value
    const filterconstant = document.getElementById("filterconstant").value

    let spreads = generatespreads(leftoverevs, naturebonusavailable)

    for (let i = 0; i < spreads.length; i++) {
        spreads[i].hpstat = calculatehp(basehp, spreads[i].hpevs)
        spreads[i].defstat = calculatedefs(basedef, spreads[i].defevs, spreads[i].defnature)
        spreads[i].spdefstat = calculatedefs(basespdef, spreads[i].spdefevs, spreads[i].spdefnature)
        spreads[i].tbi = calculatetbi(spreads[i].hpstat, Math.floor(spreads[i].defstat * defmultiplier), Math.floor(spreads[i].spdefstat * spdefmultiplier))
    }

    spreads.sort((a, b) => b.tbi - a.tbi)

    console.log(filterresults)

    if (filterresults) {
        spreads = spreads.filter((a) => a.hpstat % filtercoefficient == filterconstant)
    }

    tableCreate(spreads)
}

function generatespreads(evs, naturebonusavailable) {
    const allowedvalues = [0, 4, 12, 20, 28, 36, 44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 124, 132, 140, 148, 156, 164, 172, 180, 188, 196, 204, 212, 220, 228, 236, 244, 252]
    const allowedtotal1 = evs - evs % 4
    const allowedtotal2 = allowedtotal1 - 4
    let allpossiblespreads = []
    for (let hp of allowedvalues) {
        if (hp > allowedtotal2) {
            break
        }
        for (let def of allowedvalues) {
            if (hp + def > allowedtotal2) {
                break
            }
            for (let spdef of allowedvalues) {
                if (hp + def + spdef == allowedtotal1 || hp + def + spdef == allowedtotal2) {
                    if (naturebonusavailable) {
                        allpossiblespreads.push({"hpevs":hp, "defevs": def, "spdefevs":spdef, "defnature":1.1, "spdefnature":1})
                        allpossiblespreads.push({"hpevs":hp, "defevs": def, "spdefevs":spdef, "defnature":1, "spdefnature":1.1})
                    } else {
                        allpossiblespreads.push({"hpevs":hp, "defevs": def, "spdefevs":spdef, "defnature":1, "spdefnature":1})
                    }
                    break
                }
            }
        }
    }
    return allpossiblespreads
}

function calculatehp(basestat, evs) {
    return Math.floor(Math.floor(basestat * 2 + 31 + evs / 4) * 0.5) + 60
}

function calculatedefs(basestat, evs, naturebonus) {
    return Math.floor(Math.floor(Math.floor(basestat * 2 + 31 + evs / 4) * 0.5 + 5) * naturebonus)
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
        tr.insertCell().appendChild(document.createTextNode(spreads[i].hpevs));
        tr.insertCell().appendChild(document.createTextNode(spreads[i].defevs));
        tr.insertCell().appendChild(document.createTextNode(spreads[i].spdefevs));
        tr.insertCell().appendChild(document.createTextNode(spreads[i].defnature == 1.1 ? "Def" : spreads[i].spdefnature == 1.1 ? "SpDef" : "N/A"));
        tr.insertCell().appendChild(document.createTextNode(Math.round(spreads[i].tbi * 100) / 100));
    }
    body.appendChild(tbl);
  }