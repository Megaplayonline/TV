new Clipboard('#copiar_url');
new Clipboard('.copiar_url');
new Clipboard('.btn-copiar');

$.ajax({ type: "POST", url: "crud.php",
	data: { acc: "check_leer", id_usuario: $("#id_usuario").val()},
	success: function(data){
		if(data.categoria==1)
			$("#check_categoria").attr('checked', true);
		if(data.compartir==1)
			$("#check_compartir").attr('checked', true);
		}
});

$.ajax({ type: "POST", url: "crud.php",
data: { acc: "leer_categoria"},
success: function(data){
$('#editar_categoria').empty();
$('#agregar_categoria').empty();

$('#editar_categoria').append($('<option>', {value: "0",text: "Elige una categoria"}));
$('#agregar_categoria').append($('<option>', {value: "0",text: "Elige una categoria"}));

$.each(data, function(i, val) {
$('#editar_categoria').append($('<option>', {value: val['id_categoria'],text: val['nombre_categoria']}));
$('#agregar_categoria').append($('<option>', {value: val['id_categoria'],text: val['nombre_categoria']}));
});
$('#editar_categoria').append($('<option>', {value: "agregar",text: "Agregar nueva categoria"}));
$('#agregar_categoria').append($('<option>', {value: "agregar",text: "Agregar nueva categoria"}));
//Materialize.toast('Categoria creada correctamente!', 1000,'',function(){/*actualizar_lista();*/});
}
});


$('#editar_categoria, #agregar_categoria').change(function(){
	if($('#editar_categoria').val()=='agregar' || $('#agregar_categoria').val()=='agregar'){
		var categoria = prompt("Ingresa el nombre de la nueva categoria");
			if (categoria.length>0) {
			$.ajax({ type: "POST", url: "crud.php",
				data: { acc: "crear_categoria", nombre_categoria: categoria},
			success: function(data){
				console.log(data);
				$('#editar_categoria').empty();
				$('#agregar_categoria').empty();

				$('#editar_categoria').append($('<option>', {value: "0",text: "Elige una categoria"}));
				$('#agregar_categoria').append($('<option>', {value: "0",text: "Elige una categoria"}));
				$.each(data, function(i, val) {
					$('#editar_categoria').append($('<option>', {value: val['id_categoria'],text: val['nombre_categoria']}));
					$('#agregar_categoria').append($('<option>', {value: val['id_categoria'],text: val['nombre_categoria']}));
				});
				$('#editar_categoria').append($('<option>', {value: "agregar",text: "Agregar nueva categoria"}));
				$('#agregar_categoria').append($('<option>', {value: "agregar",text: "Agregar nueva categoria"}));
				M.toast({html: 'Categoria creada correctamente!'});
				}
			});
	}}
});


$('.modal').modal({
    dismissible: true,
});

$('select').formSelect();

$( "#guardar_agregar_canal" ).click(function() {
	var re = new RegExp("^(https?|rtmp|mms):\\/\\/*");
	if(re.test($("#agregar_url").val()) && $("#agregar_nombre").val()!='' && $("#editar_url").val().includes("m3u.cl/playlist/")==false){
    $.ajax({ type: "POST", url: "crud.php",
    data: { acc: "crear_privado", crear_nombre: $("#agregar_nombre").val(), crear_logo: $("#agregar_logo").val(), crear_url: $("#agregar_url").val(), crear_categoria: $("#agregar_categoria").val(), nombre_usuario: $("#nombre_usuario").val(), id_usuario: $("#id_usuario").val()},
    success: function(){
		//Materialize.toast('Agregado correctamente!', 500,'',function(){actualizar_lista();});
		M.toast({html: 'Agregado correctamente!', completeCallback: function(){actualizar_lista();}});
		dataLayer.push({'event' : 'evento-ga', 'evento-accion' : 'crear', 'evento-etiqueta' : $("#agregar_nombre").val(), 'evento-categoria' : 'privada'});
		$("#agregar_nombre").val("");
		$("#agregar_logo").val("");
		$("#agregar_url").val("");
		$("#agregar_categoria").val(0);
	}
    });
	}
	else
	{
		if($("#agregar_nombre").val()=='')
			$("#agregar_nombre").focus();
		else
			$("#agregar_url").focus();
	}
});

