$( "#crear_lista" ).click(function() {
	var lista = prompt("Ingresa el nombre para tu nueva lista (sólo letras, números, guiones bajo y medio, sin espacios)");
	var patron_usuario = /^[a-zA-Z0-9\-\_]*$/;
	if (lista.length>0 && !lista.search(patron_usuario)) {
		$.ajax({ type: "POST", url: "crud.php",
        data: { acc: "leer_listas", nombre_lista: lista},
        success: function(data){
			if(data.mensaje=='usuarioOK')
			{
				$.ajax({ type: "POST", url: "crud.php",
					data: { acc: "crear_lista", nombre_lista: lista, id_usuario: $("#id_usuario").val()},
					success: function(data){
						if(data.mensaje=='listaOK')
							M.toast({html: 'Lista creada exitosamente!', completeCallback: function(){location.reload();}});						
					}
					});
			}
			else
				alert('El nombre ingresado para tu lista ya está en uso');		
		}
        });
	}
	else
		alert("Debes ingresar un nombre válido (sólo letras, números, guiones bajo y medio, sin espacios)");
});

$('.sidenav').sidenav({
      menuWidth: 230, // Default is 300
      edge: 'right', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true // Choose whether you can drag to open on touch screens
    });

$(".dropdown-trigger").dropdown({ hover: false });
$('.collapsible').collapsible();

$(".cerrar_sesion").click(function(){
    $.ajax({ type: "POST", url: "crud.php",
        data: { acc: "salir"},
        beforeSend: function(){
        },
        success: function(data){
            if(data.mensaje_logout==='logoutOK')
                window.location="/login.php";
            console.log(data.mensaje_login);
        }
    });
});
