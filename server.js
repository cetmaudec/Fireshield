const express = require('express');
const app = express();
const msql = require("mysql");
const cors = require('cors');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');

// config for your database
const con = msql.createConnection({
  host: "localhost",
    user: "root",
  password: "cetma2019",
  database: 'cet_fire'
});


con.connect(function (err) {
  if (err) console.log(err);
    console.log("Connected!");
});

//app.use(expressJwt({secret: 'todo-app-super-shared-secret'}).unless({path: ['/auth', '/addUsuario']}));
//app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
//app.use(bodyParser.json());


app.post('/auth',  bodyParser.json(), (req, res, next) => {
    const select_query=`SELECT COUNT(*) as total FROM usuario WHERE usuario.rut='${req.body.username}' AND usuario.password = SHA('${req.body.password}');`
    con.query(select_query, (err, result) => {
        if (err){
            return res.sendStatus(401);
        }else{
            if(result[0].total>0){
                con.query(`SELECT cargo, estado  FROM usuario WHERE usuario.rut='${req.body.username}' AND usuario.password = SHA('${req.body.password}');`, (err, resultados) => {
                    if(err) {
                        return res.sendStatus(401);
                    } else {
                        var token = jwt.sign({userID: req.body.username}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
                        res.send({'token': token, 'cargo': resultados[0].cargo, 'estado':resultados[0].estado });

                    }
                })
            }else{
                return res.sendStatus(401);    
            }
        }
    })
});

app.post('/insert/usuario', bodyParser.json(), (req, res, next) => {
    const INSERT_TIPO_QUERY = `INSERT INTO usuario (nombre, apellidoP, apellidoM, rut, cargo, correo, password, estado) VALUES('${req.body.nombre}','${req.body.apellidoP}','${req.body.apellidoM}','${req.body.rut}','${req.body.cargo}','${req.body.correo}', SHA('${req.body.password}'), 'En espera')`;
    con.query(INSERT_TIPO_QUERY, (err, resultados) => {
    if(err) {
        res.status(500).send('Error al añadir solicitud de registro de usuario.');
    } else {
        res.json(res.body)

    }
  })
});

app.get('/select/usuario/rut', (req, res) => {
  const select_query=`SELECT rut FROM usuario;`
    con.query(select_query, (err, result) => {
        if (err){
            return res.send(err)
        }else{
            return res.json({

                   data: result

            })
        }
    });
});

app.get('/select/usuario/personal/:id', (req, res) => {
    var id=req.params.id;
    const select_query=`SELECT correo, rut, nombre, apellidoP, apellidoM, cargo FROM usuario where rut = '${id}';`    
    con.query(select_query, (err, result) => {
        if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result

            })
        }
    });
});

app.get('/select/usuario/espera',(req, res) => {
    const select_query=`SELECT * FROM usuario WHERE estado = 'En espera';`
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result
            });
        }
    });
});

app.get('/select/usuario/admin', (req, res) => {
    const select_query=`SELECT *
    FROM usuario WHERE cargo='Administrador' OR cargo='Super Administrador';`
    con.query(select_query, (err, result) => {
        if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.get('/select/usuario/jefe', (req, res) => {
    const select_query=`SELECT * FROM usuario WHERE cargo="Jefe Brigada";`
    con.query(select_query, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
     }
    });
});

app.post('/insert/usuario/activo', bodyParser.json(), (req, res, next) => {
    const INSERT_TIPO_QUERY = `INSERT INTO usuario (nombre, apellidoP, apellidoM, rut, cargo, correo, password, estado)  VALUES('${req.body.nombre}','${req.body.apellidoP}','${req.body.apellidoM}','${req.body.rut}','${req.body.cargo}','${req.body.correo}', SHA('${req.body.password}'), 'Activo')`;
    con.query(INSERT_TIPO_QUERY, (err, resultados) => {
        if(err) {
            res.status(500).send('Error al añadir solicitud de registro de usuario.');
        } else {
            res.json(res.body)
        }
    })
});

app.post('/update/usuario/set/estado/activo', bodyParser.json(), (req, res, next) => {  
  con.query(`UPDATE usuario SET estado = 'Activo' WHERE rut='${req.body.rut}';`, (err, resultados) => {
    if(err) {
      res.status(500).send('Error al añadir solicitud de registro de usuario.');

    } else {
      res.json(res.body)      
    }
  })
});

app.put('/update/usuario/set/password/:id', bodyParser.json(), (req, res, next) => {
    var id=req.params.id;
    const upd_query = `UPDATE usuario SET password=SHA('${req.body.pass}') WHERE rut ='${id}';`
    con.query(upd_query, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result

            })
     }
    });
});

app.put('/update/usuario/set/cargo/:id',  bodyParser.json(), (req, res, next) => {
    var id=req.params.id;
    const upd_query = `UPDATE usuario SET cargo='${req.body.cargo}' WHERE rut ='${id}';`
    con.query(upd_query, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result

            })
     }
    });
});

app.delete('/delete/usuario/:id',(req, res) => {
    const del_query = `DELETE FROM usuario WHERE rut='${req.params.id}';`
    con.query(del_query, (err, resultados) => {
        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)
        }
    })
});


/*****************************************************
                    BRIGADAS
*****************************************************/

app.post('/insert/brigada', bodyParser.json(), (req, res, next) => {
    const INSERT_TIPO_QUERY = `INSERT INTO brigada(n_brigada, rut_jefe, nombre, region) VALUES(${req.body.n_brigada},'${req.body.rut}','${req.body.nombre}', '${req.body.region}');`
    con.query(INSERT_TIPO_QUERY, (err, resultados) => {
        if(err) {
            res.status(500).send('Error al añadir nueva brigada');            
        } else {
            res.json(res.body)
        }
    })
})

app.get('/select/count/brigada', (req, res) => {
    const select_query=`SELECT COUNT(brigada.n_brigada) AS numero FROM brigada,combate_brigada WHERE brigada.n_brigada=combate_brigada.n_brigada AND combate_brigada.estado=1 AND brigada.nombre=combate_brigada.nombre_brigada;`
    con.query(select_query, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
     }
    });
});

