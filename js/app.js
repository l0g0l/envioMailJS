//se ejecuta el código una vez que el HTML ha sido descargado de otra forma puede que te aparezca algun dato undefined o trate de seleccionar algún elemento que todavía no existe

document.addEventListener("DOMContentLoaded", () => {
    const formularioCompleto = {
        email: "",
        cc: "",
        asunto: "",
        mensaje: "",
        comentario: "",
    };

    //seleccionar los elementos de la interfaz
    const inputEmail = document.querySelector("#email");
    const inputCC = document.querySelector("#cc");
    const inputAsunto = document.querySelector("#asunto");
    const inputMensaje = document.querySelector("#mensaje");
    const inputComentario = document.querySelector("#comentario");
    const formulario = document.querySelector("#formulario");
    const btnSubmit = document.querySelector(
        '#formulario button[type="submit"]'
    );
    const inputBtnReset = document.querySelector(
        '#formulario button[type="reset"]'
    );
    const spinner = document.querySelector("#spinner");

    //asignamos los es

    //el e blur es para reconocer cuando sales del campo. El método input recoge los datos en tiempo real
    inputEmail.addEventListener("input", validar);
    inputCC.addEventListener("blur", validar); //le tengo que cambiar al evento blur para que NO reconozca el valor del input mientras voy escribiendo o borrando
    inputMensaje.addEventListener("input", validar);
    inputAsunto.addEventListener("input", validar);
    inputComentario.addEventListener("input", validar);

    //para resetear el formulario
    inputBtnReset.addEventListener("click", function (e) {
        //tiene que ser una función anónima o llamar a una función creada fuera del listener
        e.preventDefault(); //evitamos el comportamiento por default, es decir, que resetee el formulario

        //reseteamos el formulario
        resetearFormulario();

        //comprobamos si los campos están rellenos o no para poner el btn de enviar como disabled
        validarFormularioCompleto();
    });

    formulario.addEventListener("submit", enviarEmail);

    //creamos la fn validar que se llama desde cada uno de los es, así evitamos las callbacks en los eventlListener
    function validar(e) {
        //comprobamos si el campo está vacío y con el método trim() eliminamos los espacios en blanco
        if (e.target.id !== "cc" && e.target.value.trim() === "") {
            mostrarAlertaValidacion(
                `El campo ${e.target.id} es obligatorio`,
                e.target.parentElement
            ); // parentElement recuperamos el elemento padre del HTML del campo donde pinchemos

            formularioCompleto[e.target.id] = ""; //vaciamos el input

            validarFormularioCompleto(); //comprobamos de nuevo, una vez pasada la validación de que todos los campos se han rellenado (linea 57),  si el campo sigue relleno o no para poner el btn enviar en disabled. Esto es por si, una vez relleno el formulario y antes de enviar, borramos uno de los inputs, entonces el btn de enviar debe volver a disabled
            return;
        }

        //validamos primero comprobamos que estamos en el input email Y que si no cumple la regex (por eso negamos la función), que muestre el mensaje de alerta

        if (
            (e.target.id === "email" || e.target.id === "cc") &&
            e.target.value.trim() !== "" &&
            !validarEmail(e.target.value)
        ) {
            mostrarAlertaValidacion(
                `El email ${e.target.value} no es válido`,
                e.target.parentElement
            );

            formularioCompleto[e.target.id] = ""; //vaciamos el input

            validarFormularioCompleto(); //comprobamos de nuevo, una vez pasada la validación de que todos los campos se han rellenado (linea 57),  si el campo sigue relleno o no para poner el btn enviar en disabled. Esto es por si, una vez relleno el formulario y antes de enviar, borramos uno de los inputs, entonces el btn de enviar debe volver a disabled
            return;
        }

        //primero comprobamos que estamos en el input cc Y que si está vacío ponga el botón de enviar habilitado
        if (e.target.id === "cc" && e.target.value.trim() === "") {
            btnSubmit.classList.remove("opacity-50");
            btnSubmit.disabled = false;
            return;
        }

        //validamos primero comprobamos que estamos en el input comentario Y que si no cumple la regex (por eso negamos la función), que muestre el mensaje de alerta
        if (
            e.target.id === "comentario" &&
            !validarComentario(e.target.value)
        ) {
            mostrarAlertaValidacion(
                `El comentario es mayor a 200 caracteres`,
                e.target.parentElement
            );
            formularioCompleto[e.target.id] = ""; //vaciamos el input

            validarFormularioCompleto(); //comprobamos de nuevo, una vez pasada la validación de que todos los campos se han rellenado (linea 57),  si el campo sigue relleno o no para poner el btn enviar en disabled. Esto es por si, una vez relleno el formulario y antes de enviar, borramos uno de los inputs, entonces el btn de enviar debe volver a disabled
            return;
        }

        limpiarAlerta(e.target.parentElement); //le pasamos el parentElement para coger únicamente la referencia del padre de ese input

        //Asignamos los valores del usuario a los campos del objeto formularioCompleto utilizando el id de cada input
        formularioCompleto[e.target.id] = e.target.value.trim().toLowerCase();
        console.log(formularioCompleto);
        validarFormularioCompleto(); //comprobamos si el input está vacío o no para poner el botón en disabled y quitar la opacidad
    }

    function mostrarAlertaValidacion(mensaje, referencia) {
        //comprobamos si ya existe una alerta. Primero capturamos esa alerta en este caso con una clase que solo tiene la alerta y la borramos. Capturamos sobre referencia y nos sobre document para que busque la clase de la alerta SOLO en el div padre de esa referencia, no en todo el documento
        limpiarAlerta(referencia);

        //generamos la alerta en HTML
        const error = document.createElement("P");
        error.textContent = mensaje;
        error.classList.add("bg-red-600", "text-white", "p-2", "text-center");

        //tenemos que hacer que se muestre el texto del error en el HTMl del formulario, para ello usamos appendChild(). La diferencia entre usar appendChild e innerHTML (formulario.innerHTML = error.innerHTML), es que inner sustituye todo el HTML por el texto que le añadas, en cambio appned lo añade al final
        referencia.appendChild(error);
    }

    function limpiarAlerta(referencia) {
        const alerta = referencia.querySelector(".bg-red-600");
        if (alerta) {
            alerta.remove();
        }
    }

    function validarEmail(email) {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        const resultado = regex.test(email);
        return resultado;
    }

    function validarComentario(comentario) {
        const regexMaxCharacter = /^[a-zA-Z0-9]{0,200}$/; //te deja escribir un máximo de 200 caracteres
        const resultado = regexMaxCharacter.test(comentario);
        return resultado;
    }
    function validarFormularioCompleto() {
        //comprobamos si alguno de los campos del formulario están vacíos con el object.values vamos a transformar el objeto formularioCompleto en un array con los campos de valor del objecto (object.keys nos retornaria el valor de las claves, de las keys del objeto) y con includes() comprobamos si alguno de esos campos de formulariocompleto está vacío muestra true, sino muestra false
        if (Object.values(formularioCompleto).includes("")) {
            btnSubmit.classList.add("opacity-50");
            btnSubmit.disabled = true;
            return;
        }
        btnSubmit.classList.remove("opacity-50");
        btnSubmit.disabled = false;
    }

    function enviarEmail(e) {
        e.preventDefault();

        //le quitamos la propiedad de hidden para que sea visible el spinner
        spinner.classList.remove("hidden");

        //Simulamos el envío del email después de XX tiempo ocultando el spinner
        setTimeout(() => {
            spinner.classList.add("hidden");

            //reseteamos el formulario
            resetearFormulario();

            //mostramos alerta con mensaje OK
            alertaEnvioEmail();
        }, 3000);
    }

    function resetearFormulario() {
        //limpiamos todos los campos
        formularioCompleto.email = "";
        formularioCompleto.mensaje = "";
        formularioCompleto.asunto = "";
        formularioCompleto.comentario = "";

        //comprobamos si el input está vacío o no para poner el botón en disabled y quitar la opacidad
        validarFormularioCompleto();

        //reseteamos el formulario
        formulario.reset();
    }

    function alertaEnvioEmail() {
        //creamos la alerta
        const alertaExito = document.createElement("P");
        alertaExito.classList.add(
            "bg-green-500",
            "text-white",
            "padding-2",
            "text-center",
            "rounded-lg",
            "mt-10",
            "font-bold",
            "text-sm",
            "uppercase"
        );
        alertaExito.textContent = "Mensaje enviado correctamente";

        //una vez creada se la añadirmos al formulario. Sale al final
        formulario.appendChild(alertaExito);

        //como se muestra todo el tiempo, para quitarla...
        setTimeout(() => {
            alertaExito.remove();
        }, 2000);
    }
});
