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
        }else{
            if(result[0].total>0){
                console.log("entreeeee");
                const select_query2=`SELECT COUNT(*) as total FROM usuarios where rut='${req.body.username}' AND cargo="Administrador";`
                con.query(select_query2, (err2, result2) => {
                    console.log(result2[0].total);
                    if (err2){
                        return res.sendStatus(401);
                    }else{
                        if(result2[0].total>0){
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
                                }else{
                                    if(result3[0].total>0){
                                        console.log("jefe");
                                        var cargo ="jefe_brigada";
                                        var token = jwt.sign({userID: req.body.username}, 'todo-app-super-shared-secret');
                                        res.send({token,cargo});
                                    }
                                }
                            });
                        }
                    }
                });  
            }else{
                return res.sendStatus(401);
            }
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
    FROM Usuarios WHERE cargo="Administrador";`
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
    const select_query=`SELECT c.estado, c.n_brigada, b.rut_jefe, c.id FROM combatesbrigada as c, brigada as b WHERE estado=1 and c.n_brigada=b.n_brigada ;`
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
    const select_query=`SELECT IFNULL(a.fatigaBaja, 0) as fatigaBaja, brigada.n_brigada
    FROM brigada
    LEFT JOIN (
        SELECT count(b.fatigado) as fatigaBaja, b.n_brigada
        FROM brigadistas as b
        WHERE b.fatigado = 0
        group by b.n_brigada
    ) as a
    ON brigada.n_brigada=a.n_brigada
    ORDER BY brigada.n_brigada;`
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
    const select_query=`SELECT IFNULL(a.fatigaMedia, 0) as fatigaMedia, brigada.n_brigada
    FROM brigada
    LEFT JOIN (
        SELECT count(b.fatigado) as fatigaMedia, b.n_brigada
        FROM brigadistas as b
        WHERE b.fatigado = 1
        group by b.n_brigada
    ) as a
    ON brigada.n_brigada=a.n_brigada
    ORDER BY brigada.n_brigada;`
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
    const select_query=`SELECT IFNULL(a.fatigaAlta, 0) as fatigaAlta, brigada.n_brigada
    FROM brigada
    LEFT JOIN (
        SELECT count(b.fatigado) as fatigaAlta, b.n_brigada
        FROM brigadistas as b
        WHERE b.fatigado = 2
        group by b.n_brigada
    ) as a
    ON brigada.n_brigada=a.n_brigada
    ORDER BY brigada.n_brigada;`
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

    const select_query=`SELECT b.n_brigada, b.rut_jefe, u.nombre, u.apellidoP, u.apellidoM FROM Brigada as b, Usuarios as u WHERE b.rut_jefe = u.rut ORDER BY n_brigada;`
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
    const select_query=`SELECT n_brigada, id,DATE_FORMAT(fecha, '%d/%m/%y') as fecha, DATE_FORMAT(hora, '%H:%i') as hora , estado FROM combatesbrigada WHERE id=?;`
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
    const select_query=`SELECT COUNT(brigada.n_brigada) AS numero FROM brigada,combatesbrigada WHERE brigada.n_brigada=combatesbrigada.n_brigada AND combatesbrigada.estado=1;`
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

app.get('/maxbrigada', (req, res) => {
    const select_query=`SELECT max(n_brigada) AS max FROM brigada;`
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
app.get('/nbrigadas:id', (req, res) => {
    var id=req.params.id;
    console.log(id);
    const select_query=`SELECT n_brigada FROM brigada WHERE rut_jefe=?;`
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

app.get('/brigadistas/:id', (req, res) => {
    var id=req.params.id;
    console.log(id);
    const select_query=`SELECT *, DATE_FORMAT(f_nacimiento, '%Y-%m-%d') as f_nacimiento FROM Brigadistas WHERE n_brigada=?;`
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

app.get('/jefeBrigada/:id', (req, res) => {
    var id=req.params.id;
    console.log(id);
    const select_query=`SELECT * FROM brigada WHERE n_brigada=?; `
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
    const select_query=`SELECT * FROM espera;`
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

app.post('/addBrigadista', bodyParser.json(), (req, res, next) => {
    const INSERT_TIPO_QUERY = `INSERT INTO brigadistas VALUES('${req.body.rut}','${req.body.correo}','${req.body.nombre}','${req.body.apellidoP}','${req.body.apellidoM}','${req.body.f_nacimiento}',${req.body.n_brigada},'${req.body.cargo}',${req.body.peso},${req.body.altura},'0',${req.body.pulsera});`
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
    const INSERT_TIPO_QUERY = `INSERT INTO brigada VALUES(${req.body.n_brigada},'${req.body.rut}','0','0','0');`
    con.query(INSERT_TIPO_QUERY, (err, resultados) => {

        if(err) {
            console.log("entre a error")
            res.status(500).send('Error al añadir nueva brigada');
            
        } else {
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
app.post('/unirseCombate', bodyParser.json(), (req, res, next) => {
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

    const select_query=`SELECT COUNT(*) as total FROM combatesbrigada where n_brigada='${req.body.n_brigada}' AND id='${req.body.id}';`
    con.query(select_query, (err, result) => {
    console.log(result[0].total);

        if (err){
           return res.sendStatus(401);
        }else{
            if(result[0].total>0){
                console.log("update");
                const UPDATE_TIPO_QUERY = `UPDATE combatesbrigada SET estado=1 ,fecha='${fecha}' , hora='${hours}:${min}:${sec}' WHERE n_brigada='${req.body.n_brigada}' AND id='${req.body.id}';`
                console.log(UPDATE_TIPO_QUERY)
                con.query( UPDATE_TIPO_QUERY, (err2, resultados2) => {
                    if(err2) {
                        console.log("asasasasaaaaaaaaaaassas");
                        res.status(500).send('La brigada seleccionada ya posee un combate activo');
                        
                    } else {
                        console.log("holaaaaaaaaaaaaaa"+resultados2)
                        res.json(res.body)

                    }
                })
                
            }else{
                const INSERT_TIPO_QUERY = `INSERT INTO combatesbrigada VALUES(${req.body.n_brigada},'${req.body.id}','${year}-0${month}-${day}','${hours}:${min}:${sec}','1');`
                con.query(INSERT_TIPO_QUERY, (err2, resultados2) => {
                    if(err2) {
                        
                        res.status(500).send('La brigada seleccionada ya posee un combate activo');
                            
                    } else {
                        console.log("holaaaaaaaaaaaaaa"+resultados2)
                        res.json(res.body)

                    }
                })
                
            }
     }
    });
    

    
})

app.post('/unirseCombate2', bodyParser.json(), (req, res, next) => {
    console.log("holaaaaaaaaaaaaaa")
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

    const UPDATE_TIPO_QUERY = `UPDATE combatesbrigada SET estado=1 ,fecha='${fecha}' , hora='${hours}:${min}:${sec}' WHERE n_brigada='${req.body.n_brigada}' AND id='${req.body.id}';`
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

app.delete('/delBrigada/:id',(req, res) => {
    var id=req.params.id;
    const del_query = `DELETE FROM Brigada WHERE n_brigada=?;`
    con.query(del_query,id, (err, resultados) => {

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
            res.json(res.body)

        }
    })
});
app.delete('/updCombateBrig',(req, res) => {
    var n_brigada = req.param('n_brigada');
    var id = req.param('id');
    
    console.log("hola "+n_brigada+" "+id)
    const del_query = `UPDATE combatesbrigada SET estado=0 WHERE n_brigada=? AND id=?;`
    con.query(del_query,[n_brigada,id], (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)

        }
    })
});

app.put('/modBrigadista/:id', bodyParser.json(), (req, res, next) => {
    var id=req.params.id;
    const upd_query = `UPDATE brigadistas SET correo='${req.body.correo}', nombre='${req.body.nombre}', apellidoP='${req.body.apellidoP}',apellidoM='${req.body.apellidoM}', n_brigada=${req.body.n_brigada},cargo='${req.body.cargo}',peso=${req.body.peso},pulsera=${req.body.pulsera} WHERE rut =?;`
    con.query(upd_query,id, (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)

        }
    })
})
app.put('/modBrigada/:id', bodyParser.json(), (req, res, next) => {
    var id=req.params.id;
    const upd_query = `UPDATE brigada SET rut_jefe='${req.body.rut}' WHERE n_brigada =?;`
    con.query(upd_query,id, (err, resultados) => {

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

app.get('/estadobrigadistas/:id', (req, res) => {
    var id=req.params.id;
    console.log(id);
    const select_query=`
    SELECT b.rut, b.nombre, b.apellidoP, b.apellidoM,  b.fatigado, d.latidud,d.longitud, fecha,  hora
    FROM (SELECT *,
        row_number() OVER (PARTITION BY rut ORDER BY fecha DESC, hora DESC) as row_num
      FROM datos) as d , brigadistas as b
    WHERE d.row_num = 1 AND b.n_brigada=? AND b.rut=d.rut;
        `
    console.log(select_query);
    con.query(select_query, [id], (err, result) => {
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
        WHERE b.rut = ? AND b.n_brigada = cb.n_brigada
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
        WHERE b.rut = ? AND b.n_brigada = cb.n_brigada
        ORDER BY cb.fecha DESC , cb.hora DESC
        LIMIT 1)
     as c, datos as d,(SELECT max(fecha) as fecha, rut
        FROM datos 
       group by rut) as x
    
    WHERE
        d.rut=? AND d.id=c.id AND d.fecha=x.fecha AND x.rut=d.rut
     
    ORDER BY d.fecha DESC, d.hora DESC LIMIT 30;`
    
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
        WHERE b.rut = ? AND b.n_brigada = cb.n_brigada
        ORDER BY cb.fecha DESC , cb.hora DESC
        LIMIT 1)
     as c, datos as d,(SELECT max(fecha) as fecha, rut
        FROM datos 
       group by rut) as x
    
    WHERE
        d.rut=? AND d.id=c.id AND d.fecha=x.fecha AND x.rut=d.rut
     
    ORDER BY d.fecha DESC, d.hora DESC LIMIT 30;`
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
    WHERE b.rut = ? AND b.n_brigada = cb.n_brigada
    ORDER BY cb.fecha DESC , cb.hora DESC
    LIMIT 1)
 as c, datos as d,(SELECT max(fecha) as fecha, rut
    FROM datos 
   group by rut) as x

WHERE
    d.rut=? AND d.id=c.id AND d.fecha=x.fecha AND x.rut=d.rut
 
ORDER BY d.fecha DESC, d.hora DESC LIMIT 30;`

   
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
    WHERE b.rut = ? AND b.n_brigada = cb.n_brigada
    ORDER BY cb.fecha DESC , cb.hora DESC
    LIMIT 1)
 as c, datos as d,(SELECT max(fecha) as fecha, rut
    FROM datos 
   group by rut) as x

WHERE
    d.rut=? AND d.id=c.id AND d.fecha=x.fecha AND x.rut=d.rut
 
ORDER BY d.fecha DESC, d.hora DESC LIMIT 30;`
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
        WHERE b.rut = ? AND b.n_brigada = cb.n_brigada
        ORDER BY cb.fecha DESC , cb.hora DESC
        LIMIT 1)
     as c, datos as d,(SELECT max(fecha) as fecha, rut
        FROM datos 
       group by rut) as x
    
    WHERE
        d.rut=? AND d.id=c.id AND d.fecha=x.fecha AND x.rut=d.rut 
     
    ORDER BY d.fecha DESC, d.hora DESC LIMIT 30;`
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