app.get('/select/brigada', (req, res) => {
    const select_query=`SELECT b.nombre as nombre, c.estado as estado, c.n_brigada as n_brigada, b.rut_jefe as rut_jefe, c.id as id 
    FROM combate_brigada as c, brigada as b 
    WHERE estado=1 and c.n_brigada=b.n_brigada AND c.nombre_brigada=b.nombre;`
    con.query(select_query, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
     }
    });
});

app.get('/select/brigadas/usuario', (req, res) => {
  const select_query=`SELECT b.n_brigada, b.rut_jefe, u.nombre, u.apellidoP, u.apellidoM, b.nombre as nombre_brigada 
  FROM brigada as b, usuario as u 
  WHERE b.rut_jefe = u.rut ORDER BY n_brigada;`
  con.query(select_query, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.delete('/delete/brigada',(req, res) => {
    var id=req.param('n_brigada');
    var id2 = req.param('nombre');
    const del_query = `DELETE FROM brigada WHERE n_brigada=? AND nombre = ?;`
    con.query(del_query,[id,id2], (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)

        }
    })
});

app.get('/select/brigada/:id', (req, res) => {
  const select_query=`SELECT b.n_brigada, b.rut_jefe, u.nombre, u.apellidoP, u.apellidoM, b.nombre as nombre_brigada 
  FROM brigada as b, usuario as u 
  WHERE b.rut_jefe = u.rut AND b.rut_jefe = '${req.params.id}' ORDER BY n_brigada;`
  con.query(select_query, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.get('/select/brigada/max/nombre', (req, res) => {
    const select_query=`SELECT max(n_brigada) AS max, nombre  FROM brigada GROUP BY(nombre);`
    con.query(select_query, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
     }
    });
});

app.get('/select/distinct/brigada/nombre',(req, res) => {
    const select_query=`SELECT DISTINCT nombre, region FROM brigada ORDER BY nombre ASC;`
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
             return res.json({
                data: result
            });
        }
    });
});

app.get('/select/brigada/numero:id', (req, res) => {
    var id=req.params.id;
    const select_query=`SELECT n_brigada FROM brigada where nombre = '${id}' ORDER BY n_brigada ASC;`
    con.query(select_query, id, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
     }
    });
});

app.get('/select/jefebrigada', (req, res) => {
    var id=req.param("n_brigada");
    var id2=req.param("nombre");
    const select_query=`
    SELECT * 
    FROM brigada as b, usuario as u
    WHERE b.n_brigada=${id} AND b.nombre = '${id2}' AND b.rut_jefe = u.rut;`
    con.query(select_query, [id,id2], (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.get('/select/brigadajefe:id', (req, res) => {
    var id=req.params.id;
    const select_query=`SELECT nombre, n_brigada FROM brigada WHERE rut_jefe=?;`
    con.query(select_query,id, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
     }
    });
});


app.get('/select/brigadainactiva:id', (req, res) => {
    var id=req.params.id;
    const select_query=`SELECT *
    FROM brigada as b 
    WHERE b.rut_jefe = '${id}' AND CONCAT(b.nombre,"-",b.n_brigada) NOT IN ( 
        SELECT CONCAT(cb.nombre_brigada,"-",cb.n_brigada) 
        FROM combate_brigada as cb 
        WHERE estado = 1)`
    con.query(select_query,(err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
     }
    });
});

app.put('/update/brigada/set/jefe', bodyParser.json(), (req, res, next) => {
    var id=req.param('n_brigada');
    var id2= req.param('nombre');
    const upd_query = `UPDATE brigada SET rut_jefe='${req.body.rut}' WHERE n_brigada =? AND nombre = ?;`
    con.query(upd_query,[id,id2], (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)

        }
    })
})



/*****************************************************
                    FATIGA
*****************************************************/

app.post('/insert/fatiga', bodyParser.json(), (req, res, next) => {
    var id=req.param('n_brigada');
    var id2 = req.param('nombre_brigada');
    const combate_brig = `SELECT id, DATE_FORMAT(fecha, '%Y-%m-%d') as fecha, hora
                        FROM combate_brigada
                        ORDER by id DESC LIMIT 1;`
    con.query(combate_brig, (err, resultados) => {
        if(err) {
            res.status(500).send('Error al añadir nuevo brigadista');    
        } else {
            var idrelacion = 0;
            var fecha, hora;
            idrelacion = resultados[0].id;
            fecha = resultados[0].fecha;
            hora = resultados[0].hora
            const select_brig = `SELECT b.rut
                                FROM brigadista as b
                                WHERE b.n_brigada = ${id} AND b.nombre_brigada = '${id2}';`
            con.query(select_brig, (err, resultados2) => {
                if(err) {
                    res.status(500).send('Error al añadir nuevo brigadista');
                }else {
                    if(resultados2.length==0){
                        return res.json(resultados2.body)
                    }else{
                        var arrayAux = [];
                        arrayAux = resultados2;
                        var tam = arrayAux.length;
                        for(let i=0; i<tam; i++){
                            const INSERT_TIPO_QUERY = `INSERT INTO fatiga(rut, idcombate, fatiga, fecha, hora) VALUES('${arrayAux[i].rut}', ${idrelacion}, 0, '${fecha}', '${hora}');`
                            con.query(INSERT_TIPO_QUERY, (err3, resultados3)=>{
                                if(err3){
                                    return res.send(err3);
                                }else{
                                    res.json(res.body)
                                    res.json(resultados3.body)
                                }
                            });
                        }
                    }
                }
            })
        }
    })
});

