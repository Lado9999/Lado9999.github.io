var vertexShaderText = 
[
	'precision mediump float;',
	'',
	'attribute vec2 vertPosition;',
	'attribute vec3 vertColor;',
	'varying vec3 fragColor;',
	'',
	'void main()',
	'{',
	'	fragColor = vertColor;',
	'	gl_Position = vec4(vertPosition, 0.0, 1.0);',
	'}',
].join('\n');

let fragmentShaderText =
[
	'precision mediump float;',
	'',
	'varying vec3 fragColor;',
	'void main()',
	'{',
	'	gl_FragColor = vec4(fragColor, 1.0);',
	'}'
].join('\n');

let canvas = document.getElementById('canvas');
let gl = canvas.getContext('webgl2');

if(!gl){
	console.log('WebGL2 not supported, webgl');
	gl = canvas.getContext('webgl');
}

if(!gl){
	console.log('WebGL not supported, falling back on experimental-webgl');
	gl = canvas.getContext('experimental-webgl');
}

if(!gl){
	console.log('Browser doesn\'t support WebGL');
}

gl.clearColor(0.75, 0.85, 0.8, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//
// create shaders
//
let vertexShader = gl.createShader(gl.VERTEX_SHADER);
let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertexShader, vertexShaderText);
gl.shaderSource(fragmentShader, fragmentShaderText);

gl.compileShader(vertexShader);
if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
	throw new Error('ERROR compilig vertex shader!\n' + gl.getShaderInfoLog(vertexShader));
}

gl.compileShader(fragmentShader);
if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
	throw new Error('ERROR compilig fragment shader!\n' + gl.getShaderInfoLog(fragmentShader));
}

let program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
	throw new Error('ERROR linking program!\n' + gl.getProgramInfoLog(program));
}
gl.validateProgram(program);
if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
	throw new Error('ERROR validating program!\n' + gl.getProgramInfoLog(program));
}

//
// create buffer
//
let triangleVertices =
	[ //  x,    y     r,   g,   b
	  	 0.0,  0.5,  1.0, 0.0, 0.0,
	  	-0.5, -0.5,  0.0, 1.0, 0.0,
	  	 0.5, -0.5,  0.0, 0.0, 1.0
	]

let triangleVertexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

gl.vertexAttribPointer(
	positionAttribLocation, // Attribute location
	2, // # of elements per attribute
	gl.FLOAT, // type of elements
	gl.FALSE,
	5 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
	0, // offset
);
gl.vertexAttribPointer(
	colorAttribLocation, // Attribute location
	3, // # of elements per attribute
	gl.FLOAT, // type of elements
	gl.FALSE,
	5 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
	2 * Float32Array.BYTES_PER_ELEMENT, // offset
);

gl.enableVertexAttribArray(positionAttribLocation);
gl.enableVertexAttribArray(colorAttribLocation);

//
// main render loop
//
gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);



















