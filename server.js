const express = require('express');
const app = express();
const msql = require("mysql");
const cors = require('cors');
const AES = require('mysql-aes')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer');

const _ = require('lodash');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

    // config for your database
const con = msql.createConnection({
        
        user: 'root',
        password: 'admin',
        host: 'LAPTOP-AKALA047',
        database: 'plataforma',
        host: 'localhost',
        
    });

const con2 = msql.createConnection({
        
        user: 'root',
        password: 'admin',
        host: 'LAPTOP-AKALA047',
        database: 'datosprueba',
        host: 'localhost',
        
    });
var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'joaquin.bahamonde.b@gmail.com',
          pass: 'cako310979'
        }
});
con.connect(function (err) {

        if (err) console.log(err);
        console.log("Connected!");
       });

con2.connect(function (err) {

    if (err) console.log(err);
        console.log("Connected!");
     });
     
app.use(expressJwt({secret: 'todo-app-super-shared-secret'}).unless({path: ['/auth', '/addUsuario']}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
app.use(bodyParser.json());

app.post('/auth', function(req, res) {
    const body = req.body;
    console.log(req.body.username);
    console.log(req.body.password);
    const select_query=`SELECT COUNT(*) as total FROM usuarios where rut='${req.body.username}' AND CAST(AES_DECRYPT(pass, 'encriptado') AS CHAR)='${req.body.password}';`
    con.query(select_query, (err, result) => {
        console.log(result[0].total);
        if (err){
            return res.sendStatus(401);
        }else if(result[0].total>0){
            
                console.log("entreeeee");
                const select_query2=`SELECT COUNT(*) as total FROM usuarios where rut='${req.body.username}' AND cargo="Administrador";`
                con.query(select_query2, (err2, result2) => {
                    console.log(result2[0].total);
                    if (err2){
                        return res.sendStatus(401);
                    }else if(result2[0].total>0){
                        
                            console.log("admin");
                            var cargo ="administrador";
                            var token = jwt.sign({userID: req.body.username}, 'todo-app-super-shared-secret');
                            res.send({token,cargo});
                    }else{
                        const select_query3=`SELECT COUNT(*) as total FROM usuarios where rut='${req.body.username}' AND cargo="Jefe Brigada";`
                        con.query(select_query3, (err3, result3) => {
                            console.log(result3[0].total);
                            if (err3){
                                return res.sendStatus(401);
                            }else if(result3[0].total>0){     
                                console.log("jefe");
                                var cargo ="jefe_brigada";
                                var token = jwt.sign({userID: req.body.username}, 'todo-app-super-shared-secret');
                                res.send({token,cargo});
                            }else{
                                const select_query4=`SELECT COUNT(*) as total FROM usuarios where rut='${req.body.username}' AND cargo="Super Administrador";`
                                con.query(select_query4, (err4, result4) => {
                                    console.log(result4[0].total);
                                    if (err4){
                                        return res.sendStatus(401);
                                    }else if(result4[0].total>0){     
                                        console.log("super administrador");
                                        var cargo ="super_admin";
                                        var token = jwt.sign({userID: req.body.username}, 'todo-app-super-shared-secret');
                                        res.send({token,cargo});
                                    }else{
                                        return res.sendStatus(401);
                                    }    
                                });
                            }    
                        });
                    }     
                });  
        }else{
            return res.sendStatus(401);
        }
        
    });
});













app.post('/contacto', bodyParser.json(), (req, res, next) => {
    //const INSERT_TIPO_QUERY = `INSERT INTO brigadistas VALUES('${req.body.rut}','${req.body.correo}','${req.body.nombre}','${req.body.apellidoP}','${req.body.apellidoM}','${req.body.f_nacimiento}',${req.body.n_brigada},'${req.body.cargo}',${req.body.peso},${req.body.altura},0,${req.body.pulsera}
    console.log(req.body.phone);
    var mailOptions = {
        from: 'joaquin.bahamonde.b@gmail.com',
        to: 'thevalone@gmail.com',
        subject: req.body.asunto,
        text: req.body.nombre+ ' se quiere contactar contigo. Sus datos son: \n Teléfono: ' + req.body.phone + '\n Correo: ' + req.body.correo + '\n Mensaje: ' + req.body.mensaje
    };
    console.log(transporter);
    console.log(mailOptions);

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);

        } else {
            res.json(res.body);
          console.log('Email sent: ' + info.response);
        }
      });

});
app.get('/usuarios', (req, res) => {
       const select_query=`SELECT usuario, CAST(AES_DECRYPT(pass, 'encriptado') AS CHAR) as pass
       FROM Usuarios;`
    con.query(select_query, (err, result) => {
        console.log(result);
        if (err){
          	return res.send(err)
       	}else{
           	return res.json({

                   data: result

           	})
        }
   	});
});

app.get('/admin', (req, res) => {
    const select_query=`SELECT *
    FROM Usuarios WHERE cargo="Administrador" OR cargo="Super Administrador";`
 con.query(select_query, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});


app.get('/estadoBrigadas', (req, res) => {
    const select_query=`SELECT b.nombre,c.estado, c.n_brigada, b.rut_jefe, c.id FROM combatesbrigada as c, brigada as b WHERE estado=1 and c.n_brigada=b.n_brigada AND c.nombre_brigada=b.nombre;`
    con.query(select_query, (err, result) => {
     console.log("esatdo "+result);
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
     }
    });
});




app.get('/FatigaBajaBrigadas', (req, res) => {
    const select_query=`SELECT IFNULL(a.fatigaBaja, 0) as fatigaBaja, d.nombre,d.n_brigada, d.estado, d.id
    FROM (SELECT b.nombre, b.n_brigada , c.estado, c.id
		FROM brigada as b, combatesbrigada as c
        WHERE b.n_brigada = c.n_brigada AND b.nombre=c.nombre_brigada AND c.estado=1
        ) as d
    LEFT JOIN (
        SELECT count(b.fatigado) as fatigaBaja, b.nombre_brigada, b.n_brigada, c.estado, c.id
        FROM brigadistas as b, combatesbrigada as c
        WHERE b.fatigado = 0 AND b.n_brigada=c.n_brigada AND b.nombre_brigada=c.nombre_brigada AND c.estado=1
        group by b.n_brigada
    ) as a
    ON d.n_brigada=a.n_brigada AND d.nombre =a.nombre_brigada
    ORDER BY d.n_brigada;`
    con.query(select_query, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.get('/FatigaMediaBrigadas', (req, res) => {
    const select_query=`SELECT IFNULL(a.fatigaMedia, 0) as fatigaMedia, d.nombre,d.n_brigada, d.estado, d.id
    FROM (SELECT b.nombre, b.n_brigada , c.estado, c.id
		FROM brigada as b, combatesbrigada as c
        WHERE b.n_brigada = c.n_brigada AND b.nombre=c.nombre_brigada AND c.estado=1
        ) as d
    LEFT JOIN (
        SELECT count(b.fatigado) as fatigaMedia, b.nombre_brigada, b.n_brigada, c.estado, c.id
        FROM brigadistas as b, combatesbrigada as c
        WHERE b.fatigado = 1 AND b.n_brigada=c.n_brigada AND b.nombre_brigada=c.nombre_brigada AND c.estado=1
        group by b.n_brigada
    ) as a
    ON d.n_brigada=a.n_brigada AND d.nombre =a.nombre_brigada
    ORDER BY d.n_brigada;`
    con.query(select_query, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.get('/FatigaAltaBrigadas', (req, res) => {
    const select_query=`SELECT IFNULL(a.fatigaAlta, 0) as fatigaAlta, d.nombre,d.n_brigada, d.estado, d.id
    FROM (SELECT b.nombre, b.n_brigada , c.estado, c.id
		FROM brigada as b, combatesbrigada as c
        WHERE b.n_brigada = c.n_brigada AND b.nombre=c.nombre_brigada AND c.estado=1
        ) as d
    LEFT JOIN (
        SELECT count(b.fatigado) as fatigaAlta, b.nombre_brigada, b.n_brigada, c.estado, c.id
        FROM brigadistas as b, combatesbrigada as c
        WHERE b.fatigado = 2 AND b.n_brigada=c.n_brigada AND b.nombre_brigada=c.nombre_brigada AND c.estado=1
        group by b.n_brigada
    ) as a
    ON d.n_brigada=a.n_brigada AND d.nombre =a.nombre_brigada
    ORDER BY d.n_brigada;`
    con.query(select_query, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});


app.get('/brigadas', (req, res) => {

    const select_query=`SELECT b.n_brigada, b.rut_jefe, u.nombre, u.apellidoP, u.apellidoM, b.nombre as nombre_brigada FROM Brigada as b, Usuarios as u WHERE b.rut_jefe = u.rut ORDER BY n_brigada;`
 con.query(select_query, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.put('/modUsuario/:id', (req, res) => {
    var id=req.params.id;
    console.log(id);
    const upd_query = `UPDATE usuarios SET usuario='${req.body.usuario}', pass=AES_ENCRYPT('${req.body.pass}','encriptado'), correo='${req.body.correo}', rut='${req.body.rut}', nombre='${req.body.nombre}', apellidoP = '${req.body.apellidoP}', apellidoM='${req.body.apellidoM}', cargo='${req.body.cargo}' WHERE rut =?;`
    console.log(upd_query);
    con.query(upd_query, id, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result

            })
     }
    });
});
app.get('/personal/:id', (req, res) => {
    var id=req.params.id;
    console.log(id);
    const select_query=`SELECT usuario, CAST(AES_DECRYPT(pass, 'encriptado') AS CHAR) as pass, correo, rut, nombre, apellidoP, apellidoM, cargo FROM usuarios where rut = ?;`
    console.log(select_query)
    con.query(select_query,id, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result

            })
     }
    });
});

app.get('/brigadasCombate/:id', (req, res) => {
    var id=req.params.id;
    console.log(id);
    const select_query=`select n_brigada from combatesbrigada where id=?;`
    console.log(select_query)
    con.query(select_query,id, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result

            })
     }
    });
});