app.get('/select/brigada/fatiga/baja', (req, res) => {
    const select_query=`SELECT IFNULL(a.fatigaBaja, 0) as fatigaBaja, d.nombre,d.n_brigada, d.estado, d.id
    FROM (SELECT b.nombre, b.n_brigada , c.estado, c.id
        FROM brigada as b, combate_brigada as c
        WHERE b.n_brigada = c.n_brigada AND b.nombre=c.nombre_brigada AND c.estado=1
        ) as d
    LEFT JOIN (
        SELECT count(b.fatigado) as fatigaBaja, b.nombre_brigada
        FROM brigadista as b, combate_brigada as c
        WHERE b.fatigado = 0 AND b.n_brigada=c.n_brigada AND b.nombre_brigada=c.nombre_brigada AND c.estado=1
        group by b.nombre_brigada
    ) as a
    ON d.nombre =a.nombre_brigada
    ORDER BY d.n_brigada;`
    con.query(select_query, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.get('/select/brigada/fatiga/media', (req, res) => {
    const select_query=`SELECT IFNULL(a.fatigaMedia, 0) as fatigaMedia, d.nombre,d.n_brigada, d.estado, d.id
    FROM (SELECT b.nombre, b.n_brigada , c.estado, c.id
        FROM brigada as b, combate_brigada as c
        WHERE b.n_brigada = c.n_brigada AND b.nombre=c.nombre_brigada AND c.estado=1
        ) as d
    LEFT JOIN (
        SELECT count(b.fatigado) as fatigaMedia, b.nombre_brigada
        FROM brigadista as b, combate_brigada as c
        WHERE b.fatigado = 1 AND b.n_brigada=c.n_brigada AND b.nombre_brigada=c.nombre_brigada AND c.estado=1
        group by b.nombre_brigada
    ) as a
    ON d.nombre =a.nombre_brigada
    ORDER BY d.n_brigada;`
    con.query(select_query, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.get('/select/brigada/fatiga/alta', (req, res) => {
    const select_query=`SELECT IFNULL(a.fatigaAlta, 0) as fatigaAlta, d.nombre,d.n_brigada, d.estado, d.id
    FROM (SELECT b.nombre, b.n_brigada , c.estado, c.id
        FROM brigada as b, combate_brigada as c
        WHERE b.n_brigada = c.n_brigada AND b.nombre=c.nombre_brigada AND c.estado=1
        ) as d
    LEFT JOIN (
        SELECT count(b.fatigado) as fatigaAlta, b.nombre_brigada
        FROM brigadista as b, combate_brigada as c
        WHERE b.fatigado = 2 AND b.n_brigada=c.n_brigada AND b.nombre_brigada=c.nombre_brigada AND c.estado=1
        group by b.nombre_brigada
    ) as a
    ON d.nombre =a.nombre_brigada
    ORDER BY d.n_brigada;`
    con.query(select_query, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.put('/update/fatigaretiro', bodyParser.json(), (req, res, next) => {
    var id=req.param('id');
    var nombre=req.param('nombre_brigada');
    var numero=req.param('n_brigada');

    const combate_brig = `SELECT id, DATE_FORMAT(fechafin, '%Y-%m-%d') as fechafin, horafin
                            FROM combate_brigada
                            WHERE estado = 0 AND idCombate = ${id}
                            ORDER BY id DESC LIMIT 1;`

    con.query(combate_brig, (err, resultados) => {
        if(err) {
            res.status(500).send('Error al añadir nuevo brigadista');    
        } else {
            var idrelacion = 0;
            var fecha, hora;
            idrelacion = resultados[0].id;
            fecha_fin = resultados[0].fechafin;
            hora_fin = resultados[0].horafin;
            const select_brig = `SELECT b.rut, b.fatigado as fatiga
                                FROM brigadista as b
                                WHERE b.n_brigada = ${numero} AND b.nombre_brigada = '${nombre}';`
            con.query(select_brig, (err, resultados2) => {
                if(err) {
                    res.status(500).send('Error al añadir nuevo brigadista');
                }else {
                    if(resultados2.length==0){
                        return res.json(resultados2.body)
                    }else{
                        var arrayAux = [];
                        arrayAux = resultados2;
                        var tam = arrayAux.length;
                        for(let i=0; i<tam; i++){
                            const UPDATE_QUERY = `
                            UPDATE fatiga 
                            SET fatiga.horafin =  '${hora_fin}', fatiga.fechafin = '${fecha_fin}', fatiga.fatiga = ${arrayAux[i].fatiga}
                            WHERE fatiga.idcombate = ${idrelacion} AND fatiga.rut = '${arrayAux[i].rut}';`
                            con.query(UPDATE_QUERY, (err3, resultados3)=>{
                                if(err3){
                                    return res.send(err3);
                                }else{
                                    res.json(res.body)
                                    res.json(resultados3.body)
                                }
                            });
                        }
                    }
                }
            })
        }
    })
})

app.put('/update/fatigaretiro/todo', bodyParser.json(), (req, res, next) => {
    var id=req.param('id');
    var nombre=req.param('nombre_brigada');
    var numero=req.param('n_brigada');

    const combate_brig = `SELECT id, DATE_FORMAT(fechafin, '%Y-%m-%d') as fechafin, horafin
                            FROM combate_brigada
                            WHERE estado = 0 AND idCombate = ${id}
                            ORDER BY id DESC LIMIT 1;`

    con.query(combate_brig, (err, resultados) => {
        if(err) {
            res.status(500).send('Error al añadir nuevo brigadista');    
        } else {
            var idrelacion = 0;
            var fecha, hora;
            idrelacion = resultados[0].id;
            fecha_fin = resultados[0].fechafin;
            hora_fin = resultados[0].horafin;
            const select_brig = `SELECT b.rut, b.fatigado as fatiga
                                FROM brigadista as b
                                WHERE b.n_brigada = ${numero} AND b.nombre_brigada = '${nombre}';`
            con.query(select_brig, (err, resultados2) => {
                if(err) {
                    res.status(500).send('Error al añadir nuevo brigadista');
                }else {
                    if(resultados2.length==0){
                        return res.json(resultados2.body)
                    }else{
                        var arrayAux = [];
                        arrayAux = resultados2;
                        var tam = arrayAux.length;
                        for(let i=0; i<tam; i++){
                            const UPDATE_QUERY = `
                            UPDATE fatiga 
                            SET fatiga.horafin =  '${hora_fin}', fatiga.fechafin = '${fecha_fin}', fatiga.fatiga = ${arrayAux[i].fatiga}
                            WHERE fatiga.idcombate = ${idrelacion} AND fatiga.rut = '${arrayAux[i].rut}';`
                            con.query(UPDATE_QUERY, (err3, resultados3)=>{
                                if(err3){
                                    return res.send(err3);
                                }else{
                                    res.json(res.body)
                                    res.json(resultados3.body)
                                }
                            });
                        }
                    }
                }
            })
        }
    })
})

app.put('/update/fatiga', bodyParser.json(), (req, res, next) => {
    var id=req.param('id');
    const combate_brig = `SELECT id, n_brigada, nombre_brigada
                            FROM combate_brigada
                            WHERE idCombate = ${id}
                            ORDER BY id DESC;`

    con.query(combate_brig, (err, resultados) => {
        if(err) {
            res.status(500).send('Error al añadir nuevo brigadista');    
        } else {
            var idrelacion = 0;
            var numero, nombre;
            idrelacion = resultados[0].id;
            numero = resultados[0].n_brigada;
            nombre = resultados[0].nombre_brigada;
            const select_brig = `SELECT b.rut, b.fatigado as fatiga
                                FROM brigadista as b
                                WHERE b.n_brigada = ${numero} AND b.nombre_brigada = '${nombre}';`
            con.query(select_brig, (err, resultados2) => {
                if(err) {
                    res.status(500).send('Error al añadir nuevo brigadista');
                }else {
                    if(resultados2.length==0){
                        return res.json(resultados2.body)
                    }else{
                        var arrayAux = [];
                        arrayAux = resultados2;
                        var tam = arrayAux.length;
                        for(let i=0; i<tam; i++){
                            const UPDATE_QUERY = `
                            UPDATE fatiga 
                            SET fatiga.fatiga = ${arrayAux[i].fatiga}
                            WHERE fatiga.idcombate = ${idrelacion} AND fatiga.rut = '${arrayAux[i].rut}';`
                            con.query(UPDATE_QUERY, (err3, resultados3)=>{
                                if(err3){
                                    return res.send(err3);
                                }else{
                                    res.json(res.body)
                                    res.json(resultados3.body)
                                }
                            });
                        }
                    }
                }
            })
        }
    })
})


/*****************************************************
                    BRIGADISTAS
*****************************************************/

app.get('/brigadistas', (req, res) => {
    var id=req.param("n_brigada");
    var id2=req.param("nombre");
    const select_query=`
    SELECT *, DATE_FORMAT(f_nacimiento, '%d/%m/%Y') as f_nacimiento
    FROM brigadista as b
    WHERE b.n_brigada=${id} AND b.nombre_brigada='${id2}'`
    con.query(select_query, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
        }
    });
});

app.get('/select/brigadistas/gps', (req, res) => {
    var n_brig=req.param("n_brigada");
    var nombre_brig=req.param("nombre");
    const select_query=`
    SELECT b.rut, b.nombre, b.apellidoP, b.apellidoM,  b.fatigado, d.LAT as latitud, d.LNG as longitud, DATE_FORMAT(d.fecha_reg, '%Y-%m-%d') as fecha, DATE_FORMAT(d.fecha_reg, '%H:%i') as hora
    FROM brigadista as b LEFT JOIN reg_fire as d ON d.ID_OP=b.pulsera
        INNER JOIN (SELECT d.ID_OP as pulsera, MAX(TIMESTAMP(d.fecha_reg)) as ul_fecha
                    FROM brigadista as b LEFT JOIN reg_fire as d ON d.ID_OP=b.pulsera
                    GROUP BY(b.rut)) AS ul_reg ON ul_reg.pulsera=b.pulsera AND ul_reg.ul_fecha=TIMESTAMP(d.fecha_reg)
    WHERE b.n_brigada=${n_brig} AND b.nombre_brigada='${nombre_brig}';`
    con.query(select_query, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
     }
    });
});

app.get('/brigadista', (req, res) => {
    var id=req.param("n_brigada");
    var id2=req.param("nombre");
    const select_query=`
    SELECT *, DATE_FORMAT(f_nacimiento, '%d/%m/%Y') as f_nacimiento
    FROM brigadista as b
    WHERE b.n_brigada=${id} AND b.nombre_brigada='${id2}'`
    con.query(select_query, [id,id2], (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.get('/brigadista/brigada/:id', (req, res) => {
    var id=req.params.id;
    const select_query=`
    SELECT cb.estado as estado, DATE_FORMAT(cb.fecha, "%d-%m-%Y") as ini_combate, DATE_FORMAT(cb.hora, "%H:%i:%s") as ini_hora_combate,
        DATE_FORMAT(cb.fechafin, "%d-%m-%Y") as fin_combate, DATE_FORMAT(cb.horafin, "%H:%i:%s") as fin_hora_combate,
        CONCAT(bg.nombre, " ", bg.apellidoP," ", bg.apellidoM) as brigadista, bg.rut as rut, bg.cargo as cargo, bg.pulsera as pulsera,
        bg.correo as correo, f.fatiga as fatiga
    FROM combate_brigada as cb, brigadista as bg, fatiga as f 
    WHERE cb.n_brigada = bg.n_brigada AND cb.nombre_brigada = bg.nombre_brigada AND bg.rut = f.rut AND cb.id = f.idcombate AND cb.id = ${id}`
    con.query(select_query, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.get('/count/brigadista', bodyParser.json(), (req, res, next) => {
    var nombre = req.param('nombre');
    var numero = req.param('numero');
    const select_query=`
    SELECT count(*) as cantidad
    FROM brigadista as b, brigada as bg
    WHERE bg.n_brigada=b.n_brigada AND bg.nombre = b.nombre_brigada AND b.n_brigada=${numero} AND b.nombre_brigada='${nombre}'`
    con.query(select_query, (err, result) => {

        if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
        }
    });
});


app.post('/insert/brigadista', bodyParser.json(), (req, res, next) => {
    var id=req.param('n_brigada');
    var id2 = req.param('nombre_brigada');
    const INSERT_TIPO_QUERY = `
    INSERT INTO brigadista(rut, correo, nombre, apellidoP, apellidoM, f_nacimiento, n_brigada, cargo, peso, altura, fatigado, pulsera, nombre_brigada) 
    VALUES('${req.body.rut}','${req.body.correo}','${req.body.nombre}','${req.body.apellidoP}','${req.body.apellidoM}','${req.body.f_nacimiento}',${id},'${req.body.cargo}',${req.body.peso},${req.body.altura},'0','${req.body.pulsera}','${id2}');`
    con.query(INSERT_TIPO_QUERY,[id,id2], (err, resultados) => {
        if(err) {
            res.status(500).send('Error al añadir nuevo brigadista');
            
        } else {
            res.json(res.body)

        }
    })
})

app.get('/select/brigadista/data/last/:rut', (req, res) => {
    var rut=req.params.rut;
    const select_query=`
    SELECT  b.rut, b.nombre, b.apellidoP, b.apellidoM, d.ID_OP, d.id_reg, TIMESTAMPDIFF(YEAR,b.f_nacimiento,CURDATE()) AS edad, 
    d.T_ex as t_ambiental, d.T_in as t_corporal, d.Pul as pulsaciones, d.OD as saturacion, d.LAT as latitud, d.LNG as longitud, d.ELE as altitud,  b.fatigado
    FROM
        (SELECT id, fecha
        FROM combate_brigada as cb, brigadista as b
        WHERE b.rut = '${rut}' AND b.n_brigada = cb.n_brigada AND b.nombre_brigada=cb.nombre_brigada
        ORDER BY cb.fecha DESC , cb.hora DESC
        LIMIT 1) as c, (SELECT max(fecha_reg) as fecha, ID_OP
        FROM reg_fire group by ID_OP) as x, brigadista as b, reg_fire as d
        WHERE b.rut='${rut}' AND b.pulsera=d.ID_OP AND x.ID_OP=d.ID_OP AND d.fecha_reg=x.fecha 
        ORDER BY d.fecha_reg DESC LIMIT 1`
   
    con.query(select_query,[rut,rut], (err, result) => {
     if (err){
           return res.send(err)
        }else{
            
            return res.json({

                data: result

            })

     }
    });
});

app.get('/select/brigadista/gps/last/:rut', (req, res) => {
    var rut=req.params.rut;
    const select_query=`
    SELECT b.rut, b.fatigado, d.ID_OP, d.id_reg as id, d.LAT as latitud, d.LNG as longitud, DATE_FORMAT(d.fecha_reg, '%Y-%m-%d') as fecha, DATE_FORMAT(d.fecha_reg, '%H:%i') as hora
    FROM
        (SELECT id, fecha
        FROM combate_brigada as cb, brigadista as b
        WHERE b.rut = '${rut}' AND b.n_brigada = cb.n_brigada AND b.nombre_brigada=cb.nombre_brigada
        ORDER BY cb.fecha DESC , cb.hora DESC
        LIMIT 1) as c,  (SELECT DATE_FORMAT(max(fecha_reg), '%Y-%m-%d') as fecha, ID_OP FROM reg_fire GROUP BY ID_OP) as x, reg_fire as d, brigadista as b
    
    WHERE
         b.rut='${rut}' AND b.pulsera=d.ID_OP AND x.ID_OP=d.ID_OP AND  DATE_FORMAT(d.fecha_reg, '%Y-%m-%d') = x.fecha AND c.fecha = DATE_FORMAT(d.fecha_reg, '%Y-%m-%d')
     
      ORDER BY d.fecha_reg DESC LIMIT 20`
    
    con.query(select_query, (err, result) => {

     if (err){
           return res.send(err)
        }else{

            return res.json({

                data: result

            })
     }
    });
});

app.delete('/delete/brigadista/:id',(req, res) => {
    var id=req.params.id;
    const del_query = `DELETE FROM brigadista WHERE rut='${id}';`
    con.query(del_query, (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)

        }
    })
});



/*****************************************************
                    COMBATE - BRIGADA
*****************************************************/

app.get('/select/combate/brigada/brigadista/:rut', (req, res) => {
    var rut=req.params.rut;
    const select_query=`
    SELECT cb.n_brigada, cb.nombre_brigada, cb.id, cb.estado, DATE_FORMAT(cb.fecha, '%Y-%m-%d') as fecha, cb.hora
    FROM combate_brigada as cb,
        (
            SELECT n_brigada, nombre_brigada
            FROM brigadista
            where rut = '${rut}'
        ) as aux
    where aux.n_brigada = cb.n_brigada and aux.nombre_brigada = cb.nombre_brigada and estado = 1;`
    con.query(select_query, (err, result) => {
    if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
        }
    });
});

app.get('/select/data/:rut', (req, res) => {
    var rut=req.params.rut;
    const select_query=`SELECT b.rut,d.ID_OP, d.id_reg as id, d.Pul as pulsaciones, d.T_in as t_corporal, d.T_ex as t_ambiental, d.OD as saturacion, DATE_FORMAT(d.fecha_reg, '%Y-%m-%d') as fecha, DATE_FORMAT(d.fecha_reg, '%H:%i') as hora
    FROM
        (SELECT id, fecha
        FROM combate_brigada as cb, brigadista as b
        WHERE b.rut = '${rut}' AND b.n_brigada = cb.n_brigada AND b.nombre_brigada=cb.nombre_brigada
        ORDER BY cb.fecha DESC , cb.hora DESC
        LIMIT 1) as c,  (SELECT DATE_FORMAT(max(fecha_reg), '%Y-%m-%d') as fecha, ID_OP FROM reg_fire GROUP BY ID_OP) as x, reg_fire as d, brigadista as b
    
    WHERE
         b.rut='${rut}' AND b.pulsera=d.ID_OP AND x.ID_OP=d.ID_OP AND  DATE_FORMAT(d.fecha_reg, '%Y-%m-%d') = x.fecha AND c.fecha = DATE_FORMAT(d.fecha_reg, '%Y-%m-%d')
      ORDER BY d.fecha_reg DESC LIMIT 20`
    
    con.query(select_query, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })

     }
    });
});

app.get('/select/data/last/:rut', (req, res) => {
    var rut=req.params.rut;
    const select_query=`SELECT b.rut,d.ID_OP, d.id_reg as id, d.Pul as pulsaciones, d.T_in as t_corporal, d.T_ex as t_ambiental, d.OD as saturacion, DATE_FORMAT(d.fecha_reg, '%Y-%m-%d') as fecha, DATE_FORMAT(d.fecha_reg, '%H:%i') as hora
    FROM
        (SELECT id, fecha
        FROM combate_brigada as cb, brigadista as b
        WHERE b.rut = '${rut}' AND b.n_brigada = cb.n_brigada AND b.nombre_brigada=cb.nombre_brigada
        ORDER BY cb.fecha DESC , cb.hora DESC
        LIMIT 1) as c,  (SELECT DATE_FORMAT(max(fecha_reg), '%Y-%m-%d') as fecha, ID_OP FROM reg_fire GROUP BY ID_OP) as x, reg_fire as d, brigadista as b  
    WHERE
         b.rut='${rut}' AND b.pulsera=d.ID_OP AND x.ID_OP=d.ID_OP AND  DATE_FORMAT(d.fecha_reg, '%Y-%m-%d') = x.fecha AND c.fecha = DATE_FORMAT(d.fecha_reg, '%Y-%m-%d')
      ORDER BY d.fecha_reg DESC LIMIT 1`
    
    con.query(select_query, (err, result) => {

     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

        })
     }
    });
});

app.get('/select/combatebrigada/activa/:id', (req, res) => {
    var idCombate=req.params.id;
    const select_query=`SELECT n_brigada, nombre_brigada
    FROM combate_brigada
    WHERE estado = 1 AND idCombate = ${idCombate};`
    con.query(select_query, (err, result) => {

     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })

     }
    });
});

