//gl_matrix

var mt = mat4.create();
mat4.rotate(mt,mt,angle,axis);
mat4.translate(mt,mt,translation);
mat4.scale(mt,mt,scale);

//Importante, guardar na memoria, atraves de:
node.mat = mat4.clone(mt);

//Nao declarar atributos fora do sitio apropriado (construtor)