app.get('/combatesFin/:id', (req, res) => {
    var id=req.params.id;
    console.log(id);
    const select_query=`select nombre_brigada, n_brigada, id, DATE_FORMAT(fecha, '%Y-%m-%d') as fecha, hora, DATE_FORMAT(fecharetiro, '%Y-%m-%d') as fecharetiro, horaretiro from combatesbrigadafin where id=?;`
    console.log(select_query)
    con.query(select_query,id, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result

            })
     }
    });
});

app.get('/combates', (req, res) => {

    const select_query=`SELECT *,DATE_FORMAT(fecha, '%d/%m/%y') as fecha FROM Combate;`
    con.query(select_query, (err, result) => {
    console.log(result);
    if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});
app.get('/combatesBrig:id', (req, res) => {
    var id=req.params.id;
    console.log(id);
    const select_query=`
        SELECT nombre_brigada, n_brigada, id, DATE_FORMAT(fecha, '%d/%m/%y') as fecha, DATE_FORMAT(hora, '%H:%i') as hora, estado 
        FROM combatesbrigada
        where id = ?;`
    con.query(select_query,id, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result

            })
     }
    });
});
app.get('/nbrigadas', (req, res) => {
    const select_query=`SELECT COUNT(brigada.n_brigada) AS numero FROM brigada,combatesbrigada WHERE brigada.n_brigada=combatesbrigada.n_brigada AND combatesbrigada.estado=1 AND brigada.nombre=combatesbrigada.nombre_brigada;`
    con.query(select_query, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
     }
    });
});


app.get('/maxbrigada:id', (req, res) => {
    var id=req.params.id;
    const select_query=`SELECT max(n_brigada) AS max FROM brigada where nombre = ?;`
    con.query(select_query, id, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
     }
    });
});


app.get('/brigadasPorNombre:id', (req, res) => {
    var id=req.params.id;
    const select_query=`SELECT n_brigada FROM brigada where nombre = ? ORDER BY n_brigada ASC;`
    con.query(select_query, id, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
     }
    });
});
app.get('/nombresbrigadas',(req, res) => {
    const select_query=`SELECT * FROM nombrebrig ORDER BY nombre ASC;`
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            console.log(result);

            return res.json({
                data: result
            });
        }
    });

});
app.get('/nbrigadas:id', (req, res) => {
    var id=req.params.id;
    console.log(id);
    const select_query=`SELECT nombre, n_brigada FROM brigada WHERE rut_jefe=?;`
    con.query(select_query,id, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
     }
    });
});

app.get('/jefes', (req, res) => {
    const select_query=`SELECT * FROM Usuarios WHERE cargo="Jefe Brigada";`
    con.query(select_query, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
     }
    });
});

app.get('/npulseras', (req, res) => {
    const select_query=`SELECT COUNT(id) AS numero FROM pulsera;`
    con.query(select_query, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
     }
    });
});

app.get('/pulserasnousadas',(req, res) => {
    const select_query=`SELECT p.id FROM pulsera as p WHERE p.id NOT IN(
        SELECT p2.id FROM pulsera as p2, brigadistas as b WHERE p2.id = b.pulsera
    
    );`
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            console.log(result);

            return res.json({
                data: result
            });
        }
    });

});

app.get('/pulseraAct/:id',(req, res) => {
    var id=req.params.id;
    const select_query=`SELECT pulsera from brigadistas where rut =?;`
    con.query(select_query,id, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            console.log(result);

            return res.json({
                data: result
            });
        }
    });

});

app.get('/brigadistas', (req, res) => {
    var id=req.param('n_brigada');
    var id2 = req.param('nombre');

    console.log("Holaaaa: " + id);
    console.log("Holaaaa2: " + id2);
    const select_query=`SELECT *, DATE_FORMAT(f_nacimiento, '%Y-%m-%d') as f_nacimiento FROM Brigadistas WHERE n_brigada=? AND nombre_brigada=?;`
    con.query(select_query,[id,id2], (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.get('/jefeBrigada', (req, res) => {
    var id=req.param('n_brigada');
    var id2 = req.param('nombre');

    console.log("Holaaaa: " + id);
    console.log("Holaaaa2: " + id2);
    select_query=`SELECT * FROM brigada WHERE n_brigada=? AND nombre = ?; `
    con.query(select_query,[id, id2], (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            console.log("Hola soy la respuesta : " + res);
            return res.json({

                data: result

            })
     }
    });
});
app.get('/brigadista/:id', (req, res) => {
    var id=req.params.id;
    console.log(id);
    const select_query=`SELECT * FROM brigadistas WHERE rut=?; `
    con.query(select_query,id, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.get('/hito/:id', (req, res) => {
    var id=req.params.id;
    console.log(id);
    const select_query=`SELECT hito FROM combate WHERE id=?; `
    con.query(select_query,id, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.get('/maxCombat',(req, res) => {
    const select_query=`SELECT max(id) as combate FROM combate;`
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            console.log(result);

            return res.json({
                data: result
            });
        }
    });

});

app.get('/nEspera',(req, res) => {
    const select_query=`SELECT COUNT(*) as numero FROM espera;`
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            console.log(result);

            return res.json({
                data: result
            });
        }
    });

});

app.get('/listaEspera',(req, res) => {
    const select_query=`SELECT *, CAST(AES_DECRYPT(pass, 'encriptado') AS CHAR) as pass2 FROM espera;`
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            console.log(result);

            return res.json({
                data: result
            });
        }
    });

});


app.get('/combActivos',(req, res) => {
    const select_query=`SELECT *, DATE_FORMAT(fecha, '%Y-%m-%d') as fecha FROM combate WHERE estado=1;`
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            console.log(result);

            return res.json({
                data: result
            });
        }
    });

});


app.get('/combMes',(req, res) => {
    const select_query=`SELECT c.id, c.estado,c.hito,  DATE_FORMAT(c.fecha, '%Y-%m-%d') as fecha, c.hora,   DATE_FORMAT(cf.fechafin, '%Y-%m-%d') as fechafin, cf.horafin
    FROM(
        SELECT *
        FROM combate as c2
        WHERE c2.fecha <= now() AND c2.fecha > DATE_SUB(now(), INTERVAL 1 MONTH)
    ) as c
    LEFT JOIN combatefin as cf
    ON c.id = cf.id;`
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            console.log(result);

            return res.json({
                data: result
            });
        }
    });

});