app.post('/insert/combate/brigada', bodyParser.json(), (req, res, next) => {
    var n_brigada = req.body.n_brigada.numero
    var nombre = req.body.n_brigada.nombre
    var id = req.body.id

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

    let hora = `${hours}:${min}:${sec}`;
    con.query( `INSERT INTO combate_brigada(idCombate, n_brigada, nombre_brigada, estado, fecha, hora) 
        VALUES (${id}, ${n_brigada},'${nombre}',1,'${fecha}','${hora}');`, (err, resultados) => {
    if(err) {
        res.status(500).send('La brigada seleccionada ya posee un combate activo');
    }else {
        res.json(res.body)
    }
    })  
})

app.put('/update/combate/brigada/retiro', bodyParser.json(), (req, res, next)=> {
    var n_brigada = req.body.n_brigada
    var nombre = req.body.nombre_brigada
    var id = req.body.id
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

    const del_query = `
    UPDATE combate_brigada 
    SET estado=0, combate_brigada.horafin = '${hours}:${min}:${sec}', combate_brigada.fechafin = '${fecha}'
    WHERE n_brigada=? AND idCombate=? AND estado=1 AND nombre_brigada=?;`
    con.query(del_query,[n_brigada,id,nombre], (err, resultados) => {
        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)

        }

    })
});