$( "#guardar_editar_canal" ).click(function() {

    $.ajax({ type: "POST", url: "crud.php",
    data: { acc: "actualizar_regional", actualizar_nombre: $("#editar_nombre").val(), actualizar_logo: $("#editar_logo").val(), actualizar_url: $("#editar_url").val(), actualizar_categoria: $("#editar_categoria").val(), actualizar_region: $("#editar_region").val(), actualizar_web: $("#editar_web").val(), actualizar_fb: $("#editar_fb").val(), actualizar_id: $("#editar_id").val(), nombre_usuario: $("#nombre_usuario").val(), id_usuario: $("#id_usuario").val()},
	success: function(){//Materialize.toast("Editado correctamente!", 500,'',function(){actualizar_lista();});
	M.toast({html: 'Editado correctamente!', completeCallback: function(){actualizar_lista();}});
	//dataLayer.push({'event' : 'evento-ga', 'evento-accion' : 'guardar', 'evento-etiqueta' : $("#editar_nombre").val(), 'evento-categoria' : 'privada'});
	}
	});
});


function actualizar_lista(){
    $.ajax({ type: "POST", url: "crud.php",
    data: { acc: "actualizar_lista_privado", nombre_usuario: $("#nombre_usuario").val(), id_usuario: $("#id_usuario").val()},
	success: function(){cargar_lista_privada();}
	});
}

function ver_lista(){
    $.ajax({ type: "POST", url: "crud.php",
    data: { acc: "ver_lista_privada", nombre_usuario: $("#nombre_usuario").val()},
	success: function(data){/*cargar_lista_privada();*/
	$("#lista_personal").html(data.lista);
	}
	});
}

function actualizar_lista_publica(){
	$.ajax({ type: "POST", url: "crud.php",
    data: { acc: "actualizar_lista_publica"},
	success: function(){/*Materialize.toast("Lista actualizada!", 1000,'');*/}
	});
}

$( "#target" ).click(function() {
    $.post( "crud.php", { acc: "eliminar", eliminar_id: "" } );
});

function editar_canal_privado(){
	$( ".editar" ).click(function() {
    var id_canal=$(this).attr('editar_canal');
    $.ajax({ type: "POST", url: "crud.php",
    data: { acc: "leer", id_leer: id_canal},
    beforeSend: function(){
        $('#editar_url').val('');
        $('#editar_logo').val('');
        $('#editar_nombre').val('');
        $('#editar_id').val('');
		$('#editar_fb').val('');
		$('#editar_web').val('');
    },
    success: function(data){
        console.log(data);
		$('#editar_url').focus().val(data.url_canal);
        $('#editar_logo').focus().val(data.logo_canal);
        $('#editar_id').val(id_canal);
		$('#editar_categoria').val(data.categoria);
		$('#editar_region').val(data.region);
		$('#editar_web').focus().val(data.web);
		$('#editar_fb').focus().val(data.facebook);
		$('#editar_nombre').focus().val(data.nombre_canal);
        //$('#editar_id').val($(this).attr('editar_canal'));
        //Materialize.toast('Canal eliminado correctamente!', 1000,'',function(){location.reload();});
		//dataLayer.push({'event' : 'evento-ga', 'evento-accion' : 'editar', 'evento-etiqueta' : data.nombre_canal, 'evento-categoria' : 'privada'});
    }
    });
});
}
editar_canal_privado();

function eliminar_canal_privado(){
	$( ".borrar" ).click(function() {
    var r = confirm("Seguro que quieres eliminar este canal?");
    if (r == true) {
        $.ajax({ type: "POST", url: "crud.php",
        data: { acc: "eliminar_privado", id_eliminar: $(this).attr('borrar_canal'), id_usuario: $("#id_usuario").val(), nombre_usuario: $("#nombre_usuario").val()},
        success: function(){//Materialize.toast('Canal eliminado correctamente!', 500,'',function(){actualizar_lista();});
		M.toast({html: 'Canal eliminado correctamente!', completeCallback: function(){actualizar_lista();}});
		dataLayer.push({'event' : 'evento-ga', 'evento-accion' : 'eliminar', 'evento-etiqueta' : $(this).attr('borrar_nombre_canal'), 'evento-categoria' : 'privada'});
		}
        });
    }
});
}
eliminar_canal_privado();