app.get('/combMes2',(req, res) => {

    var fechatotal = new Date();
            var mes;
            var dia;
            let fechaAux = fechatotal.getMonth()+1;
            if(fechaAux>=0 && fechaAux<=9){
                //console.log("Entre aquí");
                console.log(fechatotal.getMonth());
                console.log(fechaAux);
                console.log(fechaAux.toString());
                mes = "0" + fechaAux;
            }else{
                mes = fechatotal.getMonth() + 1;
            }
            let diaAux = fechatotal.getDate();
            if(diaAux>=0 && diaAux<=9){
                dia = "0" + diaAux;
            }else{
                dia = fechatotal.getDate();
            }
            var fecha = fechatotal.getFullYear()+'-'+mes+'-'+dia;

    var horatotal =  new Date();
            var hora;
            var minuto;
            var segundo;
            let horaAux = horatotal.getHours();
            if(horaAux>=0 && horaAux<=9){
                hora = "0" + horaAux;
            }else{
                hora = horatotal.getHours();
            }

            let minutoAux = horatotal.getMinutes();
            if(minutoAux>=0 && minutoAux<=9){
                minuto = "0" + minutoAux;
            }else{
                minuto = horatotal.getMinutes();
            }

            let segundoAux = horatotal.getSeconds();

            if(segundoAux>=0 && segundoAux<=9){
                segundo = "0" + segundoAux;
            }else{
                segundo = horatotal.getSeconds();
            }

            var horafinal = hora + ":" + minuto + ":" + segundo;

            console.log("Fechaaaaa:" + fecha);
            console.log("Hora fin:" + horafinal);

            
    const select_query=`SELECT c.nombre_brigada, c.n_brigada, c.id, c.estado ,DATE_FORMAT(c.fecha, '%Y-%m-%d') as fecha , c.hora, IFNULL(cf.fecharetiro, '${fecha}') as fechafin ,IFNULL(cf.horaretiro, '${horafinal}')  as horafin, c.nMedia, c.nAlta,c.idcombate
    FROM(
        SELECT *
        FROM combatesbrigada as c2, (	
			select COUNT(f.n_brigada) as nMedia, f.id as idcombate
			from (select br.rut, b.nombre, b.n_brigada, co.id, h.fatiga
			from brigadistas as br, brigada as b, combatesbrigada as co, historialfatiga as h
			where br.nombre_brigada=b.nombre AND br.n_brigada=b.n_brigada AND b.nombre=co.nombre_brigada AND b.n_brigada=co.n_brigada AND br.rut = h.rut AND co.id = h.idcombate AND h.fatiga=1
			group by br.rut) as f
			group by f.nombre, f.n_brigada, f.id
		) as d, (	
			select COUNT(f.n_brigada) as nAlta, f.id as idcombate2
			from (select br.rut, b.nombre, b.n_brigada, co.id, h.fatiga
			from brigadistas as br, brigada as b, combatesbrigada as co, historialfatiga as h
			where br.nombre_brigada=b.nombre AND br.n_brigada=b.n_brigada AND b.nombre=co.nombre_brigada AND b.n_brigada=co.n_brigada AND br.rut = h.rut AND co.id = h.idcombate AND h.fatiga=2
			group by br.rut) as f
			group by f.nombre, f.n_brigada, f.id
		) as d2
       WHERE c2.fecha <= now() AND c2.fecha > DATE_SUB(now(), INTERVAL 1 MONTH) AND c2.id=d.idcombate AND c2.id = d2.idcombate2 AND d.idcombate =d2.idcombate2
    ) as c
    LEFT JOIN combatesbrigadafin as cf
    ON c.id = cf.id and c.nombre_brigada=cf.nombre_brigada and c.n_brigada=cf.n_brigada and c.fecha=cf.fecha and c.hora=cf.hora;
    
    `
    
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            console.log(result);

            return res.json({
                data: result
            });
        }
    });

});



app.get('/comb6Mes',(req, res) => {

    var fechatotal = new Date();
            var mes;
            var dia;
            let fechaAux = fechatotal.getMonth()+1;
            if(fechaAux>=0 && fechaAux<=9){
                //console.log("Entre aquí");
                console.log(fechatotal.getMonth());
                console.log(fechaAux);
                console.log(fechaAux.toString());
                mes = "0" + fechaAux;
            }else{
                mes = fechatotal.getMonth() + 1;
            }
            let diaAux = fechatotal.getDate();
            if(diaAux>=0 && diaAux<=9){
                dia = "0" + diaAux;
            }else{
                dia = fechatotal.getDate();
            }
            var fecha = fechatotal.getFullYear()+'-'+mes+'-'+dia;

    var horatotal =  new Date();
            var hora;
            var minuto;
            var segundo;
            let horaAux = horatotal.getHours();
            if(horaAux>=0 && horaAux<=9){
                hora = "0" + horaAux;
            }else{
                hora = horatotal.getHours();
            }

            let minutoAux = horatotal.getMinutes();
            if(minutoAux>=0 && minutoAux<=9){
                minuto = "0" + minutoAux;
            }else{
                minuto = horatotal.getMinutes();
            }

            let segundoAux = horatotal.getSeconds();

            if(segundoAux>=0 && segundoAux<=9){
                segundo = "0" + segundoAux;
            }else{
                segundo = horatotal.getSeconds();
            }

            var horafinal = hora + ":" + minuto + ":" + segundo;

            console.log("Fechaaaaa:" + fecha);
            console.log("Hora fin:" + horafinal);
    const select_query=`SELECT c.id, c.hito, c.estado, DATE_FORMAT(c.fecha, '%Y-%m-%d') as fecha , c.hora, IFNULL(cf.fechafin, '${fecha}') as fechafin ,IFNULL(cf.horafin, '${horafinal}')  as horafin
    FROM(
        SELECT *
        FROM combate as c2
        WHERE c2.fecha <= now() AND c2.fecha > DATE_SUB(now(), INTERVAL 6 MONTH)
    ) as c
    LEFT JOIN combatefin as cf
    ON c.id = cf.id;`
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            console.log(result);

            return res.json({
                data: result
            });
        }
    });

});



app.get('/comb6Mes2',(req, res) => {

    var fechatotal = new Date();
            var mes;
            var dia;
            let fechaAux = fechatotal.getMonth()+1;
            if(fechaAux>=0 && fechaAux<=9){
                //console.log("Entre aquí");
                console.log(fechatotal.getMonth());
                console.log(fechaAux);
                console.log(fechaAux.toString());
                mes = "0" + fechaAux;
            }else{
                mes = fechatotal.getMonth() + 1;
            }
            let diaAux = fechatotal.getDate();
            if(diaAux>=0 && diaAux<=9){
                dia = "0" + diaAux;
            }else{
                dia = fechatotal.getDate();
            }
            var fecha = fechatotal.getFullYear()+'-'+mes+'-'+dia;

    var horatotal =  new Date();
            var hora;
            var minuto;
            var segundo;
            let horaAux = horatotal.getHours();
            if(horaAux>=0 && horaAux<=9){
                hora = "0" + horaAux;
            }else{
                hora = horatotal.getHours();
            }

            let minutoAux = horatotal.getMinutes();
            if(minutoAux>=0 && minutoAux<=9){
                minuto = "0" + minutoAux;
            }else{
                minuto = horatotal.getMinutes();
            }

            let segundoAux = horatotal.getSeconds();

            if(segundoAux>=0 && segundoAux<=9){
                segundo = "0" + segundoAux;
            }else{
                segundo = horatotal.getSeconds();
            }

            var horafinal = hora + ":" + minuto + ":" + segundo;

            console.log("Fechaaaaa:" + fecha);
            console.log("Hora fin:" + horafinal);
    const select_query=`SELECT c.nombre_brigada, c.n_brigada, c.id, c.estado ,DATE_FORMAT(c.fecha, '%Y-%m-%d') as fecha , c.hora, IFNULL(cf.fecharetiro, '${fecha}') as fechafin ,IFNULL(cf.horaretiro, '${horafinal}')  as horafin, c.nMedia, c.nAlta,c.idcombate
    FROM(
        SELECT *
        FROM combatesbrigada as c2, (	
			select COUNT(f.n_brigada) as nMedia, f.id as idcombate
			from (select br.rut, b.nombre, b.n_brigada, co.id, h.fatiga
			from brigadistas as br, brigada as b, combatesbrigada as co, historialfatiga as h
			where br.nombre_brigada=b.nombre AND br.n_brigada=b.n_brigada AND b.nombre=co.nombre_brigada AND b.n_brigada=co.n_brigada AND br.rut = h.rut AND co.id = h.idcombate AND h.fatiga=1
			group by br.rut) as f
			group by f.nombre, f.n_brigada, f.id
		) as d, (	
			select COUNT(f.n_brigada) as nAlta, f.id as idcombate2
			from (select br.rut, b.nombre, b.n_brigada, co.id, h.fatiga
			from brigadistas as br, brigada as b, combatesbrigada as co, historialfatiga as h
			where br.nombre_brigada=b.nombre AND br.n_brigada=b.n_brigada AND b.nombre=co.nombre_brigada AND b.n_brigada=co.n_brigada AND br.rut = h.rut AND co.id = h.idcombate AND h.fatiga=2
			group by br.rut) as f
			group by f.nombre, f.n_brigada, f.id
		) as d2
       WHERE c2.fecha <= now() AND c2.fecha > DATE_SUB(now(), INTERVAL 6 MONTH) AND c2.id=d.idcombate AND c2.id = d2.idcombate2 AND d.idcombate =d2.idcombate2
    ) as c
    LEFT JOIN combatesbrigadafin as cf
    ON c.id = cf.id and c.nombre_brigada=cf.nombre_brigada and c.n_brigada=cf.n_brigada and c.fecha=cf.fecha and c.hora=cf.hora;
    
    `

    
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            console.log(result);

            return res.json({
                data: result
            });
        }
    });

});