app.put('/update/combatebrigada/unir', bodyParser.json(), (req, res, next) => {    
    var n_brigada=req.body.n_brigada
    var nombre= req.body.nombre_brigada;
    var id= req.body.id;

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
    const UPDATE_TIPO_QUERY = `
    UPDATE combate_brigada 
    SET combate_brigada.estado=1, combate_brigada.fecha='${fecha}', combate_brigada.hora='${hours}:${min}:${sec}', combate_brigada.fecharetiro = NULL, combate_brigada.horaretiro = NULL
    WHERE n_brigada= '${n_brigada}' AND idCombate='${id}'AND nombre_brigada='${nombre}';`
    con.query( UPDATE_TIPO_QUERY, (err, resultados) => {

        if(err) {
            res.status(500).send('La brigada seleccionada ya posee un combate activo');
        }else {
            res.json(res.body)
        }
    })  
});

app.put('/update/combatebrigada/fatiga', bodyParser.json(), (req, res, next) => {    
    var n_brigada=req.body.n_brigada
    var nombre= req.body.nombre_brigada;
    var id= req.body.id;

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
    const UPDATE_TIPO_QUERY = `
    UPDATE fatiga 
    SET hora = '${fecha}', fecha = '${hours}:${min}:${sec}', fatiga = 0
    WHERE n_brigada= '${n_brigada}' AND id='${id}'AND nombre_brigada='${nombre}';`
    con.query( UPDATE_TIPO_QUERY, (err, resultados) => {

        if(err) {
            res.status(500).send('La brigada seleccionada ya posee un combate activo');
        }else {
            res.json(res.body)
        }
    })  
});


