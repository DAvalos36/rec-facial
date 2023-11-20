type Alumno = {
	nombre: string;
	apellido_paterno: string;
	apellido_materno: string;
};

const alumnos = new Map<string, Alumno>();

alumnos.set('C19410231', {nombre: 'SERGIO MARTIN', apellido_paterno: 'GARCIA', apellido_materno: 'ESPARZA'});
alumnos.set('C18410942', {nombre: 'JUAN PABLO', apellido_paterno: 'BERNAL', apellido_materno: 'YAÑEZ'});
alumnos.set('B17740215', {nombre: 'LUISA ALEJANDRA', apellido_paterno: 'PRADO', apellido_materno: 'MELENDEZ'});
alumnos.set('20410499', {nombre: 'SANDRA YARETH', apellido_paterno: 'ROMERO', apellido_materno: 'CANO'});
alumnos.set('19410598', {nombre: 'IDALIA GUADALUPE', apellido_paterno: 'VALENCIA', apellido_materno: 'PULIDO'});
alumnos.set('19410597', {nombre: 'ALAN JESUS', apellido_paterno: 'SOTO', apellido_materno: 'SAENZ'});
alumnos.set('19410591', {nombre: 'SAUL ADRIAN', apellido_paterno: 'IBARRA', apellido_materno: 'VAZQUEZ'});
alumnos.set('19410588', {nombre: 'VICTOR HUGO', apellido_paterno: 'COVARRUBIAS', apellido_materno: 'HERNANDEZ'});
alumnos.set('19410586', {nombre: 'DAVID OCTAVIO', apellido_paterno: 'AVALOS', apellido_materno: 'LOYA'});
alumnos.set('19410529', {nombre: 'KEVIN FAUSTINO', apellido_paterno: 'SUBIAS', apellido_materno: 'GUTIERREZ'});
alumnos.set('19410269', {nombre: 'YARITZA CORAZON', apellido_paterno: 'LEYVA', apellido_materno: 'PORTILLO'});
alumnos.set('19410265', {nombre: 'JESUS EDUARDO', apellido_paterno: 'HERNANDEZ', apellido_materno: 'CASTRO'});
alumnos.set('19410262', {nombre: 'OSCAR GIOVANNI', apellido_paterno: 'FIGUEROA', apellido_materno: 'TALAMANTES'});
alumnos.set('19410261', {nombre: 'ISAAC', apellido_paterno: 'FERNANDEZ', apellido_materno: 'NAVARRO'});
alumnos.set('19410257', {nombre: 'KEVIN ADRIAN', apellido_paterno: 'CERECERES', apellido_materno: 'BARRAZA'});
alumnos.set('19410255', {nombre: 'ADRIAN ALEJANDRO', apellido_paterno: 'CAMPUZANO', apellido_materno: 'CIBRIAN'});
alumnos.set('19410254', {nombre: 'JUAN CARLOS', apellido_paterno: 'BARRAZA', apellido_materno: 'URIAS'});
alumnos.set("19410251", {nombre: 'KENNETH GERARDO', apellido_paterno: 'AGUIRRE', apellido_materno: 'DOMINGUEZ'});
alumnos.set("19410250", {nombre: 'IVAN GILBERTO', apellido_paterno: 'ACOSTA', apellido_materno: 'TARIN'});
alumnos.set("18410762", {nombre: 'MANUEL DANIEL', apellido_paterno: 'OLLOQUI', apellido_materno: 'RODRIGUEZ'});

export default alumnos;