app.get('/combAnyo',(req, res) => {

    var fechatotal = new Date();
            var mes;
            var dia;
            let fechaAux = fechatotal.getMonth()+1;
            if(fechaAux>=0 && fechaAux<=9){
                //console.log("Entre aquí");
                console.log(fechatotal.getMonth());
                console.log(fechaAux);
                console.log(fechaAux.toString());
                mes = "0" + fechaAux;
            }else{
                mes = fechatotal.getMonth() + 1;
            }
            let diaAux = fechatotal.getDate();
            if(diaAux>=0 && diaAux<=9){
                dia = "0" + diaAux;
            }else{
                dia = fechatotal.getDate();
            }
            var fecha = fechatotal.getFullYear()+'-'+mes+'-'+dia;

    var horatotal =  new Date();
            var hora;
            var minuto;
            var segundo;
            let horaAux = horatotal.getHours();
            if(horaAux>=0 && horaAux<=9){
                hora = "0" + horaAux;
            }else{
                hora = horatotal.getHours();
            }

            let minutoAux = horatotal.getMinutes();
            if(minutoAux>=0 && minutoAux<=9){
                minuto = "0" + minutoAux;
            }else{
                minuto = horatotal.getMinutes();
            }

            let segundoAux = horatotal.getSeconds();

            if(segundoAux>=0 && segundoAux<=9){
                segundo = "0" + segundoAux;
            }else{
                segundo = horatotal.getSeconds();
            }

            var horafinal = hora + ":" + minuto + ":" + segundo;

            console.log("Fechaaaaa:" + fecha);
            console.log("Hora fin:" + horafinal);
    const select_query=`SELECT c.id, c.hito, c.estado,DATE_FORMAT(c.fecha, '%Y-%m-%d') as fecha , c.hora, IFNULL(cf.fechafin, '${fecha}') as fechafin ,IFNULL(cf.horafin, '${horafinal}')  as horafin
    FROM(
        SELECT *
        FROM combate as c2
        WHERE c2.fecha <= now() AND c2.fecha > DATE_SUB(now(), INTERVAL 12 MONTH)
    ) as c
    LEFT JOIN combatefin as cf
    ON c.id = cf.id;`
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            console.log(result);

            return res.json({
                data: result
            });
        }
    });

});



app.get('/combAnyo2',(req, res) => {

    var fechatotal = new Date();
            var mes;
            var dia;
            let fechaAux = fechatotal.getMonth()+1;
            if(fechaAux>=0 && fechaAux<=9){
                //console.log("Entre aquí");
                console.log(fechatotal.getMonth());
                console.log(fechaAux);
                console.log(fechaAux.toString());
                mes = "0" + fechaAux;
            }else{
                mes = fechatotal.getMonth() + 1;
            }
            let diaAux = fechatotal.getDate();
            if(diaAux>=0 && diaAux<=9){
                dia = "0" + diaAux;
            }else{
                dia = fechatotal.getDate();
            }
            var fecha = fechatotal.getFullYear()+'-'+mes+'-'+dia;

    var horatotal =  new Date();
            var hora;
            var minuto;
            var segundo;
            let horaAux = horatotal.getHours();
            if(horaAux>=0 && horaAux<=9){
                hora = "0" + horaAux;
            }else{
                hora = horatotal.getHours();
            }

            let minutoAux = horatotal.getMinutes();
            if(minutoAux>=0 && minutoAux<=9){
                minuto = "0" + minutoAux;
            }else{
                minuto = horatotal.getMinutes();
            }

            let segundoAux = horatotal.getSeconds();

            if(segundoAux>=0 && segundoAux<=9){
                segundo = "0" + segundoAux;
            }else{
                segundo = horatotal.getSeconds();
            }

            var horafinal = hora + ":" + minuto + ":" + segundo;

            console.log("Fechaaaaa:" + fecha);
            console.log("Hora fin:" + horafinal);
    const select_query=`SELECT c.nombre_brigada, c.n_brigada, c.id, c.estado ,DATE_FORMAT(c.fecha, '%Y-%m-%d') as fecha , c.hora, IFNULL(cf.fecharetiro, '${fecha}') as fechafin ,IFNULL(cf.horaretiro, '${horafinal}')  as horafin, c.nMedia, c.nAlta,c.idcombate
    FROM(
        SELECT *
        FROM combatesbrigada as c2, (	
			select COUNT(f.n_brigada) as nMedia, f.id as idcombate
			from (select br.rut, b.nombre, b.n_brigada, co.id, h.fatiga
			from brigadistas as br, brigada as b, combatesbrigada as co, historialfatiga as h
			where br.nombre_brigada=b.nombre AND br.n_brigada=b.n_brigada AND b.nombre=co.nombre_brigada AND b.n_brigada=co.n_brigada AND br.rut = h.rut AND co.id = h.idcombate AND h.fatiga=1
			group by br.rut) as f
			group by f.nombre, f.n_brigada, f.id
		) as d, (	
			select COUNT(f.n_brigada) as nAlta, f.id as idcombate2
			from (select br.rut, b.nombre, b.n_brigada, co.id, h.fatiga
			from brigadistas as br, brigada as b, combatesbrigada as co, historialfatiga as h
			where br.nombre_brigada=b.nombre AND br.n_brigada=b.n_brigada AND b.nombre=co.nombre_brigada AND b.n_brigada=co.n_brigada AND br.rut = h.rut AND co.id = h.idcombate AND h.fatiga=2
			group by br.rut) as f
			group by f.nombre, f.n_brigada, f.id
		) as d2
       WHERE c2.fecha <= now() AND c2.fecha > DATE_SUB(now(), INTERVAL 12 MONTH) AND c2.id=d.idcombate AND c2.id = d2.idcombate2 AND d.idcombate =d2.idcombate2
    ) as c
    LEFT JOIN combatesbrigadafin as cf
    ON c.id = cf.id and c.nombre_brigada=cf.nombre_brigada and c.n_brigada=cf.n_brigada and c.fecha=cf.fecha and c.hora=cf.hora;
    
    `
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            console.log(result);

            return res.json({
                data: result
            });
        }
    });

});



app.get('/combTodos',(req, res) => {

    var fechatotal = new Date();
            var mes;
            var dia;
            let fechaAux = fechatotal.getMonth()+1;
            if(fechaAux>=0 && fechaAux<=9){
                //console.log("Entre aquí");
                console.log(fechatotal.getMonth());
                console.log(fechaAux);
                console.log(fechaAux.toString());
                mes = "0" + fechaAux;
            }else{
                mes = fechatotal.getMonth() + 1;
            }
            let diaAux = fechatotal.getDate();
            if(diaAux>=0 && diaAux<=9){
                dia = "0" + diaAux;
            }else{
                dia = fechatotal.getDate();
            }
            var fecha = fechatotal.getFullYear()+'-'+mes+'-'+dia;

    var horatotal =  new Date();
            var hora;
            var minuto;
            var segundo;
            let horaAux = horatotal.getHours();
            if(horaAux>=0 && horaAux<=9){
                hora = "0" + horaAux;
            }else{
                hora = horatotal.getHours();
            }

            let minutoAux = horatotal.getMinutes();
            if(minutoAux>=0 && minutoAux<=9){
                minuto = "0" + minutoAux;
            }else{
                minuto = horatotal.getMinutes();
            }

            let segundoAux = horatotal.getSeconds();

            if(segundoAux>=0 && segundoAux<=9){
                segundo = "0" + segundoAux;
            }else{
                segundo = horatotal.getSeconds();
            }

            var horafinal = hora + ":" + minuto + ":" + segundo;

            console.log("Fechaaaaa:" + fecha);
            console.log("Hora fin:" + horafinal);
    const select_query=`SELECT c.id, c.hito,c.estado, DATE_FORMAT(c.fecha, '%Y-%m-%d') as fecha , c.hora, IFNULL(cf.fechafin, '${fecha}') as fechafin,IFNULL(cf.horafin, '${horafinal}')  as horafin
    FROM(
        SELECT *
        FROM combate as c2
        
    ) as c
    LEFT JOIN combatefin as cf
    ON c.id = cf.id;`
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            console.log(result);

            return res.json({
                data: result
            });
        }
    });

});