/*****************************************************
                    COMBATE 
*****************************************************/

app.post('/insert/combate', bodyParser.json(), (req, res, next) => {
    const INSERT_TIPO_QUERY = `INSERT INTO combate(hito,estado,fecha,hora) 
     VALUES('${req.body.hito}','1','${req.body.fecha}','${req.body.hora}');`
    con.query(INSERT_TIPO_QUERY, (err, resultados) => {

        if(err) {
            res.status(500).send('Error al añadir nuevo combate');
           
        } else {
            res.json(res.body)

        }
    })
})

app.get('/combates', (req, res) => {
    const select_query=`SELECT *,DATE_FORMAT(fecha, '%d/%m/%y') as fecha FROM combate ORDER BY id DESC;`
    con.query(select_query, (err, result) => {
    if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.get('/combate/activo',(req, res) => {
    const select_query=`SELECT *, DATE_FORMAT(fecha, '%Y-%m-%d') as fecha FROM combate WHERE estado=1;`
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result
            });
        }
    });
});


app.get('/combates/activos', (req, res) => {
    const select_query=`SELECT *,DATE_FORMAT(fecha, '%d/%m/%y') as fecha FROM combate WHERE estado=1 ORDER BY id DESC;`
    con.query(select_query, (err, result) => {
    if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.get('/combate/brigada:id', (req, res) => {
    var id=req.params.id;
    const select_query=`
        SELECT nombre_brigada, n_brigada, id, DATE_FORMAT(fecha, '%d/%m/%y') as fecha, DATE_FORMAT(hora, '%H:%i') as hora, estado 
        FROM combate_brigada
        where idCombate = ?;`
    con.query(select_query,id, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result

            })
     }
    });
});

app.put('/combate/fin/:id',(req, res) => {
    var id=req.params.id;

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

    const del_query = `UPDATE combate 
    SET estado = 0, horafin='${hours}:${min}:${sec}', fechafin = '${fecha}'
    WHERE id=?;`
    con.query(del_query,id, (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            res.json(res.body);            
        }
    })
});

app.get('/select/combate/hito/:id', (req, res) => {
    var id=req.params.id;
    const select_query=`SELECT hito FROM combate WHERE id=?; `
    con.query(select_query,id, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
});

app.put('/update/combate/:id', bodyParser.json(), (req, res, next) => {
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

app.get('/combates/todosactivos',(req, res) => {
    const select_query=`
    SELECT DISTINCT c.id as combate,  c.hito as hito, c.estado as estado_combate, c.estado as estado,
        DATE_FORMAT(c.fecha, "%d-%m-%Y") as ini_combate, DATE_FORMAT(c.hora, "%H:%i:%s") as ini_hora_combate, 
        DATE_FORMAT(c.fechafin, "%d-%m-%Y") as fin_combate, DATE_FORMAT(c.horafin, "%H:%i:%s") as fin_hora_combate
    FROM combate as c LEFT JOIN combate_brigada as cb ON c.id = cb.idCombate, combate_brigada LEFT JOIN fatiga AS f ON combate_brigada.id = f.idcombate
    WHERE c.estado = 1
    GROUP BY c.id, cb.id, cb.n_brigada, cb.nombre_brigada`
    
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result
            });
        }
    });
});