function copiar_canal_privado(){
	$( ".copiar" ).click(function() {
    var r = confirm("Seguro que quieres copiar este canal?");
    if (r == true) {
        $.ajax({ type: "POST", url: "crud.php",
        data: { acc: "copiar_privado", id_copiar: $(this).attr('copiar_canal'), nombre_usuario: $("#nombre_usuario").val()},
        success: function(){//Materialize.toast('Canal copiado correctamente!', 500,'',function(){actualizar_lista_publica();});
		M.toast({html: 'Canal copiado correctamente!', completeCallback: function(){actualizar_lista_publica();}});
		dataLayer.push({'event' : 'evento-ga', 'evento-accion' : 'copiar', 'evento-etiqueta' : $(this).attr('copiar_nombre_canal'), 'evento-categoria' : 'privada'});
		}
        });
    }
});
}
copiar_canal_privado();

function reproducir_canal_privado(){
	$( ".btn.reproducir" ).click(function() {
	$("#player2")[0].pause();
    $(".estas_viendo").html("Estas viendo <strong>"+$(this).attr('reproducir_nombre_canal')+"</strong>");
    $("#player2")[0].setSrc($(this).attr('reproducir_canal'));
	$("#player2").attr('src', $(this).attr('reproducir_canal'));
    $("#player2")[0].load();
    $("#player2")[0].play();
	$("td").css('background-color','');
	$(this).parent('td').siblings().css('background-color','#e0f2f1');
	$(this).parent('td').css('background-color','#e0f2f1');

	$.ajax({ type: "POST", url: "crud.php",
        data: { acc: "status_canal", url_canal: $(this).attr('reproducir_canal')},
        success: function(){/*Materialize.toast('Canal copiado correctamente!', 500,'',function(){actualizar_lista_publica();});*/
		}
        });
	dataLayer.push({'event' : 'evento-ga', 'evento-accion' : 'reproducir', 'evento-etiqueta' : $(this).attr('reproducir_nombre_canal'), 'evento-categoria' : 'privada', 'id-canal': $(this).attr('id_canal'), 'logo-canal': $(this).attr('reproducir_logo_canal'), 'nombre-lista': $(this).attr('nombre_lista')});
});
}

function filtrar_canal_privado(){
	$('table.highlight').tableFilter({
  // input field to filter table rows
  'input' : 'input#buscar',
  // trigger events and elements
  'trigger': {
    "event"   : "keyup",
    'element'   : undefined
  },
  // case sensitive
  'caseSensitive' :  false,
  // Timeout for keyboard events (keyup, keypress ...)
  'timeout' : -1,
  // enable table sort
  'sort'  : true,
  // not found element
  // e.g. notFoundElement : ".not-found"
  'notFoundElement' : ".not-found",
  // callback
  'callback'  : function(){}
});
}
filtrar_canal_privado();

function seleccionar_canales(){
	$('.multi-select').click(function(){
		if($('.multi-select:checked').length>0)
			{
				$('#eliminar-seleccion').removeClass('disabled');
			}
		else if($('.multi-select:checked').length==0)
			{
				$('#eliminar-seleccion').addClass('disabled');
			}
	});
}

function eliminar_canales(){
	$('#eliminar-seleccion').click(function(){
		var lista_canales=$('.multi-select:checked');
		var r = confirm("Seguro que quieres eliminar estos canales?");
    if (r == true) {
		for(var i=0; i<lista_canales.length;i++)
		{
			$.ajax({ type: "POST", url: "crud.php",
			data: { acc: "eliminar", id_eliminar: lista_canales[i].value},
			success: function(){
			}
			});
		}
		//Materialize.toast(i+' canales eliminados correctamente!', 500,'',function(){actualizar_lista();});
		M.toast({html: i+' canales eliminados correctamente!', completeCallback: function(){actualizar_lista();}});
			dataLayer.push({'event' : 'evento-ga', 'evento-accion' : 'eliminar', 'evento-etiqueta' : 'eliminar masivo', 'evento-categoria' : 'privada'});
			$('#eliminar-seleccion').addClass('disabled');

    }
	});
}

