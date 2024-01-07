let vectorDOM = document.querySelector(".vector");
const btnCargar = document.getElementById("Cargar")
const btnAleatoria = document.getElementById("Aleatoria")
const btnOrdenar = document.getElementById("Ordenar")
const btnPasoPaso = document.getElementById("PasoPaso")
const pararAnimacion = document.getElementById("pararAnimacion")
const listaVectores = document.getElementsByName("listaVectores")[0];
const mensaje = document.getElementById("mensaje")
const msgErroresFrom = document.getElementById("msgErroresFrom");

mensaje.textContent = "";
msgErroresFrom.textContent = "";
const listRadioBtn = document.getElementsByName("tipo_orden")
let lista = [];
let animacion_id;
const ordenadoOk = "Ordenado <i class='fa-solid fa-check'></i>"
let clase1;
let clase2;
let Acendente;

let i = 0;
let j = 1;
let iteraciones = 0
let ListaOrdenado = false;

inicializarVar = () => {
    i = 0;
    j = 1;
    iteraciones = 0
    ListaOrdenado = false;
    mensaje.textContent = "";
}

const caja = document.createElement('div');
caja.classList.add("box");
function addDatoBox(data) {
    caja.innerHTML = `<p>${data}</p><i id="flecha" class="fa-solid fa-arrow-up"></i>`;
}

function randomNumber(n = 8) {
    vectorDOM.innerHTML = "";
    for (let i = 0; i < n; i++) {
        addDatoBox(parseInt(Math.random() * 10));
        auxiCaja = caja.cloneNode(true);
        vectorDOM.appendChild(auxiCaja);
    }
}
randomNumber();
btnAleatoria.addEventListener("click", (e) => {
    inicializarVar();
    randomNumber()
});

listRadioBtn.forEach((nodo) => {
    nodo.addEventListener("change", (e) => {
        inicializarVar();
        vectorDOM.children = [...document.querySelector(".vector").children].map(e => {
            e.classList.remove("blue")
            return e
        })

    })

})


btnCargar.addEventListener("click", (e) => {
    let val = ""
    msgErroresFrom.textContent = "";
    msgErroresFrom.classList.remove("errorShow")
    ListaOrdenado = false;
    if (listaVectores.value.length) {

        val = listaVectores.value.replace(/\s+/g, ' ');
        if (!(/^([0-9]+\s*)+[0-9]+$/).test(val)) {
            msgErroresFrom.textContent = "Error en la entrada de datos"
            msgErroresFrom.classList.add("errorShow");
            return null
        };
        lista = val.split(' ').map(e => parseInt(e))
        vectorDOM.innerHTML = "";
        let auxiCaja;
        lista.forEach(element => {
            addDatoBox(element);
            auxiCaja = caja.cloneNode(true);
            vectorDOM.appendChild(auxiCaja);
        });
        inicializarVar();
    }
})

function changeNode(node1, node2) {
    if (node1 && node2) {
        const clone1 = node1.cloneNode(true);
        clone1.classList.remove(clase2);
        const clone2 = node2.cloneNode(true);
        clone2.classList.remove(clase1);
        node1.replaceWith(clone2);
        node2.replaceWith(clone1);
    }
}

function Ordenando(len) {
    Acendente = listRadioBtn[0].checked
    const nodo1 = vectorDOM.children[i]
    const nodo2 = vectorDOM.children[j]
    const val1 = parseInt(nodo1.textContent);
    const val2 = parseInt(nodo2.textContent);
    if (i > 0) vectorDOM.children[i - 1].classList.remove("selectBox")
    nodo1.classList.add("selectBox")
    nodo2.classList.add("selectBox")

    if (Acendente && val1 > val2) {
        clase1 = "left"
        clase2 = "topLeftTop"
    } else if (!Acendente && val1 < val2) {
        clase1 = "topRightTop"
        clase2 = "Right"
    } else {
        return false;
    }
    if (nodo1.classList.contains(clase1)) {
        nodo1.classList.remove(clase1)
    }
    nodo1.classList.add(clase2)
    nodo2.classList.add(clase1)
    return true
}
//*Activar y desactivar acciones
function DesabilitarAcciones(valor) {
    listRadioBtn[0].disabled = valor;
    listRadioBtn[1].disabled = valor;
    btnCargar.disabled = valor;
    btnCargar.style.opacity = valor ? '0.5' : '1'
    btnOrdenar.style.zIndex = valor ? "-1" : "1"
    btnPasoPaso.style.zIndex = valor ? "-1" : "1"
    btnAleatoria.disabled = valor;
    btnAleatoria.style.opacity = valor ? '0.5' : '1'


}

let PararEjecucionOrdenar = false;
let sw = false
let tope = 0;
btnOrdenar.addEventListener("click", (e) => {
    if (ListaOrdenado) return true;
    DesabilitarAcciones(true);
    const len = vectorDOM.children.length
    if (tope == 0 || tope == 1) {
        tope = len;
    }
    mensaje.textContent = "Ordenanado..."
    PararEjecucionOrdenar = false;
    animacion_id = setInterval(() => {
        if (sw) {
            changeNode(vectorDOM.children[i - 1], vectorDOM.children[j - 1]);
        }
        if (j >= tope) {
            iteraciones++;
            vectorDOM.children[j - 1].classList.add('blue')
            if (j >= 1) vectorDOM.children[j - 1].classList.remove("selectBox")
            if (j >= 2) vectorDOM.children[j - 2].classList.remove("selectBox")
            if (tope == 1) {
                clearInterval(animacion_id);
                DesabilitarAcciones(false);
                vectorDOM.children[0].classList.add('blue');
                mensaje.innerHTML = ordenadoOk;
                ListaOrdenado = true
            } else {
                i = 0;
                j = 1;
                sw = Ordenando(len)
                i++;
                j++;
            }
            tope--;
        } else {
            sw = Ordenando(len)
            i++;
            j++;
        }
        if (PararEjecucionOrdenar) {
            clearInterval(animacion_id);
            DesabilitarAcciones(false);
            PararEjecucionOrdenar = false;
            if (sw) {
                changeNode(vectorDOM.children[i - 1], vectorDOM.children[j - 1]);
            }
        }
    }, 1000);
}
)


let enEjecucionPasoPaso = false;
btnPasoPaso.addEventListener("click", (e) => {
    if (ListaOrdenado) return true;
    if (enEjecucionPasoPaso) return true;

    sw = Ordenando(1);
    const len = vectorDOM.children.length
    enEjecucionPasoPaso = true;
    setTimeout(() => {
        if (sw) changeNode(vectorDOM.children[i], vectorDOM.children[j]);
        i++;
        j++;
        if (j >= len - iteraciones) {
            console.log(iteraciones)
            vectorDOM.children[j - 1].classList.add('blue');
            if (j >= 1) vectorDOM.children[j - 1].classList.remove("selectBox")
            if (j >= 2) vectorDOM.children[j - 2].classList.remove("selectBox")
            iteraciones++
            i = 0;
            j = 1;
        }
        if (len - 1 <= iteraciones) {
            mensaje.innerHTML = ordenadoOk;
            vectorDOM.children[0].classList.add('blue');
            ListaOrdenado = true
        }
        enEjecucionPasoPaso = false;
        sw = false;
    }, 1000)
})

pararAnimacion.addEventListener("click", (e) => {
    PararEjecucionOrdenar = true;
})