app.get('/combates/mes',(req, res) => {
    const select_query=`
    SELECT DISTINCT c.id as combate,  c.hito as hito, c.estado as estado_combate, c.estado as estado,
        DATE_FORMAT(c.fecha, "%d-%m-%Y") as ini_combate, DATE_FORMAT(c.hora, "%H:%i:%s") as ini_hora_combate, 
        DATE_FORMAT(c.fechafin, "%d-%m-%Y") as fin_combate, DATE_FORMAT(c.horafin, "%H:%i:%s") as fin_hora_combate
    FROM combate as c LEFT JOIN combate_brigada as cb ON c.id = cb.idCombate, 
        combate_brigada LEFT JOIN fatiga AS f ON combate_brigada.id = f.idcombate
        WHERE DATE_FORMAT(c.fecha,'%Y-%m') >=  DATE_FORMAT(now() - interval 1 month,'%Y-%m')
    GROUP BY c.id, cb.id, cb.n_brigada, cb.nombre_brigada`
    
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result
            });
        }
    });
});

app.get('/combates/6mes',(req, res) => {
    const select_query=`
    SELECT DISTINCT c.id as combate,  c.hito as hito, c.estado as estado_combate, c.estado as estado,
        DATE_FORMAT(c.fecha, "%d-%m-%Y") as ini_combate, DATE_FORMAT(c.hora, "%H:%i:%s") as ini_hora_combate, 
        DATE_FORMAT(c.fechafin, "%d-%m-%Y") as fin_combate, DATE_FORMAT(c.horafin, "%H:%i:%s") as fin_hora_combate
    FROM combate as c LEFT JOIN combate_brigada as cb ON c.id = cb.idCombate,
        combate_brigada LEFT JOIN fatiga AS f ON combate_brigada.id = f.idcombate
        WHERE DATE_FORMAT(c.fecha,'%Y-%m') >=  DATE_FORMAT(now() - interval 6 month,'%Y-%m')
    GROUP BY c.id, cb.id, cb.n_brigada, cb.nombre_brigada`
    
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result
            });
        }
    });
});

app.get('/combates/anio',(req, res) => {
    const select_query=`
    SELECT DISTINCT c.id as combate,  c.hito as hito, c.estado as estado_combate, c.estado as estado,
        DATE_FORMAT(c.fecha, "%d-%m-%Y") as ini_combate, DATE_FORMAT(c.hora, "%H:%i:%s") as ini_hora_combate, 
        DATE_FORMAT(c.fechafin, "%d-%m-%Y") as fin_combate, DATE_FORMAT(c.horafin, "%H:%i:%s") as fin_hora_combate
    FROM combate as c LEFT JOIN combate_brigada as cb ON c.id = cb.idCombate,
        combate_brigada LEFT JOIN fatiga AS f ON combate_brigada.id = f.idcombate
        WHERE  DATE_FORMAT(c.fecha,'%Y-%m') >=  DATE_FORMAT(now() - interval 1 year,'%Y-%m')
        GROUP BY c.id, cb.id, cb.n_brigada, cb.nombre_brigada`
    
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result
            });
        }
    });
});


app.get('/combates/todos',(req, res) => {
    const select_query=`
    SELECT DISTINCT c.id as combate,  c.hito as hito, c.estado as estado_combate, c.estado as estado,
        DATE_FORMAT(c.fecha, "%d-%m-%Y") as ini_combate, DATE_FORMAT(c.hora, "%H:%i:%s") as ini_hora_combate, 
        DATE_FORMAT(c.fechafin, "%d-%m-%Y") as fin_combate, DATE_FORMAT(c.horafin, "%H:%i:%s") as fin_hora_combate
    FROM combate as c LEFT JOIN combate_brigada as cb ON c.id = cb.idCombate, combate_brigada LEFT JOIN fatiga AS f ON combate_brigada.id = f.idcombate
    GROUP BY c.id, cb.id, cb.n_brigada, cb.nombre_brigada`
    
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result
            });
        }
    });
});


/**********************************************
        COMBATE_BRIGADA
**********************************************/

app.get('/combatebrig/mes',(req, res) => {
    const select_query=`
    SELECT cb.id, cb.n_brigada, cb.nombre_brigada, 
        DATE_FORMAT(cb.fecha, "%d-%m-%Y") as ini_combate, 
        DATE_FORMAT(cb.hora, "%H:%i:%s") as ini_hora_combate, 
        DATE_FORMAT(cb.fechafin, "%d-%m-%Y") as fin_combate, 
        DATE_FORMAT(cb.horafin, "%H:%i:%s") as fin_hora_combate, 
        cb.estado, cb.idCombate, c.hito
    FROM combate_brigada as cb LEFT JOIN combate as c  ON c.id = cb.idCombate , 
        combate_brigada LEFT JOIN fatiga AS f ON combate_brigada.id = f.idcombate
    WHERE DATE_FORMAT(c.fecha,'%Y-%m') >=  DATE_FORMAT(now() - interval 1 month,'%Y-%m')
    GROUP BY c.id, cb.id, cb.n_brigada, cb.nombre_brigada`
    
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result
            });
        }
    });
});

app.get('/combatebrig/6mes',(req, res) => {
    const select_query=`
    SELECT cb.id, cb.n_brigada, cb.nombre_brigada, 
        DATE_FORMAT(cb.fecha, "%d-%m-%Y") as ini_combate, 
        DATE_FORMAT(cb.hora, "%H:%i:%s") as ini_hora_combate, 
        DATE_FORMAT(cb.fechafin, "%d-%m-%Y") as fin_combate, 
        DATE_FORMAT(cb.horafin, "%H:%i:%s") as fin_hora_combate, 
        cb.estado, cb.idCombate, c.hito
    FROM combate_brigada as cb LEFT JOIN combate as c  ON c.id = cb.idCombate,  
        combate_brigada LEFT JOIN fatiga AS f ON combate_brigada.id = f.idcombate
    WHERE DATE_FORMAT(c.fecha,'%Y-%m') >=  DATE_FORMAT(now() - interval 6 month,'%Y-%m')
    GROUP BY c.id, cb.id, cb.n_brigada, cb.nombre_brigada`
    
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result
            });
        }
    });
});