function ordenar(){
var ant;
var desp;
$('tbody').sortable({
	cursor: "move",
	start: function(event, ui) {
        console.log("Antes " + ui.item.index());
		ant=ui.item.index()+1;
    },
	stop: function(event, ui) {
        console.log("Despues " + ui.item.index());
		console.log("ID " + ui.item.attr("id_sort"));
		desp=ui.item.index()+1;

		if((desp-ant)!=0)
	{
		$.ajax({ type: "POST", url: "crud.php",
				data: { acc: "ordenar", id_usuario: $('#id_usuario').val(), id_canal: ui.item.attr("id_sort"), antes: ant, despues: desp},
				beforeSend: function(){

				},
				success: function(data){
					cargar_lista_privada();
			}
			});
	}
    }
});
}

$("#cerrar_sesion").click(function(){
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

$('.sidenav').sidenav({
      menuWidth: 230, // Default is 300
      edge: 'right', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true // Choose whether you can drag to open on touch screens
    });
//$(".dropdown-trigger").dropdown({ hover: false });


$('#check_categoria').click(function(){
	$.ajax({ type: "POST", url: "crud.php",
	data: { acc: "actualizar_check_categoria", check_categoria: $(this).is(':checked'), id_usuario: $("#id_usuario").val()},
	success: function(data){
		console.log(data.mensaje);
		actualizar_lista();
		}
	});
});

$('#check_compartir').click(function(){
	$.ajax({ type: "POST", url: "crud.php",
	data: { acc: "actualizar_check_compartir", check_compartir: $(this).is(':checked'), id_usuario: $("#id_usuario").val()},
	success: function(data){
		console.log(data.mensaje);
		}
	});
});

$('#check_ocultos').click(function(){
		console.log($(this).is(':checked'));
		if($(this).is(':checked')==true)
		{
			$('tr.hide').addClass( "hide_mostrar" );
			$('tr').removeClass("hide");
		}
		else
		{
			$('tr.hide_mostrar').addClass( "hide" );
			$('tr').removeClass("hide_mostrar");
		}
});

function leer_listas_compartidas(){
	$.ajax({ type: "POST", url: "crud.php",
    data: { acc: "leer_listas_compartidas"},
	success: function(data){
	    //console.log(data);
		$('#url_lista').val('http://www.m3u.cl/playlist/'+data[0]['nombre_usuario']);
	    $.each(data, function( index, value ) {
            $('#listas').append($('<option>', {
            value: value["nombre_usuario"],
            text : value["nombre_usuario"]+" ("+value["canales"]+")"
    }));
        });

	}
	});
}

reproducir_canal_privado();
filtrar_canal_privado();
$('.lazy').Lazy();


//cargar_lista_privada();
$('.url.tap-target').tapTarget('open');




var player = videojs('player1',{
          autoplay: true,
          liveui: true,
          liveTracker: true,
          muted: false,
					controlBar: {
					children: [
            'playToggle',
            //'muteToggle',
            'fullscreenToggle',
						'volumeControl'
					],
					volumePanel: false,
					volumeLevel: false,
					volumeBar: true,
					currentDisplay: false,
          timeDivider: false,
          durationDisplay: false
          },
		  languages: {
			es: {
			  "Play": "Reproducir",
			  "Pause": "Pausar",
			  "Current Time": "Tiempo reproducido",
			  "Duration": "Duración total",
			  "Remaining Time": "Tiempo restante",
			  "Mute": "Silenciar sonido",
			  "Unmute": "Activar sonido",
			  "Fullscreen": "Pantalla completa",
			  "LIVE": "En Vivo",
			}
		  },
          language: 'es',
          poster: ""
        });

player.on('volumechange', function () {
		var level = player.volume();
    document.cookie='volumePlayer='+level+'';
});


if($("html").width()>991)
$("#tabla_canales").css('height',$("#player").height()-75);

var tiempo;

$( "td.videojs,.btn.videojs" ).click(function() {
clearInterval(tiempo);
player.src({
	  src: $(this).attr('reproducir_canal'),
	  type: 'application/x-mpegURL'
	});
	$("#editar_nombre").focus();
	$("#editar_id, #reportar_id").val($(this).attr('id_canal'));
	$("#editar_nombre, #reportar_nombre").val($(this).attr('reproducir_nombre_canal'));
	$("#editar_usuario, #reportar_usuario").val($("#id_sesion").val());

guia_programacion($(this).attr('id_canal'), $(this).attr('reproducir_nombre_canal'));
dataLayer.push({'event' : 'evento-ga', 'evento-accion' : 'reproducir', 'evento-etiqueta' : $(this).attr('reproducir_nombre_canal'), 'evento-categoria' : 'privada', 'id_canal': $(this).attr('id_canal'), 'nombre_canal' : $(this).attr('reproducir_nombre_canal'), 'logo-canal': $(this).attr('reproducir_logo_canal'), 'nombre-lista': $(this).attr('nombre_lista'), 'nombre-categoria': $(this).attr('nombre_categoria')});
	$("td").css('background-color','');
	$(this).siblings().css('background-color','#e0f2f1');
	$(this).css('background-color','#e0f2f1');

	clearInterval();
	dataLayer.push({'event' : 'evento-ga', 'evento-accion' : 'tiempo reproduccion', 'evento-etiqueta' : $(this).attr('reproducir_nombre_canal'), 'evento-categoria' : 'reproductor publico', 'id_canal': $(this).attr('id_canal'), 'nombre_canal' : $(this).attr('reproducir_nombre_canal'), 'tiempo_reproduccion' : '0', 'logo-canal': $(this).attr('reproducir_logo_canal'), 'nombre-lista': $(this).attr('nombre_lista'), 'nombre-categoria': $(this).attr('nombre_categoria')});
	var nombre_canal=$(this).attr('reproducir_nombre_canal');
	var id_canal=$(this).attr('id_canal');
	var i=1;
	tiempo = player.setInterval(function(){
		var segundos = i*0.5;
		dataLayer.push({'event' : 'evento-ga', 'evento-accion' : 'tiempo reproduccion', 'evento-etiqueta' : nombre_canal, 'evento-categoria' : 'reproductor publico', 'id_canal': id_canal, 'nombre_canal' : nombre_canal, 'tiempo_reproduccion' : '30', 'logo-canal': $(this).attr('reproducir_logo_canal'), 'nombre-lista': $(this).attr('nombre_lista'), 'nombre-categoria': $(this).attr('nombre_categoria')});
		i++;
		}, 30000);

});

function guia_programacion(id_canal, nombre_canal){

	$.ajax({ type: "POST", url: "crud.php",
				data: { acc: "programacion_canal", id_canal: id_canal},
			success: function(data){
				//console.log(data);
				var programas="";
				$.each(data.programas, function(i, val) {
					programas+="<strong>"+val['nombre']+"</strong> "+val['hora_inicio']+"-"+val['hora_termino']+" hrs | ";
				});
				if(programas=='')
				programas+=" No hay programas destacados,";
				programas+=" Más detalles en <a href='programacion.php'><strong>Programación</strong></a>";
				//document.querySelector("#nombre_canal_guia").innerText=nombre_canal;
				//document.querySelector("#programas_guia").innerHTML=programas;
				}
			});
}


function cargar_lista_favoritos(){
	$.ajax({ type: "POST", url: "crud.php",
    data: { acc: "leer_lista_favoritos", id_usuario: $("#id_sesion").val()},
	success: function(data){
	console.log(data.canales);
    $.each(data.canales, function(i, val) {
			$('input[type="checkbox"].fav[id_fav="'+val['id_canal']+'"]').attr('checked','checked');
	});
	}
	});
}

function canales_favoritos(){
$('input[type="checkbox"].fav').click(function(){
	if($("#id_sesion").val()>0)
	{
	if($(this).is(':checked')==false)
    {
        $.ajax({ type: "POST", url: "crud.php",
        data: { acc: "eliminar_favorito", id_canal: $(this).attr('id_fav'), id_usuario: $("#id_sesion").val()},
        success: function(data){
            console.log(data.mensaje);
						M.toast({html: 'Canal eliminado de favoritos correctamente!', completeCallback: function(){actualizar_lista();}});
						dataLayer.push({'event' : 'evento-ga', 'evento-accion' : 'eliminar favorito', 'evento-etiqueta' : $(this).attr('id_fav'), 'evento-categoria' : 'listas publicas'});
            }
        });
    }
		else 	if($(this).is(':checked')==true)
    {
        $.ajax({ type: "POST", url: "crud.php",
        data: { acc: "agregar_favorito", id_canal: $(this).attr('id_fav'), id_usuario: $("#id_sesion").val()},
        success: function(data){
            console.log(data.mensaje);
						M.toast({html: 'Canal agregado a favoritos correctamente!', completeCallback: function(){actualizar_lista();}});
						dataLayer.push({'event' : 'evento-ga', 'evento-accion' : 'agregar favorito', 'evento-etiqueta' : $(this).attr('id_fav'), 'evento-categoria' : 'listas publicas'});
            }
        });
    }
		}
		else{
			var instance = M.Modal.getInstance($('#player_canal'));
			instance.open();
			dataLayer.push({'event' : 'evento-ga', 'evento-accion' : 'agregar favorito sin usuario', 'evento-etiqueta' : $(this).attr('id_fav'), 'evento-categoria' : 'listas publicas'});
		}

});
}

cargar_lista_favoritos();
canales_favoritos();


function cargar_lista_favoritos_nuevo(){
	$.ajax({ type: "POST", url: "crud2.php",
    data: { acc: "leer_lista_favoritos_nuevo", id_usuario: $("#id_sesion").val()},
	success: function(data){
	console.log(data.canales);
    $.each(data.canales, function(i, val) {
			$('input[type="checkbox"].fav2[id_fav="'+val['id_canal']+'"]').attr('checked','checked');
	});
	}
	});
}

function canales_favoritos_nuevo(){
$('input[type="checkbox"].fav2').click(function(){
	if($("#id_sesion").val()>0)
	{
	if($(this).is(':checked')==false)
    {
        $.ajax({ type: "POST", url: "crud2.php",
        data: { acc: "eliminar_favorito_nuevo", id_canal: $(this).attr('id_fav'), id_usuario: $("#id_sesion").val()},
        success: function(data){
            console.log(data.mensaje);
						M.toast({html: 'Canal eliminado de favoritos correctamente!', completeCallback: function(){actualizar_lista();}});
						dataLayer.push({'event' : 'evento-ga', 'evento-accion' : 'eliminar favorito', 'evento-etiqueta' : $(this).attr('id_fav'), 'evento-categoria' : 'listas publicas'});
            }
        });
    }
		else 	if($(this).is(':checked')==true)
    {
        $.ajax({ type: "POST", url: "crud2.php",
        data: { acc: "agregar_favorito_nuevo", id_canal: $(this).attr('id_fav'), id_usuario: $("#id_sesion").val()},
        success: function(data){
            console.log(data.mensaje);
						M.toast({html: 'Canal agregado a favoritos correctamente!', completeCallback: function(){actualizar_lista();}});
						dataLayer.push({'event' : 'evento-ga', 'evento-accion' : 'agregar favorito', 'evento-etiqueta' : $(this).attr('id_fav'), 'evento-categoria' : 'listas publicas'});
            }
        });
    }
		}
		else{
			var instance = M.Modal.getInstance($('#player_canal'));
			instance.open();
			dataLayer.push({'event' : 'evento-ga', 'evento-accion' : 'agregar favorito sin usuario', 'evento-etiqueta' : $(this).attr('id_fav'), 'evento-categoria' : 'listas publicas'});
		}

});
}

cargar_lista_favoritos_nuevo();
canales_favoritos_nuevo();

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

var percent = getCookie('volumePlayer').replace('"', "").replace('"', "");
console.log(percent);
player.volume(percent);

$("#guardar_crear_canal").click(function(){
	var url=$("#agregar_url").val();
	var email=$("#email").val();
	var patron_email = /\S+@\S+\.\S+/;
	if($("#agregar_nombre").val()=='')
	{
		$("#agregar_nombre").focus();
		alert("Debes ingresar el nombre del canal");
	}
	else
	if($("#agregar_url").val()=='')
	{
		$("#agregar_url").focus();
		alert("Debes ingresar la URL m3u8 del canal");
	}
	/*else
	if(url.search(patron_url))
	{
		$("#agregar_url").focus();
		alert("Debes ingresar la URL m3u8 del canal");
	}*/
	else
	{
		$.ajax({ type: "POST", url: "crud.php",
						data: { acc: "agregar_canal", id_usuario:$("#id_sesion").val(), id_lista:$("#id_lista").val(), nombre_canal:$("#agregar_nombre").val(), url_canal:$("#agregar_url").val(), logo_canal:$("#agregar_logo").val(), comentario:$("#agregar_comentario").val()},
						success: function(data){
              var instance = M.Modal.getInstance($('#agregar_canal'));
              instance.close();
              M.toast({html: 'Solicitud ingresada correctamente!', completeCallback: function(){}});
							//$("#nuevo_canal").addClass("hide");
							//$("#nuevo_canal_mensaje").removeClass("hide");
						}
					});
	}

});

$("#guardar_editar_canal_opciones").click(function(){

	if($("#editar_comentario").val()=='')
	{
		$("#editar_comentario").focus();
		alert("Debes ingresar un motivo para la edición del canal");
	}
	else
	{
		$.ajax({ type: "POST", url: "crud.php",
						data: { acc: "editar_canal", id_usuario:$("#id_sesion").val(), id_lista:$("#id_lista").val(), id_canal:$("#editar_id").val(), nombre_canal:$("#editar_nombre").val(), url_canal:$("#editar_url").val(), comentario:$("#editar_comentario").val()},
						success: function(data){
              var instance = M.Modal.getInstance($('#editar_canal'));
              instance.close();
              M.toast({html: 'Solicitud de edición ingresada correctamente!', completeCallback: function(){}});
							//$("#nuevo_canal").addClass("hide");
							//$("#nuevo_canal_mensaje").removeClass("hide");
						}
					});
	}

});

$("#guardar_reportar_canal").click(function(){

	if($("#reportar_comentario").val()=='')
	{
		$("#reportar_comentario").focus();
		alert("Debes ingresar un motivo para reportar el canal");
	}
	else
	{
		$.ajax({ type: "POST", url: "crud.php",
						data: { acc: "reportar_canal", id_usuario:$("#id_sesion").val(), id_lista:$("#id_lista").val(), id_canal:$("#reportar_id").val(), nombre_canal:$("#reportar_nombre").val(), comentario:$("#reportar_comentario").val()},
						success: function(data){
              var instance = M.Modal.getInstance($('#reportar_canal'));
              instance.close();
              M.toast({html: 'El reporte del canal ha sido ingresado correctamente!', completeCallback: function(){}});
							//$("#nuevo_canal").addClass("hide");
							//$("#nuevo_canal_mensaje").removeClass("hide");
						}
					});
	}

});


$( ".btn.editar_canal" ).click(function() {
var instance = M.Modal.getInstance($('#editar_canal'));
instance.open();
$("#editar_url").val("");
$("#editar_comentario").val("");
});

$( ".btn.reportar_canal" ).click(function() {
var instance = M.Modal.getInstance($('#reportar_canal'));
instance.open();
$("#reportar_comentario").val("");
});

$( ".btn.agregar_canal" ).click(function() {
$("#agregar_nombre").val("");
$("#agregar_url").val("");
$("#agregar_logo").val("");
$("#agregar_comentario").val("");
$("#agregar_nombre").focus();
var instance = M.Modal.getInstance($('#agregar_canal'));
instance.open();
});