app.get('/combTodos2',(req, res) => {

    console.log("Que pasaaaaaaaa");

    var fechatotal = new Date();
            var mes;
            var dia;
            let fechaAux = fechatotal.getMonth()+1;
            if(fechaAux>=0 && fechaAux<=9){
                //console.log("Entre aquí");
                console.log(fechatotal.getMonth());
                console.log(fechaAux);
                console.log(fechaAux.toString());
                mes = "0" + fechaAux;
            }else{
                mes = fechatotal.getMonth() + 1;
            }
            let diaAux = fechatotal.getDate();
            if(diaAux>=0 && diaAux<=9){
                dia = "0" + diaAux;
            }else{
                dia = fechatotal.getDate();
            }
            var fecha = fechatotal.getFullYear()+'-'+mes+'-'+dia;

    var horatotal =  new Date();
            var hora;
            var minuto;
            var segundo;
            let horaAux = horatotal.getHours();
            if(horaAux>=0 && horaAux<=9){
                hora = "0" + horaAux;
            }else{
                hora = horatotal.getHours();
            }

            let minutoAux = horatotal.getMinutes();
            if(minutoAux>=0 && minutoAux<=9){
                minuto = "0" + minutoAux;
            }else{
                minuto = horatotal.getMinutes();
            }

            let segundoAux = horatotal.getSeconds();

            if(segundoAux>=0 && segundoAux<=9){
                segundo = "0" + segundoAux;
            }else{
                segundo = horatotal.getSeconds();
            }

            var horafinal = hora + ":" + minuto + ":" + segundo;

            console.log("Fechaaaaa:" + fecha);
            console.log("Hora fin:" + horafinal);
    const select_query=`SELECT c.nombre_brigada, c.n_brigada, c.id, c.estado ,DATE_FORMAT(c.fecha, '%Y-%m-%d') as fecha , c.hora, IFNULL(cf.fecharetiro, '${fecha}') as fechafin ,IFNULL(cf.horaretiro, '${horafinal}')  as horafin, c.nMedia, c.nAlta,c.idcombate
    FROM(
        SELECT *
        FROM combatesbrigada as c2, (	
			select COUNT(f.n_brigada) as nMedia, f.id as idcombate
			from (select br.rut, b.nombre, b.n_brigada, co.id, h.fatiga
			from brigadistas as br, brigada as b, combatesbrigada as co, historialfatiga as h
			where br.nombre_brigada=b.nombre AND br.n_brigada=b.n_brigada AND b.nombre=co.nombre_brigada AND b.n_brigada=co.n_brigada AND br.rut = h.rut AND co.id = h.idcombate AND h.fatiga=1
			group by br.rut) as f
			group by f.nombre, f.n_brigada, f.id
		) as d, (	
			select COUNT(f.n_brigada) as nAlta, f.id as idcombate2
			from (select br.rut, b.nombre, b.n_brigada, co.id, h.fatiga
			from brigadistas as br, brigada as b, combatesbrigada as co, historialfatiga as h
			where br.nombre_brigada=b.nombre AND br.n_brigada=b.n_brigada AND b.nombre=co.nombre_brigada AND b.n_brigada=co.n_brigada AND br.rut = h.rut AND co.id = h.idcombate AND h.fatiga=2
			group by br.rut) as f
			group by f.nombre, f.n_brigada, f.id
		) as d2
       WHERE  c2.id=d.idcombate AND c2.id = d2.idcombate2 AND d.idcombate =d2.idcombate2
    ) as c
    LEFT JOIN combatesbrigadafin as cf
    ON c.id = cf.id and c.nombre_brigada=cf.nombre_brigada and c.n_brigada=cf.n_brigada and c.fecha=cf.fecha and c.hora=cf.hora;
    
    `
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            console.log(result);

            return res.json({
                data: result
            });
        }
    });

});

app.get('/combFin', (req, res) => {


    const select_query=`
            SELECT n_brigada, nombre_brigada, id, DATE_FORMAT(cb.fecha, '%Y-%m-%d') as fecha, hora, DATE_FORMAT(fecharetiro, '%Y-%m-%d') as fechafin, horaretiro as horafin
        FROM combatesbrigadafin as cb`
    console.log(select_query);
    con.query(select_query, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});



app.get('/existe', bodyParser.json(), (req, res) => {
    var nombre = req.param('nombre');
    var n_brigada = req.param('n_brigada');

    console.log(nombre);
    console.log(n_brigada);

    const get_query = `SELECT EXISTS(SELECT * FROM combatesbrigadafin WHERE nombre_brigada = ? and n_brigada=?) as cond;`

    con.query(get_query, [nombre, n_brigada], (err, resultados) => {

        if(err) {
            
            return res.send(err)
        } else {
            console.log(resultados);
            return res.json({

                data: resultados

            })

        }
    })
})


app.delete('/delBrigada',(req, res) => {
    var id=req.param('n_brigada');
    var id2 = req.param('nombre');
    const del_query = `DELETE FROM Brigada WHERE n_brigada=? AND nombre = ?;`
    con.query(del_query,[id,id2], (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)

        }
    })
});





app.put('/modCombate/:id', bodyParser.json(), (req, res, next) => {
    var id=req.params.id;
    const upd_query = `UPDATE combate SET hito='${req.body.hito}' WHERE id =?;`
    con.query(upd_query,id, (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)

        }
    })
})

app.post('/addUsuario', bodyParser.json(), (req, res, next) => {
    const INSERT_TIPO_QUERY = `INSERT INTO espera (nombre, apellidoP, apellidoM, rut, cargo, correo, usuario, pass) VALUES('${req.body.nombre}','${req.body.apellidoP}','${req.body.apellidoM}','${req.body.rut}','${req.body.cargo}','${req.body.correo}','${req.body.usuario}', AES_ENCRYPT ('${req.body.pass}','encriptado'))`;
    con.query(INSERT_TIPO_QUERY, (err, resultados) => {

    if(err) {
        res.status(500).send('Error al añadir solicitud de registro de usuario.');
        console.log(err); 
    } else {
        res.json(res.body)

    }
})
});

app.post('/addPersonal', bodyParser.json(), (req, res, next) => {
    console.log("legueeeeee")
    const INSERT_TIPO_QUERY = `INSERT INTO usuarios (nombre, apellidoP, apellidoM, rut, cargo, correo, usuario, pass)  VALUES('${req.body.nombre}','${req.body.apellidoP}','${req.body.apellidoM}','${req.body.rut}','${req.body.cargo}','${req.body.correo}','${req.body.usuario}', AES_ENCRYPT ('${req.body.pass}','encriptado'))`;
    con.query(INSERT_TIPO_QUERY, (err, resultados) => {

    if(err) {
        res.status(500).send('Error al añadir solicitud de registro de usuario.');
        console.log(err); 
    } else {
        res.json(res.body)

    }
})
});


app.post('/addEsperaPersonal', bodyParser.json(), (req, res, next) => {
    console.log("lllllllllllllllllegueeeeee")
    
    const INSERT_TIPO_QUERY = `INSERT INTO usuarios (nombre, apellidoP, apellidoM, rut, cargo, correo, usuario, pass)  VALUES('${req.body.nombre}','${req.body.apellidoP}','${req.body.apellidoM}','${req.body.rut}','${req.body.cargo}','${req.body.correo}','${req.body.usuario}', AES_ENCRYPT ('${req.body.pass2}','encriptado'))`;
    console.log(INSERT_TIPO_QUERY);
    con.query(INSERT_TIPO_QUERY, (err, resultados) => {

        if(err) {
            res.status(500).send('Error al añadir solicitud de registro de usuario.');
            console.log(err); 
        } else {
            res.json(res.body)

        }
    })
});