app.get('/combatebrig/anio',(req, res) => {
    const select_query=`
    SELECT cb.id, cb.n_brigada, cb.nombre_brigada, 
        DATE_FORMAT(cb.fecha, "%d-%m-%Y") as ini_combate, 
        DATE_FORMAT(cb.hora, "%H:%i:%s") as ini_hora_combate, 
        DATE_FORMAT(cb.fechafin, "%d-%m-%Y") as fin_combate, 
        DATE_FORMAT(cb.horafin, "%H:%i:%s") as fin_hora_combate, 
        cb.estado, cb.idCombate, c.hito
    FROM combate_brigada as cb LEFT JOIN combate as c  ON c.id = cb.idCombate, 
        combate_brigada LEFT JOIN fatiga AS f ON combate_brigada.id = f.idcombate
    WHERE DATE_FORMAT(c.fecha,'%Y-%m') >=  DATE_FORMAT(now() - interval 1 year,'%Y-%m')
    GROUP BY c.id, cb.id, cb.n_brigada, cb.nombre_brigada`
    
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result
            });
        }
    });
});

app.get('/combatebrig/todos',(req, res) => {
    const select_query=`
    SELECT cb.id, cb.n_brigada, cb.nombre_brigada, 
        DATE_FORMAT(cb.fecha, "%d-%m-%Y") as ini_combate, 
        DATE_FORMAT(cb.hora, "%H:%i:%s") as ini_hora_combate, 
        DATE_FORMAT(cb.fechafin, "%d-%m-%Y") as fin_combate, 
        DATE_FORMAT(cb.horafin, "%H:%i:%s") as fin_hora_combate, 
        cb.estado, cb.idCombate, c.hito
    FROM combate_brigada as cb LEFT JOIN combate as c  ON c.id = cb.idCombate,  
        combate_brigada LEFT JOIN fatiga AS f ON combate_brigada.id = f.idcombate
    GROUP BY c.id, cb.id, cb.n_brigada, cb.nombre_brigada`
    
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result
            });
        }
    });
});

app.get('/combatebrig/fatiga/:id', (req, res) => {
    var id=req.params.id;
    const select_query=`select n_brigada, nombre_brigada from combate_brigada where id=?;`
    con.query(select_query,id, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result

            })
     }
    });
});

app.get('/combatebrig/registro/:id', (req, res) => {
    var id=req.params.id;
    const select_query=`
    SELECT cb.n_brigada as num_brigada, cb.nombre_brigada as nombre_brigada, cb.estado as estado,
        DATE_FORMAT(cb.fecha, "%d-%m-%Y") as ini_brig_combate, DATE_FORMAT(cb.hora, "%H:%i:%s") as ini_hora_brig_combate, 
        DATE_FORMAT(cb.fechafin, "%d-%m-%Y") as fin_brig_combate, DATE_FORMAT(cb.horafin, "%H:%i:%s") as fin_hora_brig_combate,
        bg.region as region, CONCAT(u.nombre," ",u.apellidoP," ",u.apellidoM) as jefe, 
        CONCAT(b.nombre," ",b.apellidoP," ",b.apellidoM) as brigadista, b.rut as rut_brigadista, 
        b.cargo as cargo, b.pulsera, f.fatiga as fatiga_combate
    FROM combate as c, combate_brigada as cb, brigada as bg, brigadista as b, fatiga as f, usuario as u
    WHERE c.id = cb.idCombate AND cb.id = f.idcombate AND cb.n_brigada=bg.n_brigada AND cb.nombre_brigada=bg.nombre 
    AND f.rut=b.rut AND bg.rut_jefe = u.rut AND c.id = ${id}`
    con.query(select_query,id, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result

            })
     }
    });
});

app.get('/combatebrig/data/:id', (req, res) => {
    var id=req.params.id;
    const select_query=`
    SELECT CONCAT(bg.nombre,"-",bg.n_brigada) as brigada, CONCAT(u.nombre," ",u.apellidoP," ",u.apellidoM) as jefe, c.hito as hito
    FROM combate_brigada AS cb, brigada as bg, usuario as u, combate as c
    WHERE cb.n_brigada = bg.n_brigada AND cb.nombre_brigada = bg.nombre AND bg.rut_jefe = u.rut AND cb.idCombate = c.id AND cb.id = ${id}`
    con.query(select_query,id, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result

            })
     }
    });
});





/*****************************************************
                    REGION
*****************************************************/

app.get('/region', (req, res) => {
    const select_query=`SELECT * FROM region;`
    con.query(select_query, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result
            })
     }
    });
});


/*****************************************************
                    PULSERA-BRIGADISTA
*****************************************************/


app.get('/select/pulsera/brigadista/disponible',(req, res) => {
    const select_query=`SELECT p.id FROM pulsera as p WHERE p.id NOT IN(
            SELECT p2.id FROM pulsera as p2, brigadista as b WHERE p2.id = b.pulsera);`
    con.query(select_query, (err, result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result
            });
        }
    });
});


app.put('/update/brigadista/condicion/:id', bodyParser.json(), (req, res, next) => {
    var id=req.params.id;
    const upd_query = `UPDATE brigadista SET peso=${req.body.peso}, altura=${req.body.altura} WHERE rut =?;`
    con.query(upd_query,id, (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)

        }
    })
})


app.put('/update/brigadista/brigada/:id', bodyParser.json(), (req, res, next) => {
    var id=req.params.id;
    const upd_query = `UPDATE brigadista SET n_brigada=${req.body.n_brigada}, cargo='${req.body.cargo}', pulsera=${req.body.pulsera},nombre_brigada='${req.body.nombre_brigada}' WHERE rut =?;`
    con.query(upd_query,id, (err, resultados) => {

        if(err) {
            return res.send(err)
        } else {
            res.json(res.body)

        }
    })
})





var server = app.listen(8000, function () {
    console.log('Server is running..');
});