app.post('/addBrigadista', bodyParser.json(), (req, res, next) => {
    const INSERT_TIPO_QUERY = `INSERT INTO brigadistas VALUES('${req.body.rut}','${req.body.correo}','${req.body.nombre}','${req.body.apellidoP}','${req.body.apellidoM}','${req.body.f_nacimiento}',${req.body.n_brigada},'${req.body.cargo}',${req.body.peso},${req.body.altura},'0',${req.body.pulsera},'${req.body.nombre_brigada}');`
    con.query(INSERT_TIPO_QUERY, (err, resultados) => {

        if(err) {
            res.status(500).send('Error al añadir nuevo brigadista');
                        console.log(err); 
            
        } else {
            res.json(res.body)

        }
    })
})

app.post('/addBrigada', bodyParser.json(), (req, res, next) => {
    console.log(req.body.n_brigada)
    const INSERT_TIPO_QUERY = `INSERT INTO brigada VALUES(${req.body.n_brigada},'${req.body.rut}','${req.body.nombre}');`
    con.query(INSERT_TIPO_QUERY, (err, resultados) => {

        if(err) {
            console.log("entre a error")
            res.status(500).send('Error al añadir nueva brigada');
            
        } else {
            console.log(res);
            res.json(res.body)

        }
    })
})
app.post('/addCombate', bodyParser.json(), (req, res, next) => {
    
    const INSERT_TIPO_QUERY = `INSERT INTO combate  VALUES('${req.body.id}','${req.body.hito}','1',CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP());`
    con.query(INSERT_TIPO_QUERY, (err, resultados) => {

        if(err) {
            res.status(500).send('Error al añadir nuevo combate');
                        console.log(err); 
           
        } else {
            res.json(res.body)

        }
    })
})

app.post('/unirseCombate', (req, res, next) => {
    console.log("holaaaaaaaaaaaaaa")
    var n_brigada=req.body.n_brigada
    var nombre= req.body.nombre_brigada;
    var id= req.body.id;
    console.log(n_brigada)
    console.log(nombre)
    console.log(id)
    
    
    let date = new Date()
    let hours = date.getHours()
    let min = date.getMinutes()
    let sec = date.getSeconds()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let fecha;
    if(month < 10){
         fecha=`${year}-0${month}-${day}`;
    }else{
        fecha=`${year}-${month}-${day}`;
    }
    console.log(fecha);
    console.log(`${hours}:${min}:${sec}`)

    const UPDATE_TIPO_QUERY = `UPDATE combatesbrigada set estado=1, fecha='${fecha}', hora='${hours}:${min}:${sec}' WHERE n_brigada= '${n_brigada}' AND id='${id}'AND nombre_brigada='${nombre}';`
    console.log(UPDATE_TIPO_QUERY)
    con.query( UPDATE_TIPO_QUERY, (err, resultados) => {
    if(err) {
        res.status(500).send('La brigada seleccionada ya posee un combate activo');
    }else {
        console.log("holaaaaaaaaaaaaaa"+resultados)
        res.json(res.body)
    }
    })  
    
})

app.post('/unirseCombate2', bodyParser.json(), (req, res, next) => {
    console.log("holaaaaaaaaaaaaaa")
    console.log(req.body.n_brigada.numero)
    console.log(req.body.n_brigada.nombre)
    var n_brigada = req.body.n_brigada
    var id = req.body.id
    console.log(n_brigada+" "+id)
    let date = new Date()
    let hours = date.getHours()
    let min = date.getMinutes()
    let sec = date.getSeconds()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let fecha;
    if(month < 10){
         fecha=`${year}-0${month}-${day}`;
    }else{
        fecha=`${year}-${month}-${day}`;
    }
    console.log(fecha);
    console.log(`${hours}:${min}:${sec}`)

    const UPDATE_TIPO_QUERY = `INSERT into combatesbrigada values ('${req.body.n_brigada.numero}','${req.body.id}','${fecha}','${hours}:${min}:${sec}', 1,'${req.body.n_brigada.nombre}');`
    console.log(UPDATE_TIPO_QUERY)
    con.query( UPDATE_TIPO_QUERY, (err, resultados) => {
    if(err) {
        res.status(500).send('La brigada seleccionada ya posee un combate activo');
    }else {
        console.log("holaaaaaaaaaaaaaa"+resultados)
        res.json(res.body)
    }
    })  
    
})




app.delete('/delBrigadista/:id',(req, res) => {
    var id=req.params.id;
    const del_query = `DELETE FROM Brigadistas WHERE rut=?;`
    con.query(del_query,id, (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)

        }
    })
});

app.delete('/delPersonal/:id',(req, res) => {
    var id=req.params.id;
    const del_query = `DELETE FROM Usuarios WHERE rut=?;`
    con.query(del_query,id, (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)

        }
    })
});


app.delete('/rmEsperaPersonal/:id',(req, res) => {
    var id=req.params.id;
    const del_query = `DELETE FROM Espera WHERE rut=?;`
    con.query(del_query,id, (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)

        }
    })
});

app.delete('/delBrigada',(req, res) => {
    var id=req.param('n_brigada');
    var id2 = req.param('nombre');
    const del_query = `DELETE FROM Brigada WHERE n_brigada=? AND nombre = ?;`
    con.query(del_query,[id,id2], (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)

        }
    })
});

app.put('/finCombate/:id',(req, res) => {
    var id=req.params.id;
    const del_query = `UPDATE Combate SET estado =0 WHERE id=?;`
    con.query(del_query,id, (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            const help_query = `
            SELECT hf.rut, hf.idcombate, hf.fatiga, hf.fecha, max(hf.hora) as hora
            FROM historialfatiga as hf, (
                select rut, max(fecha) as fecha from historialfatiga group by rut
            ) as tabla2
            WHERE hf.rut = tabla2.rut and hf.fecha = tabla2.fecha AND hf.idcombate = ?
            group by hf.rut;`

                con.query(help_query, id, (err2, resultados2)=>{
                    if(err2){
                        return res.send(err2);
                    }else{

                        var arrayAux = [];
                        arrayAux = resultados2;
                        console.log(tam);
                        var tam = arrayAux.length;
                        var fechaAux = new Date();

                        for(let i=0; i<tam; i++){
                            console.log("loop");
                            console.log(arrayAux[i].rut);

                            fechaAux.setMonth(arrayAux[i].fecha.getMonth());

                            console.log(fechaAux);


                            const INSERT_TIPO_QUERY = `INSERT INTO fatigafin values ('${arrayAux[i].rut}', '${id}','${arrayAux[i].fatiga}','${arrayAux[i].fecha.getFullYear()}-${arrayAux[i].fecha.getMonth()}-${arrayAux[i].fecha.getDate()}','${arrayAux[i].hora}',CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP());`

                            con.query(INSERT_TIPO_QUERY, (err3, resultados3)=>{
                                if(err3){
                                    console.log(err3);
                                    return res.send(err3);
                                }
                            });




                        }


                        res.json(res.body);



                    }
                });

        }
    })
});

app.delete('/updCombateBrig',(req, res) => {
    var n_brigada = req.param('n_brigada');
    var id = req.param('id');
    var nombre = req.param('nombre_brigada');

    console.log("hola "+n_brigada+" "+id)
    const del_query = `UPDATE combatesbrigada SET estado=0 WHERE n_brigada=? AND id=? AND estado=1 AND nombre_brigada=?;`




    con.query(del_query,[n_brigada,id,nombre], (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {

            const help_query = `
            SELECT hf.rut, hf.idcombate, hf.fatiga, hf.fecha, max(hf.hora) as hora
            FROM historialfatiga as hf, (
                select rut, max(fecha) as fecha from historialfatiga group by rut
            ) as tabla2
            WHERE hf.rut = tabla2.rut and hf.fecha = tabla2.fecha AND hf.idcombate = ?
            group by hf.rut;`

                con.query(help_query, id, (err2, resultados2)=>{
                    if(err2){
                        return res.send(err2);
                    }else{

                        var arrayAux = [];
                        arrayAux = resultados2;
                        console.log(tam);
                        var tam = arrayAux.length;
                        var fechaAux = new Date();

                        for(let i=0; i<tam; i++){
                            console.log("loop");
                            console.log(arrayAux[i].rut);

                            fechaAux.setMonth(arrayAux[i].fecha.getMonth());

                            console.log(fechaAux);


                            const INSERT_TIPO_QUERY = `INSERT INTO fatigafin values ('${arrayAux[i].rut}', '${id}','${arrayAux[i].fatiga}','${arrayAux[i].fecha.getFullYear()}-${arrayAux[i].fecha.getMonth()}-${arrayAux[i].fecha.getDate()}','${arrayAux[i].hora}',CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP());`

                            con.query(INSERT_TIPO_QUERY, (err3, resultados3)=>{
                                if(err3){
                                    console.log(err3);
                                    return res.send(err3);
                                }
                            });




                        }


                        res.json(res.body);



                    }
                });



        }
    })
});

app.put('/modBrigadista/:id', bodyParser.json(), (req, res, next) => {
    var id=req.params.id;
    const upd_query = `UPDATE brigadistas SET correo='${req.body.correo}', nombre='${req.body.nombre}', apellidoP='${req.body.apellidoP}',apellidoM='${req.body.apellidoM}', n_brigada=${req.body.n_brigada},cargo='${req.body.cargo}',peso=${req.body.peso},pulsera=${req.body.pulsera},nombre_brigada='${req.body.nombre_brigada}' WHERE rut =?;`
    con.query(upd_query,id, (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)

        }
    })
})
app.put('/modBrigada', bodyParser.json(), (req, res, next) => {
    var id=req.param('n_brigada');
    var id2= req.param('nombre');
    console.log(id);
    console.log(id2);
    const upd_query = `UPDATE brigada SET rut_jefe='${req.body.rut}' WHERE n_brigada =? AND nombre = ?;`
    con.query(upd_query,[id,id2], (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)

        }
    })
})

app.get('/datosRandom', (req, res) => {


    /*console.log("hola")

    const select_query=`select * from reg_fire;`

    con2.query(select_query, (err, result) => {
        var id = result[0].ID_OP.match(/[0-9]+/g)
        console.log(id[0]);
        console.log(result.length)
        if (err){
            return res.send(err)
        }else {
            const select_query2=`SELECT brigadistas.rut, combatesbrigada.id
            FROM combatesbrigada ,brigadistas
            where estado=1 and brigadistas.n_brigada=combatesbrigada.n_brigada;`

            con2.query(select_query2, (err2, result2) => {
                if (err2){
                    return res.send(err2)
                }else{
                    for ()
                    let date = new Date()
                    let hours = date.getHours()
                    let min = date.getMinutes()
                    let sec = date.getSeconds()
                    let day = date.getDate()
                    let month = date.getMonth() + 1
                    let year = date.getFullYear()
                    let fecha;
                    if(month < 10){
                        fecha=`${year}-0${month}-${day}`;
                    }else{
                        fecha=`${year}-${month}-${day}`;
                    }
                    console.log(fecha);
                    console.log(`${hours}:${min}:${sec}`)
                }
            })  

            
            res.json(res.body)
        }
    })*/

    const select_query=`SELECT brigadistas.rut, combatesbrigada.id
    FROM combatesbrigada ,brigadistas
    where estado=1 and brigadistas.n_brigada=combatesbrigada.n_brigada;`

    con.query(select_query, (err, result) => {
     
     if (err){
           return res.send(err)
        }

        
        for(var i = 0, len = result.length; i<len;i++){

            var moneda = Math.floor((Math.random() * (3 - 0)));
            console.log(moneda);
            moneda = 0;
            var latitud;
            var longitud;
            if(moneda == 0){
                latitud = (Math.random()*(-41.157696 - -41.178606) - 41.178606);
                longitud = (Math.random()*(-72.519478 - -72.541317)- 72.541317);
            }else if(moneda == 1){
                latitud = (Math.random()*(-37.261880 - -37.267535) - 37.267535);
                longitud = (Math.random()*(-72.950598 - -72.959111)- 72.959111);
            }else if(moneda == 2){
                
                latitud = (Math.random()*(-33.086752 - -33.090359)- 33.090359);
                longitud = (Math.random()*(-71.653655 - -71.657766) -71.657766 );
            }
            console.log(latitud);
            console.log(longitud);




            /*var latitud = (Math.random() * (0.000000000000000 - -100.000000000000000) - 100.000000000000000).toFixed(12);
            //console.log(latitud);
            var longitud = (Math.random() * (0.000000000000000 - -100.000000000000000) - 100.000000000000000).toFixed(12);
            //console.log(longitud);*/

            var acelX = (Math.random() * (60 - 5) + 5).toFixed(3);
            var acelY = (Math.random() * (60 - 5) + 5).toFixed(3);
            var acelZ = (Math.random() * (60 - 5) + 5).toFixed(3);
            var alturaGrand = Math.random() * (100 - 0) + 0;
            var altura;
            if(alturaGrand>=90){
                altura = (Math.random() * (4000 - 2500) + 2500).toFixed(2);
            }else{
                altura = (Math.random() * (2000 - 500) + 500).toFixed(2);
            }
            //console.log(altura);
            var t_corporal_alt = Math.random() * (100 - 0) + 0;
            var t_corporal;
            if(t_corporal_alt>=90){
                t_corporal = (Math.random() * (41.00 - 38.00) + 38.00).toFixed(2);
            }else if(t_corporal_alt>=80 && t_corporal_alt<90){
                t_corporal = (Math.random() * (38.00 - 37.00) + 37.00).toFixed(2);
            }else{
                t_corporal = (Math.random() * (37.00 - 36.00) + 36.00).toFixed(2);
            }
            //console.log(t_corporal);
            var t_ambiental_alt = Math.random() * (100 - 0) + 0;
            var t_ambiental;
            if(t_ambiental_alt>=80){
                t_ambiental = (Math.random() * (150.00 - 100.00) + 100.00).toFixed(2);
            }else if(t_ambiental_alt>=50 && t_ambiental_alt<80){
                t_ambiental = (Math.random() * (100.00 - 40.00) + 40.00).toFixed(2);
            }else{
                t_ambiental = (Math.random() * (40.00 - 24.00) + 24.00).toFixed(2);
            }
            //console.log(t_ambiental);
            var probabilidad = Math.random() * (100 - 0) + 0;

            var pulsaciones;
            if(probabilidad<=80){
                pulsaciones = (Math.random() * (82 - 60) + 60).toFixed(0);
            }else if(probabilidad>80 && probabilidad<=95){
                pulsaciones = (Math.random() * (190 - 83) + 83).toFixed(0);
            }else{
                pulsaciones = (Math.random() * (300 - 190) + 190).toFixed(0);
            }
            //console.log(pulsaciones);
            //var pulsaciones = Math.random() * (high - low) + low;
            var fechatotal = new Date();
            var mes;
            var dia;
            if(fechatotal.getMonth()+1>=0 && fechatotal.getMonth()+1<=9){
                //console.log("Entre aquí");
                mes = "0" + fechatotal.getMonth()+1;

            }else{
                mes = fechatotal.getMonth() + 1;
            }
            if(fechatotal.getDate()>=0 && fechatotal.getDate<=9){
                dia = "0" + fechatotal.getDate();
            }else{
                dia = fechatotal.getDate();
            }

            var fecha = fechatotal.getFullYear()+'-'+mes+'-'+dia;
            //console.log(fecha);
            var horatotal =  new Date();
            var hora;
            var minuto;
            var segundo;
            if(horatotal.getHours()>=0 && horatotal.getHours()<=9){
                hora = "0" + horatotal.getHours();
            }else{
                hora = horatotal.getHours();
            }

            if(horatotal.getMinutes()>=0 && horatotal.getMinutes()<=9){
                minuto = "0" + horatotal.getMinutes();
            }else{
                minuto = horatotal.getMinutes();
            }

            if(horatotal.getSeconds()>=0 && horatotal.getSeconds()<=9){
                segundo = "0" + horatotal.getSeconds();
            }else{
                segundo = horatotal.getSeconds();
            }

            var horafinal = hora + ":" + minuto + ":" + segundo;
            //console.log(horafinal);
            var sql = `INSERT INTO datos (rut,id,latidud,longitud,acelX,acelY,acelZ,altura,t_corporal,t_ambiental,pulsaciones,fecha,hora)
            VALUES (`+con.escape(result[i].rut)+`, `+con.escape(result[i].id)+`,`+con.escape(latitud)+`,`+con.escape(longitud)+
            `,`+con.escape(acelX)+`,`+con.escape(acelY)+`,`+con.escape(acelZ)+`,`+con.escape(altura)+`,`
            +con.escape(t_corporal)+`,`+con.escape(t_ambiental)+`,`+con.escape(pulsaciones)+`,`+con.escape(fecha)
            +`,`+con.escape(horafinal)+`);`;
            console.log(sql);

            con.query(sql, function (err, result2) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        }

    });

      /*con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });*/
});

app.get('/estadobrigadistas', (req, res) => {
    var id=req.param("n_brigada");
    var id2=req.param("nombre");
    console.log(id);
    console.log(id2);
    const select_query=`
    SELECT b.rut, b.nombre, b.apellidoP, b.apellidoM,  b.fatigado, d.latidud,d.longitud, fecha,  hora
    FROM (SELECT *,
        row_number() OVER (PARTITION BY rut ORDER BY fecha DESC, hora DESC) as row_num
      FROM datos) as d , brigadistas as b
    WHERE d.row_num = 1 AND b.n_brigada=? AND b.nombre_brigada=?AND b.rut=d.rut;
        `
    console.log(select_query);
    con.query(select_query, [id,id2], (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});



app.get('/datosestadoactualbrigadistas/:rut', (req, res) => {
    var rut=req.params.rut;
    console.log(rut);
    const select_query=`SELECT  b.rut, b.nombre, b.apellidoP, b.apellidoM, d.id, TIMESTAMPDIFF(YEAR,b.f_nacimiento,CURDATE()) AS edad, d.t_ambiental, d.t_corporal, d.pulsaciones,d.latidud, d.longitud, b.fatigado
    FROM
        (SELECT id, fecha
        FROM combatesbrigada as cb, brigadistas as b
        WHERE b.rut = ? AND b.n_brigada = cb.n_brigada AND b.nombre_brigada=cb.nombre_brigada
        ORDER BY cb.fecha DESC , cb.hora DESC
        LIMIT 1)
     as c, datos as d,(SELECT max(fecha) as fecha, rut
        FROM datos 
       group by rut) as x, brigadistas as b
    
    WHERE
        d.rut=? AND d.id=c.id AND d.fecha=x.fecha AND x.rut=d.rut AND b.rut =d.rut
     
    ORDER BY d.fecha DESC, d.hora DESC LIMIT 1 ;`
    console.log(select_query);
    con.query(select_query,[rut,rut], (err, result) => {
     //console.log(result);
     if (err){
           return res.send(err)
        }else{


            //result[0].hora

            console.log(result[0].nombre);
            return res.json({

                data: result

            })

     }
    });
});


app.get('/ultimastemperaturasambientales/:rut', (req, res) => {
    var rut=req.params.rut;
    console.log(rut);
    const select_query=`SELECT d.rut, d.id, d.t_ambiental, d.fecha, d.hora
    FROM
        (SELECT id, fecha
        FROM combatesbrigada as cb, brigadistas as b
        WHERE b.rut = ? AND b.n_brigada = cb.n_brigada AND b.nombre_brigada=cb.nombre_brigada
        ORDER BY cb.fecha DESC , cb.hora DESC
        LIMIT 1)
     as c, datos as d,(SELECT max(fecha) as fecha, rut
        FROM datos 
       group by rut) as x
    
    WHERE
        d.rut=? AND d.id=c.id AND d.fecha=x.fecha AND x.rut=d.rut
     
    ORDER BY d.fecha DESC, d.hora DESC LIMIT 20;`
    
    console.log(select_query);
    con.query(select_query,[rut,rut,rut], (err, result) => {
     //console.log(result);
     if (err){
           return res.send(err)
        }else{

            return res.json({

                data: result

            })

     }
    });
});

app.get('/ultimastemperaturascorporales/:rut', (req, res) => {
    var rut=req.params.rut;
    console.log(rut);
    const select_query=`SELECT d.rut, d.id, d.t_corporal, d.fecha, d.hora
    FROM
        (SELECT id, fecha
        FROM combatesbrigada as cb, brigadistas as b
        WHERE b.rut = ? AND b.n_brigada = cb.n_brigada AND b.nombre_brigada=cb.nombre_brigada
        ORDER BY cb.fecha DESC , cb.hora DESC
        LIMIT 1)
     as c, datos as d,(SELECT max(fecha) as fecha, rut
        FROM datos 
       group by rut) as x
    
    WHERE
        d.rut=? AND d.id=c.id AND d.fecha=x.fecha AND x.rut=d.rut
     
    ORDER BY d.fecha DESC, d.hora DESC LIMIT 20;`
    console.log(select_query);
    con.query(select_query,[rut,rut,rut], (err, result) => {
     //console.log(result);
     if (err){
           return res.send(err)
        }else{

            return res.json({

                data: result

            })

     }
    });
});

app.get('/ultimaspulsaciones/:rut', (req, res) => {
    var rut=req.params.rut;
    console.log(rut);
    const select_query=`
    SELECT d.rut, d.id, d.pulsaciones, d.fecha, d.hora
FROM
    (SELECT id, fecha
    FROM combatesbrigada as cb, brigadistas as b
    WHERE b.rut = ? AND b.n_brigada = cb.n_brigada AND b.nombre_brigada=cb.nombre_brigada
    ORDER BY cb.fecha DESC , cb.hora DESC
    LIMIT 1)
 as c, datos as d,(SELECT max(fecha) as fecha, rut
    FROM datos 
   group by rut) as x

WHERE
    d.rut=? AND d.id=c.id AND d.fecha=x.fecha AND x.rut=d.rut
 
ORDER BY d.fecha DESC, d.hora DESC LIMIT 20;`

   
    console.log(select_query);
    con.query(select_query,[rut,rut], (err, result) => {
     //console.log(result);
     if (err){
           return res.send(err)
        }else{

            return res.json({

                data: result

            })

     }
    });
});

app.get('/ultimasfechasyhoras/:rut', (req, res) => {
    var rut=req.params.rut;
    console.log(rut);
    const select_query=`SELECT DATE_FORMAT(d.fecha, '%d/%m') as fecha, DATE_FORMAT(d.hora, '%H:%i') as hora

    FROM
    (SELECT id, fecha
    FROM combatesbrigada as cb, brigadistas as b
    WHERE b.rut = ? AND b.n_brigada = cb.n_brigada AND b.nombre_brigada=cb.nombre_brigada
    ORDER BY cb.fecha DESC , cb.hora DESC
    LIMIT 1)
 as c, datos as d,(SELECT max(fecha) as fecha, rut
    FROM datos 
   group by rut) as x

WHERE
    d.rut=? AND d.id=c.id AND d.fecha=x.fecha AND x.rut=d.rut
 
ORDER BY d.fecha DESC, d.hora DESC LIMIT 20;`
    console.log(select_query);
    con.query(select_query,[rut,rut], (err, result) => {
     //console.log(result);
     if (err){
           return res.send(err)
        }else{


            //result[0].hora

            console.log(result[0].nombre);
            return res.json({

                data: result

            })

     }
    });
});

app.get('/ultimasPosiciones/:rut', (req, res) => {
    var rut=req.params.rut;
    console.log(rut);
    const select_query=`SELECT d.latidud, d.longitud, d.fecha, d.hora
    FROM
        (SELECT id, fecha
        FROM combatesbrigada as cb, brigadistas as b
        WHERE b.rut = ? AND b.n_brigada = cb.n_brigada AND b.nombre_brigada=cb.nombre_brigada
        ORDER BY cb.fecha DESC , cb.hora DESC
        LIMIT 1)
     as c, datos as d,(SELECT max(fecha) as fecha, rut
        FROM datos 
       group by rut) as x
    
    WHERE
        d.rut=? AND d.id=c.id AND d.fecha=x.fecha AND x.rut=d.rut 
     
    ORDER BY d.fecha DESC, d.hora DESC LIMIT 20;`
    console.log(select_query);
    con.query(select_query,[rut,rut], (err, result) => {
     //console.log(result);
     if (err){
           return res.send(err)
        }else{

            return res.json({

                data: result

            })

     }
    });
});









var server = app.listen(8000, function () {
    console.log('Server is running..');
});
